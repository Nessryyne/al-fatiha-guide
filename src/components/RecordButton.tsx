import { useState, useCallback } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecordButtonProps {
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  className?: string;
}

export const RecordButton = ({
  onRecordingStart,
  onRecordingStop,
  className,
}: RecordButtonProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = useCallback(() => {
    if (isProcessing) return;

    if (isRecording) {
      setIsRecording(false);
      setIsProcessing(true);
      onRecordingStop?.();
      
      // Simulate processing time
      setTimeout(() => {
        setIsProcessing(false);
      }, 1500);
    } else {
      setIsRecording(true);
      onRecordingStart?.();
    }
  }, [isRecording, isProcessing, onRecordingStart, onRecordingStop]);

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Sound wave visualization */}
      {isRecording && (
        <div className="flex items-center justify-center gap-1 h-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-record-active rounded-full wave-animation"
              style={{
                height: `${Math.random() * 20 + 12}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Status text */}
      <p className="text-sm font-medium text-muted-foreground">
        {isProcessing
          ? "Processing..."
          : isRecording
          ? "Recording... Tap to stop"
          : "Tap to start recording"}
      </p>

      {/* Main record button */}
      <button
        onClick={handleClick}
        disabled={isProcessing}
        className={cn(
          "relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50",
          isRecording
            ? "bg-record-active scale-110 animate-pulse-record"
            : isProcessing
            ? "bg-muted cursor-not-allowed"
            : "bg-record-idle hover:bg-record-active hover:scale-105 shadow-lg hover:shadow-record"
        )}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {/* Outer ring for recording state */}
        {isRecording && (
          <span className="absolute inset-0 rounded-full border-4 border-record-active/30 animate-ping" />
        )}

        {/* Icon */}
        {isProcessing ? (
          <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
        ) : isRecording ? (
          <Square className="w-7 h-7 text-primary-foreground fill-current" />
        ) : (
          <Mic className="w-8 h-8 text-primary-foreground" />
        )}
      </button>

      {/* Helper text */}
      <p className="text-xs text-muted-foreground/70 text-center max-w-[200px]">
        {isRecording
          ? "Recite the verse clearly"
          : "Record your recitation to get AI feedback"}
      </p>
    </div>
  );
};
