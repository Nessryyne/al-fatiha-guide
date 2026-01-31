import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TajweedError {
  position: number;
  expected_phoneme: string;
  got_phoneme: string;
  is_haa_error: boolean;
  description: string;
  error_word?: string;
}

export interface TajweedResult {
  transcription: string;
  phonemes: string;
  errors: TajweedError[];
  score: number;
  expected_text?: string;
}

interface TajweedFeedbackProps {
  result: TajweedResult | null;
  isLoading: boolean;
  className?: string;
}

// Highlight error letters in the transcription
const HighlightedTranscription = ({ 
  text, 
  errors 
}: { 
  text: string; 
  errors: TajweedError[] 
}) => {
  const haaErrors = errors.filter(e => e.is_haa_error);
  
  if (haaErrors.length === 0) {
    return <span>{text}</span>;
  }

  // Split text and highlight ه characters that should be ح
  const parts: { text: string; isError: boolean }[] = [];
  let currentPart = '';
  let errorCount = 0;
  const maxErrors = haaErrors.length;

  for (const char of text) {
    if (char === 'ه' && errorCount < maxErrors) {
      if (currentPart) {
        parts.push({ text: currentPart, isError: false });
        currentPart = '';
      }
      parts.push({ text: char, isError: true });
      errorCount++;
    } else {
      currentPart += char;
    }
  }
  if (currentPart) {
    parts.push({ text: currentPart, isError: false });
  }

  return (
    <>
      {parts.map((part, i) => (
        part.isError ? (
          <span 
            key={i} 
            className="text-destructive font-bold bg-destructive/10 px-0.5 rounded"
            title="Should be ح"
          >
            {part.text}
          </span>
        ) : (
          <span key={i}>{part.text}</span>
        )
      ))}
    </>
  );
};

export const TajweedFeedback = ({ result, isLoading, className }: TajweedFeedbackProps) => {
  if (isLoading) {
    return (
      <div className={cn("bg-card rounded-xl p-4 shadow-lg border border-border", className)}>
        <div className="flex items-center justify-center gap-3 py-6">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Analyzing your recitation...</p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const haaErrors = result.errors.filter(e => e.is_haa_error);
  const otherErrors = result.errors.filter(e => !e.is_haa_error);
  const isPerfect = result.errors.length === 0;

  return (
    <div className={cn("bg-card rounded-xl shadow-lg border border-border overflow-hidden", className)}>
      {/* Score Header */}
      <div className={cn(
        "px-4 py-3 flex items-center justify-between",
        isPerfect ? "bg-emerald-500/10" : result.score >= 70 ? "bg-amber-500/10" : "bg-destructive/10"
      )}>
        <div className="flex items-center gap-2">
          {isPerfect ? (
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          ) : result.score >= 70 ? (
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          ) : (
            <XCircle className="w-5 h-5 text-destructive" />
          )}
          <span className="font-semibold text-foreground">
            {isPerfect ? "Perfect!" : result.score >= 70 ? "Good, but needs work" : "Needs practice"}
          </span>
        </div>
        <span className="text-lg font-bold text-foreground">{result.score}%</span>
      </div>

      {/* Transcription with highlighted errors */}
      <div className="px-4 py-3 border-b border-border">
        <p className="text-xs text-muted-foreground mb-1">What we heard:</p>
        <p className="font-arabic text-lg text-foreground" dir="rtl">
          <HighlightedTranscription text={result.transcription} errors={result.errors} />
        </p>
        {haaErrors.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            <span className="text-destructive">●</span> Red letters show incorrect pronunciation
          </p>
        )}
      </div>

      {/* Errors */}
      {result.errors.length > 0 && (
        <div className="px-4 py-3 space-y-3">
          {/* ح vs ه Errors */}
          {haaErrors.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-destructive flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-destructive" />
                ح/ه Confusion ({haaErrors.length})
              </p>
              {haaErrors.map((error, i) => (
                <div key={i} className="bg-destructive/5 rounded-lg p-3 text-sm">
                  <p className="text-foreground font-medium">{error.description}</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    💡 ح (ħ) comes from deep in the throat. ه (h) is lighter, from the mouth.
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Other Errors */}
          {otherErrors.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Other Issues ({otherErrors.length})
              </p>
              {otherErrors.map((error, i) => (
                <div key={i} className="bg-amber-500/5 rounded-lg p-2 text-sm text-foreground">
                  {error.description}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Perfect message */}
      {isPerfect && (
        <div className="px-4 py-3">
          <p className="text-sm text-emerald-600">
            🎉 Excellent! Your pronunciation of الرَّحۡمَٰنِ الرَّحِيمِ was perfect.
          </p>
        </div>
      )}
    </div>
  );
};
