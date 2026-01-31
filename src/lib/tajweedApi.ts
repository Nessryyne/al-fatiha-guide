import { TajweedResult } from "@/components/TajweedFeedback";

// ⚠️ REPLACE THIS with your deployed Python API URL
// e.g., "https://your-app.railway.app" or "https://your-api.onrender.com"
const API_BASE_URL = import.meta.env.VITE_TAJWEED_API_URL || "http://localhost:8000";

export interface AnalyzeOptions {
  expectedText?: string;
}

/**
 * Send audio to the Tajweed analysis API
 */
export async function analyzeTajweed(
  audioBlob: Blob,
  options: AnalyzeOptions = {}
): Promise<TajweedResult> {
  const { expectedText = "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ" } = options;

  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  
  // Build URL with query params
  const url = new URL(`${API_BASE_URL}/analyze`);
  url.searchParams.set("expected_text", expectedText);

  const response = await fetch(url.toString(), {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error:", response.status, errorText);
    throw new Error(`Analysis failed: ${response.status}`);
  }

  const result = await response.json();
  
  return {
    transcription: result.transcription,
    phonemes: result.phonemes,
    errors: result.errors,
    score: result.score,
    expected_text: result.expected_text,
  };
}

/**
 * Check if the API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
