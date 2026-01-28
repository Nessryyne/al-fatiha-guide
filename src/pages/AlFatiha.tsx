import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { alFatiha } from "@/data/alFatiha";
import { Mic } from "lucide-react";

const AlFatihaPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Simple Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          
          <h1 className="font-arabic text-2xl font-semibold text-foreground">
            {alFatiha.nameArabic}
          </h1>
          
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
        
        {/* Juz/Hizb and Page info */}
        <div className="flex items-center justify-between px-4 pb-2 text-xs text-muted-foreground">
          <span>Juz 1, Hizb 1</span>
          <span>Page 1</span>
        </div>
      </header>

      {/* Quran Content - Book style */}
      <main className="flex-1 overflow-y-auto px-4 py-6 pb-32">
        <div className="max-w-lg mx-auto">
          {/* Verses as continuous flowing text */}
          <div 
            className="font-arabic text-xl leading-[2.5] text-foreground text-right"
            dir="rtl"
            lang="ar"
          >
            {alFatiha.verses.map((verse, index) => (
              <span key={verse.number}>
                {verse.arabicText}
                {" "}
                <span className="inline-flex items-center justify-center w-6 h-6 text-xs rounded-full border border-muted-foreground/30 text-muted-foreground mx-1">
                  {verse.number}
                </span>
                {" "}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Tajweed Legend */}
      <div className="fixed bottom-20 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border px-3 py-2">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-pink-500" />
            مد ٦ حركات (لازم)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            مد ٢-٤-٦ حروف
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            إخفاء، ومواضع الغنة
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            إدغام، وما لا يُلفظ
          </span>
        </div>
      </div>

      {/* Centered Record Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pb-4">
        <div className="flex justify-center">
          <button
            className="w-14 h-14 rounded-full bg-record-idle hover:bg-record-active flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
            aria-label="Start recording"
          >
            <Mic className="w-6 h-6 text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlFatihaPage;
