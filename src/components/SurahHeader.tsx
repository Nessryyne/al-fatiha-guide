import { ArrowLeft, BookOpen, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SurahHeaderProps {
  surahName: string;
  surahNameArabic: string;
  surahNumber: number;
  versesCount: number;
  revelationType: string;
}

export const SurahHeader = ({
  surahName,
  surahNameArabic,
  surahNumber,
  versesCount,
  revelationType,
}: SurahHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="relative bg-gradient-midnight text-primary-foreground">
      {/* Islamic pattern overlay */}
      <div className="absolute inset-0 islamic-pattern opacity-30" />
      
      <div className="relative z-10 px-4 py-6">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              aria-label="Surah info"
            >
              <Info className="w-5 h-5" />
            </button>
            <button
              className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              aria-label="Bookmark"
            >
              <BookOpen className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Surah info */}
        <div className="text-center">
          {/* Arabic name with decorative styling */}
          <div className="relative inline-block mb-3">
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-gradient-to-r from-transparent to-gold" />
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-gradient-to-l from-transparent to-gold" />
            <h1 className="font-arabic text-4xl font-bold text-gold">
              {surahNameArabic}
            </h1>
          </div>

          {/* English name */}
          <h2 className="text-xl font-semibold mb-2">{surahName}</h2>

          {/* Surah metadata */}
          <div className="flex items-center justify-center gap-4 text-sm text-primary-foreground/70">
            <span className="flex items-center gap-1">
              <span className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-xs text-gold font-semibold">
                {surahNumber}
              </span>
            </span>
            <span className="w-1 h-1 rounded-full bg-primary-foreground/40" />
            <span>{versesCount} Verses</span>
            <span className="w-1 h-1 rounded-full bg-primary-foreground/40" />
            <span>{revelationType}</span>
          </div>
        </div>
      </div>

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-background rounded-t-[2rem]" />
    </header>
  );
};
