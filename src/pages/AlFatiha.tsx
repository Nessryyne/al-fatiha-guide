import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { alFatiha } from "@/data/alFatiha";
import { RecordButton } from "@/components/RecordButton";
import { TajweedFeedback, TajweedResult } from "@/components/TajweedFeedback";
const backendUrl = import.meta.env.VITE_TAJWEED_API_URL;

const handleRecordingComplete = async (audioBlob: Blob) => {
  const formData = new FormData(); // ✅ création ici
  formData.append("file", audioBlob, "recitation.wav");

  const backendUrl = import.meta.env.VITE_TAJWEED_API_URL;

  const res = await fetch(`${backendUrl}/analyze`, {
    method: "POST",
    body: formData,
  });


  const data = await res.json();
  console.log(data);
};



const AlFatihaPage = () => {
  const navigate = useNavigate();
  const [analysisResult, setAnalysisResult] = useState<TajweedResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRecordingComplete = (audioBlob: Blob) => {
    console.log("Recording complete:", audioBlob.size, "bytes");
  };

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
  };

  const handleAnalysisComplete = (result: TajweedResult) => {
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

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

          <div className="w-9" />
        </div>

        {/* Juz/Hizb and Page info */}
        <div className="flex items-center justify-between px-4 pb-2 text-xs text-muted-foreground">
          <span>Juz 1, Hizb 1</span>
          <span>Page 1</span>
        </div>
      </header>

      {/* Quran Page Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-56">
        <div className="max-w-lg mx-auto">
          {/* Quran Page - Book Style */}
          <div className="relative bg-gradient-to-b from-[hsl(42,45%,93%)] to-[hsl(38,40%,88%)] rounded-lg shadow-lg overflow-hidden">
            {/* Decorative border */}
            <div className="absolute inset-2 border-2 border-gold/30 rounded pointer-events-none" />
            <div className="absolute inset-3 border border-gold/20 rounded pointer-events-none" />

            {/* Corner ornaments */}
            <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-gold/40 rounded-tl" />
            <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-gold/40 rounded-tr" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-gold/40 rounded-bl" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-gold/40 rounded-br" />

            {/* Surah Header Ornament */}
            <div className="pt-8 pb-4 px-6">
              <div className="relative bg-gradient-to-r from-gold/20 via-gold/30 to-gold/20 rounded-lg py-3 px-4">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-[1px] bg-gradient-to-r from-transparent to-gold/60" />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-[1px] bg-gradient-to-l from-transparent to-gold/60" />
                <p className="font-arabic text-lg text-center text-gold-dark font-semibold">
                  سُورَةُ الفَاتِحَة
                </p>
              </div>
            </div>

            {/* Bismillah */}
            <div className="text-center pb-4">
              <p
                className="font-arabic text-xl text-[hsl(38,60%,30%)] font-semibold"
                dir="rtl"
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>

            {/* Verses */}
            <div className="px-6 pb-8">
              <div
                className="font-arabic text-[22px] leading-[2.8] text-[hsl(25,30%,20%)] text-justify"
                dir="rtl"
                lang="ar"
                style={{ textAlignLast: 'center' }}
              >
                {alFatiha.verses.slice(1).map((verse) => (
                  <span key={verse.number} className="inline">
                    {verse.arabicText}
                    {" "}
                    <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-sans rounded-full bg-gold/20 text-gold-dark mx-0.5 align-middle">
                      {verse.number}
                    </span>
                    {" "}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Tajweed Legend */}
      <div className="fixed bottom-16 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border px-3 py-2">
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[9px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[hsl(330,70%,50%)]" />
            مد لازم
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[hsl(30,85%,55%)]" />
            مد واجب
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[hsl(158,55%,40%)]" />
            إخفاء
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[hsl(210,70%,50%)]" />
            إدغام
          </span>
        </div>
      </div>

      {/* Feedback Panel + Record Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border">
        {/* Tajweed Feedback */}
        {(isAnalyzing || analysisResult) && (
          <div className="px-4 pt-3 max-w-lg mx-auto">
            <TajweedFeedback result={analysisResult} isLoading={isAnalyzing} />
          </div>
        )}

        {/* Record Button */}
        <div className="flex justify-center py-2">
          <RecordButton
            onRecordingComplete={handleRecordingComplete}
            onAnalysisStart={handleAnalysisStart}
            onAnalysisComplete={handleAnalysisComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default AlFatihaPage;
