"""
Tajweed Analysis API - FastAPI Backend
Host this on Railway, Render, or Google Cloud Run

Requirements (requirements.txt):
    fastapi
    uvicorn
    python-multipart
    librosa
    torch
    transformers
    phonemizer
    numpy

System requirement: espeak-ng (apt-get install espeak-ng)
"""

import os
import re
import tempfile
import difflib
from typing import List, Optional

import numpy as np
import librosa
import torch
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC
from phonemizer import phonemize
from phonemizer.separator import Separator

app = FastAPI(title="Tajweed Analysis API")

# CORS - allow all origins for development (restrict in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===============================
# PYDANTIC MODELS
# ===============================

class TajweedError(BaseModel):
    position: int
    expected_phoneme: str
    got_phoneme: str
    is_haa_error: bool
    description: str


class TajweedResult(BaseModel):
    transcription: str
    phonemes: str
    errors: List[TajweedError]
    score: int
    expected_text: str


# ===============================
# GLOBAL MODEL (loaded once)
# ===============================
processor = None
model = None


@app.on_event("startup")
async def load_model():
    global processor, model
    print("⏳ Loading Wav2Vec2 Arabic model...")
    model_name = "jonatasgrosman/wav2vec2-large-xlsr-53-arabic"
    processor = Wav2Vec2Processor.from_pretrained(model_name)
    model = Wav2Vec2ForCTC.from_pretrained(model_name)
    print("✅ Model loaded")


# ===============================
# HELPER FUNCTIONS
# ===============================

def remove_diacritics(text: str) -> str:
    """Remove Arabic diacritics"""
    arabic_diacritics = re.compile(r'[\u064B-\u0652\u0640]')
    return re.sub(arabic_diacritics, '', text)


def preprocess_audio(audio_path: str):
    """Load and preprocess audio for better transcription"""
    speech, sr = librosa.load(audio_path, sr=16000)
    speech, _ = librosa.effects.trim(speech, top_db=20)
    speech = speech / (np.max(np.abs(speech)) + 1e-8)
    padding = np.zeros(int(0.5 * sr))
    speech = np.concatenate([speech, padding])
    return speech, sr


def fix_incomplete_transcription(text: str) -> str:
    """Fix common transcription cut-offs"""
    text = text.strip()
    if text.endswith('الرحي'):
        text = text + 'م'
    if 'الرحم ' in text and 'الرحمن' not in text:
        text = text.replace('الرحم ', 'الرحمن ')
    if 'الرحمن الرحي' in text and not text.endswith('الرحيم'):
        text = re.sub(r'الرحمن الرحي$', 'الرحمن الرحيم', text)
    return text


def transcribe_audio(audio_path: str) -> str:
    """Transcribe audio to Arabic text"""
    speech, sr = preprocess_audio(audio_path)
    
    inputs = processor(
        speech,
        sampling_rate=16000,
        return_tensors="pt",
        padding=True,
        return_attention_mask=True
    )
    
    with torch.no_grad():
        logits = model(
            inputs.input_values,
            attention_mask=inputs.attention_mask
        ).logits
    
    predicted_ids = torch.argmax(logits, dim=-1)
    transcription = processor.batch_decode(predicted_ids)[0]
    transcription = fix_incomplete_transcription(transcription)
    
    return transcription


def text_to_phonemes(text: str) -> dict:
    """Convert Arabic text to phonemes"""
    clean_text = remove_diacritics(text)
    separator = Separator(phone=' ', word='|', syllable='')
    
    phonemes = phonemize(
        clean_text,
        language='ar',
        backend='espeak',
        separator=separator,
        strip=True
    )
    
    phoneme_list = [p for p in phonemes.split() if p != '|']
    
    return {
        'text': ' '.join(phoneme_list),
        'list': phoneme_list,
        'original': text,
        'clean': clean_text
    }


def compare_phoneme_lists(expected_list: List[str], user_list: List[str]) -> List[dict]:
    """Compare two phoneme lists and find ح vs ه errors"""
    sm = difflib.SequenceMatcher(None, expected_list, user_list)
    errors = []
    position = 0
    
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal':
            position += (i2 - i1)
            
        elif tag == 'replace':
            for i in range(i1, i2):
                j = j1 + (i - i1) if (j1 + (i - i1)) < j2 else (j2 - 1 if j2 > j1 else j1)
                expected = expected_list[i]
                got = user_list[j] if j < len(user_list) else '[missing]'
                
                is_haa_error = False
                error_description = ""
                
                if expected == 'ħ' and got == 'h':
                    is_haa_error = True
                    error_description = "Said ه (h) instead of ح (ħ) in الرَّحۡمَٰنِ or الرَّحِيمِ"
                elif expected == 'h' and got == 'ħ':
                    is_haa_error = True
                    error_description = "Said ح (ħ) instead of ه (h)"
                else:
                    error_description = f"Said '{got}' instead of '{expected}'"
                
                errors.append({
                    'position': position,
                    'expected_phoneme': expected,
                    'got_phoneme': got,
                    'is_haa_error': is_haa_error,
                    'description': error_description
                })
                position += 1
                
        elif tag == 'delete':
            for i in range(i1, i2):
                errors.append({
                    'position': position,
                    'expected_phoneme': expected_list[i],
                    'got_phoneme': '[missing]',
                    'is_haa_error': False,
                    'description': f"Skipped '{expected_list[i]}'"
                })
                position += 1
                
        elif tag == 'insert':
            for j in range(j1, j2):
                errors.append({
                    'position': position,
                    'expected_phoneme': '[none]',
                    'got_phoneme': user_list[j],
                    'is_haa_error': False,
                    'description': f"Added extra '{user_list[j]}'"
                })
                position += 1
    
    return errors


def calculate_score(errors: List[dict], total_phonemes: int) -> int:
    """Calculate accuracy score"""
    if total_phonemes == 0:
        return 100
    
    # Weight ح/ه errors more heavily
    penalty = 0
    for error in errors:
        if error['is_haa_error']:
            penalty += 15  # Heavy penalty for ح/ه confusion
        else:
            penalty += 5
    
    score = max(0, 100 - penalty)
    return score


# ===============================
# API ENDPOINTS
# ===============================

@app.get("/health")
async def health_check():
    return {"status": "ok", "model_loaded": model is not None}


@app.post("/analyze", response_model=TajweedResult)
async def analyze_recitation(
    audio: UploadFile = File(...),
    expected_text: Optional[str] = "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ"
):
    """
    Analyze Tajweed recitation from audio file.
    
    - audio: Audio file (WAV, MP3, WebM, etc.)
    - expected_text: The Arabic text that should be recited (default: Bismillah)
    """
    if model is None or processor is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")
    
    # Save uploaded file temporarily
    suffix = os.path.splitext(audio.filename)[1] or ".webm"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await audio.read()
        tmp.write(content)
        tmp_path = tmp.name
    
    try:
        # Transcribe user audio
        user_transcription = transcribe_audio(tmp_path)
        
        # Get phonemes
        expected_ph = text_to_phonemes(expected_text)
        user_ph = text_to_phonemes(user_transcription)
        
        # Compare phonemes
        errors = compare_phoneme_lists(expected_ph['list'], user_ph['list'])
        
        # Calculate score
        score = calculate_score(errors, len(expected_ph['list']))
        
        return TajweedResult(
            transcription=user_transcription,
            phonemes=user_ph['text'],
            errors=[TajweedError(**e) for e in errors],
            score=score,
            expected_text=expected_text
        )
        
    finally:
        # Clean up temp file
        os.unlink(tmp_path)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
