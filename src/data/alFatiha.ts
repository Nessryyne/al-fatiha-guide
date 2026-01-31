export interface Verse {
  number: number;
  arabicText: string;
  translation: string;
}

export interface Surah {
  number: number;
  name: string;
  nameArabic: string;
  versesCount: number;
  revelationType: "Meccan" | "Medinan";
  verses: Verse[];
}

export const alFatiha: Surah = {
  number: 1,
  name: "Al-Fatiha",
  nameArabic: "الفاتحة",
  versesCount: 7,
  revelationType: "Meccan",
  verses: [
    {
      number: 1,
      arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      translation: "In the name of Allah, the Most Gracious, the Most Merciful",
    },
    {
      number: 2,
      arabicText: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      translation: "All praise is due to Allah, Lord of all the worlds",
    },
    {
      number: 3,
      arabicText: "الرَّحْمَٰنِ الرَّحِيمِ",
      translation: "The Most Gracious, the Most Merciful",
    },
    {
      number: 4,
      arabicText: "مَالِكِ يَوْمِ الدِّينِ",
      translation: "Master of the Day of Judgment",
    },
    {
      number: 5,
      arabicText: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      translation: "You alone we worship, and You alone we ask for help",
    },
    {
      number: 6,
      arabicText: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      translation: "Guide us on the Straight Path",
    },
    {
      number: 7,
      arabicText: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
      translation:
        "The path of those who have received Your grace; not the path of those who have brought down wrath upon themselves, nor of those who have gone astray",
    },
  ],
};
