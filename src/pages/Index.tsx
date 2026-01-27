import { Link } from "react-router-dom";
import { BookOpen, Mic, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-islamic islamic-pattern">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="pt-12 pb-8 text-center px-4">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Tajweed Learning
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Tajweed <span className="text-gold">AI</span>
          </h1>
          
          <p className="text-muted-foreground max-w-md mx-auto">
            Perfect your Quran recitation with intelligent feedback and beautiful Arabic typography
          </p>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 pb-8">
          <div className="max-w-md mx-auto space-y-4">
            {/* Al Fatiha Card */}
            <Link
              to="/surah/al-fatiha"
              className="block group"
            >
              <div className="relative overflow-hidden bg-card rounded-2xl p-6 shadow-soft hover:shadow-gold transition-all duration-300 border border-border hover:border-gold/30">
                {/* Background pattern */}
                <div className="absolute inset-0 islamic-pattern opacity-50 group-hover:opacity-70 transition-opacity" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-gold" />
                    </div>
                    <div className="text-right">
                      <p className="font-arabic text-2xl text-gold">الفاتحة</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    Al-Fatiha
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    The Opening • 7 Verses • Meccan
                  </p>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-xs font-medium">
                      <Mic className="w-3 h-3" />
                      Practice Now
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Coming soon cards */}
            <div className="bg-card/50 rounded-2xl p-6 border border-dashed border-border">
              <p className="text-center text-muted-foreground text-sm">
                More surahs coming soon...
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 text-center">
          <p className="text-muted-foreground text-xs">
            Built with ❤️ for the Muslim community
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
