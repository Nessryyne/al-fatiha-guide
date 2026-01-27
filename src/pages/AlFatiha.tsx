import { useState, useCallback } from "react";
import { SurahHeader } from "@/components/SurahHeader";
import { Verse } from "@/components/Verse";
import { RecordButton } from "@/components/RecordButton";
import { alFatiha } from "@/data/alFatiha";
import { toast } from "sonner";

const AlFatihaPage = () => {
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);

  const handleRecordingStart = useCallback(() => {
    toast.info("Recording started", {
      description: "Recite the verse clearly and tap to stop",
      duration: 2000,
    });
  }, []);

  const handleRecordingStop = useCallback(() => {
    toast.success("Recording complete", {
      description: "Your recitation is being analyzed...",
      duration: 3000,
    });
  }, []);

  const handleVerseClick = (verseNumber: number) => {
    setSelectedVerse(selectedVerse === verseNumber ? null : verseNumber);
  };

  return (
    <div className="min-h-screen bg-gradient-islamic flex flex-col">
      {/* Header */}
      <SurahHeader
        surahName={alFatiha.name}
        surahNameArabic={alFatiha.nameArabic}
        surahNumber={alFatiha.number}
        versesCount={alFatiha.versesCount}
        revelationType={alFatiha.revelationType}
      />

      {/* Verses content - scrollable area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 pb-56">
          {/* Instruction card */}
          <div className="bg-card rounded-2xl p-4 mb-6 shadow-soft">
            <p className="text-center text-muted-foreground text-sm">
              Tap a verse to select it, then use the record button to recite
            </p>
          </div>

          {/* Verses */}
          <div className="space-y-2">
            {alFatiha.verses.map((verse) => (
              <Verse
                key={verse.number}
                number={verse.number}
                arabicText={verse.arabicText}
                translation={verse.translation}
                isHighlighted={selectedVerse === verse.number}
                onClick={() => handleVerseClick(verse.number)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Fixed bottom record button */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-gradient-to-t from-background via-background/95 to-transparent pt-8 pb-6">
          <div className="max-w-2xl mx-auto px-4">
            <RecordButton
              onRecordingStart={handleRecordingStart}
              onRecordingStop={handleRecordingStop}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlFatihaPage;
