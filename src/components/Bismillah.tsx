export const Bismillah = () => {
  return (
    <div className="py-8 text-center">
      {/* Decorative container */}
      <div className="relative inline-block px-12 py-6">
        {/* Left decoration */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <div className="w-8 h-[2px] bg-gradient-to-r from-transparent to-gold" />
          <div className="w-4 h-[2px] bg-gradient-to-r from-transparent to-gold/50 mt-1 ml-2" />
        </div>

        {/* Right decoration */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <div className="w-8 h-[2px] bg-gradient-to-l from-transparent to-gold" />
          <div className="w-4 h-[2px] bg-gradient-to-l from-transparent to-gold/50 mt-1 mr-2" />
        </div>

        {/* Bismillah text */}
        <p
          className="font-arabic text-3xl md:text-4xl text-gold font-semibold"
          dir="rtl"
          lang="ar"
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      </div>

      {/* Translation */}
      <p className="text-muted-foreground text-sm mt-3">
        In the name of Allah, the Most Gracious, the Most Merciful
      </p>
    </div>
  );
};
