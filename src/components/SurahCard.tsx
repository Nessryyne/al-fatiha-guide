import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { Chapter, RevelationPlace } from "@/data/quranChapters";

interface SurahCardProps {
  chapter: Chapter;
}

const RevelationBadge = ({ place }: { place: RevelationPlace }) => (
  <span
    className={cn(
      "text-xs px-2 py-0.5 rounded-full font-medium",
      place === "makkah"
        ? "bg-primary/10 text-primary"
        : "bg-secondary/30 text-secondary-foreground"
    )}
  >
    {place === "makkah" ? "Meccan" : "Medinan"}
  </span>
);

export const SurahCard = ({ chapter }: SurahCardProps) => {
  // Only Al-Fatiha is clickable for now
  const isClickable = chapter.id === 1;

  const CardContent = (
    <div
      className={cn(
        "flex items-center gap-4 p-4 bg-card rounded-xl border border-border transition-all duration-200",
        isClickable && "hover:border-primary/40 hover:shadow-gold cursor-pointer",
        !isClickable && "opacity-60"
      )}
    >
      {/* Surah Number */}
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
        <span className="font-semibold text-primary text-lg">
          {chapter.id}
        </span>
      </div>

      {/* Surah Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-foreground truncate">
            {chapter.name}
          </h3>
          <RevelationBadge place={chapter.revelationPlace} />
        </div>
        <p className="text-muted-foreground text-sm">
          {chapter.versesCount} Verses
        </p>
      </div>

      {/* Arabic Name */}
      <div className="text-right shrink-0">
        <p className="font-arabic text-2xl text-primary leading-none" dir="rtl">
          {chapter.nameArabic}
        </p>
      </div>
    </div>
  );

  if (isClickable) {
    return (
      <Link to={`/surah/al-fatiha`} className="block">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
};
