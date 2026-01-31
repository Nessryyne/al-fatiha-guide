import { Sparkles } from "lucide-react";
import { SurahCard } from "@/components/SurahCard";
import { quranChapters } from "@/data/quranChapters";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Tajweed <span className="text-primary">AI</span>
              </h1>
              <p className="text-muted-foreground text-sm">
                Perfect your Quran recitation
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered
            </div>
          </div>
        </div>
      </header>

      {/* Surah List */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">Surahs</h2>
          <p className="text-muted-foreground text-sm">
            114 Chapters • Tap Al-Fatiha to practice
          </p>
        </div>

        <div className="space-y-3">
          {quranChapters.map((chapter) => (
            <SurahCard key={chapter.id} chapter={chapter} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-border mt-8">
        <p className="text-muted-foreground text-xs">
          Built with ❤️ for the Muslim community
        </p>
      </footer>
    </div>
  );
};

export default Index;
