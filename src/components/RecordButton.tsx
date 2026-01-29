import { useState, useCallback, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RecordButtonProps {
  onRecordingComplete?: (audioBlob: Blob) => void;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  className?: string;
}

export const RecordButton = ({
  onRecordingComplete,
  onRecordingStart,
  onRecordingStop,
  className,
}: RecordButtonProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType });
        stream.getTracks().forEach(track => track.stop());
        
        setIsProcessing(true);
        onRecordingComplete?.(audioBlob);
        
        // Simulate processing - replace with actual API call
        setTimeout(() => {
          setIsProcessing(false);
          toast.success("Recording saved! Backend integration needed for analysis.");
        }, 1500);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      onRecordingStart?.();
      toast.info("Recording started - recite clearly");
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please allow microphone permissions.");
    }
  }, [onRecordingComplete, onRecordingStart]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      onRecordingStop?.();
    }
  }, [isRecording, onRecordingStop]);

  const handleClick = useCallback(() => {
    if (isProcessing) return;

    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, isProcessing, startRecording, stopRecording]);

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* Sound wave visualization */}
      {isRecording && (
        <div className="flex items-center justify-center gap-1 h-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-record-active rounded-full animate-pulse"
              style={{
                height: `${12 + Math.random() * 12}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main record button */}
      <button
        onClick={handleClick}
        disabled={isProcessing}
        className={cn(
          "relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50",
          isRecording
            ? "bg-record-active scale-110 animate-pulse"
            : isProcessing
            ? "bg-muted cursor-not-allowed"
            : "bg-record-idle hover:bg-record-active hover:scale-105 shadow-lg"
        )}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isRecording && (
          <span className="absolute inset-0 rounded-full border-4 border-record-active/30 animate-ping" />
        )}

        {isProcessing ? (
          <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
        ) : isRecording ? (
          <Square className="w-5 h-5 text-primary-foreground fill-current" />
        ) : (
          <Mic className="w-6 h-6 text-primary-foreground" />
        )}
      </button>

      {/* Status text */}
      <p className="text-[10px] text-muted-foreground/70 text-center">
        {isProcessing
          ? "Processing..."
          : isRecording
          ? "Tap to stop"
          : "Tap to record"}
      </p>
    </div>
  );
};
