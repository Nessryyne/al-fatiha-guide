import { cn } from "@/lib/utils";

interface VerseProps {
  number: number;
  arabicText: string;
  translation?: string;
  isHighlighted?: boolean;
  onClick?: () => void;
}

export const Verse = ({
  number,
  arabicText,
  translation,
  isHighlighted = false,
  onClick,
}: VerseProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group px-4 py-6 rounded-xl transition-all duration-300 cursor-pointer",
        "hover:bg-parchment",
        isHighlighted && "bg-gold/10 hover:bg-gold/15"
      )}
    >
      {/* Verse number badge */}
      <div className="flex justify-center mb-4">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            "border-2 transition-colors duration-300",
            isHighlighted
              ? "border-gold bg-gold/20 text-gold"
              : "border-muted-foreground/30 text-muted-foreground group-hover:border-gold group-hover:text-gold"
          )}
        >
          <span className="font-arabic text-sm font-semibold">{number}</span>
        </div>
      </div>

      {/* Arabic text */}
      <p
        className={cn(
          "font-arabic text-2xl md:text-3xl text-center leading-loose mb-4",
          "transition-all duration-300",
          isHighlighted ? "text-foreground verse-glow" : "text-foreground/90"
        )}
        dir="rtl"
        lang="ar"
      >
        {arabicText}
      </p>

      {/* Translation */}
      {translation && (
        <p className="text-center text-muted-foreground text-sm md:text-base leading-relaxed">
          {translation}
        </p>
      )}
    </div>
  );
};
