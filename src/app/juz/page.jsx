// src/app/juz/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Book, ChevronRight } from 'lucide-react';

export default function JuzPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, []);

  // Data juz dengan informasi surat yang dimulai di setiap juz
  const juzData = [
    { no: 1, name: "الم", start: "Al-Fatihah : 1", end: "Al-Baqarah : 141", pages: "1-21" },
    { no: 2, name: "سيقول", start: "Al-Baqarah : 142", end: "Al-Baqarah : 252", pages: "22-41" },
    { no: 3, name: "تلك الرسل", start: "Al-Baqarah : 253", end: "Ali Imran : 92", pages: "42-62" },
    { no: 4, name: "لن تنالوا", start: "Ali Imran : 93", end: "An-Nisa : 23", pages: "63-82" },
    { no: 5, name: "والمحصنات", start: "An-Nisa : 24", end: "An-Nisa : 147", pages: "83-102" },
    { no: 6, name: "لا يحب الله", start: "An-Nisa : 148", end: "Al-Ma'idah : 81", pages: "103-121" },
    { no: 7, name: "وإذا سمعوا", start: "Al-Ma'idah : 82", end: "Al-An'am : 110", pages: "122-142" },
    { no: 8, name: "ولو أننا", start: "Al-An'am : 111", end: "Al-A'raf : 87", pages: "143-162" },
    { no: 9, name: "قال الملأ", start: "Al-A'raf : 88", end: "Al-Anfal : 40", pages: "163-182" },
    { no: 10, name: "واعلموا", start: "Al-Anfal : 41", end: "At-Taubah : 92", pages: "183-202" },
    { no: 11, name: "يعتذرون", start: "At-Taubah : 93", end: "Hud : 5", pages: "203-222" },
    { no: 12, name: "وما من دابة", start: "Hud : 6", end: "Yusuf : 52", pages: "223-242" },
    { no: 13, name: "وما أبرئ", start: "Yusuf : 53", end: "Ibrahim : 52", pages: "243-262" },
    { no: 14, name: "ربما", start: "Al-Hijr : 1", end: "An-Nahl : 128", pages: "263-282" },
    { no: 15, name: "سبحان الذي", start: "Al-Isra : 1", end: "Al-Kahf : 74", pages: "283-302" },
    { no: 16, name: "قال ألم", start: "Al-Kahf : 75", end: "Ta Ha : 135", pages: "303-322" },
    { no: 17, name: "اقترب للناس", start: "Al-Anbiya : 1", end: "Al-Hajj : 78", pages: "323-342" },
    { no: 18, name: "قد أفلح", start: "Al-Mu'minun : 1", end: "Al-Furqan : 20", pages: "343-362" },
    { no: 19, name: "وقال الذين", start: "Al-Furqan : 21", end: "An-Naml : 55", pages: "363-382" },
    { no: 20, name: "أمن خلق", start: "An-Naml : 56", end: "Al-Ankabut : 45", pages: "383-402" },
    { no: 21, name: "اتل ما أوحي", start: "Al-Ankabut : 46", end: "Al-Ahzab : 30", pages: "403-422" },
    { no: 22, name: "ومن يقنت", start: "Al-Ahzab : 31", end: "Yasin : 27", pages: "423-442" },
    { no: 23, name: "وما لي", start: "Yasin : 28", end: "Az-Zumar : 31", pages: "443-462" },
    { no: 24, name: "فمن أظلم", start: "Az-Zumar : 32", end: "Fussilat : 46", pages: "463-482" },
    { no: 25, name: "إليه يرد", start: "Fussilat : 47", end: "Al-Jathiyah : 37", pages: "483-502" },
    { no: 26, name: "حم", start: "Al-Ahqaf : 1", end: "Az-Zariyat : 30", pages: "503-522" },
    { no: 27, name: "قال فما خطبكم", start: "Az-Zariyat : 31", end: "Al-Hadid : 29", pages: "523-542" },
    { no: 28, name: "قد سمع الله", start: "Al-Mujadila : 1", end: "At-Tahrim : 12", pages: "543-562" },
    { no: 29, name: "تبارك الذي", start: "Al-Mulk : 1", end: "Al-Mursalat : 50", pages: "563-582" },
    { no: 30, name: "عم", start: "An-Naba : 1", end: "An-Nas : 6", pages: "583-604" }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-green-50 via-blue-50 to-purple-50'
    }`}>
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-green-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Kembali</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                Daftar Juz
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                30 Para/Juz Al-Quran
              </p>
            </div>
            
            <div className="w-20"></div> {/* Spacer */}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Book className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Para/Juz Al-Quran
              </h1>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                Al-Quran terdiri dari 30 juz (para) yang memudahkan pembacaan dan penghafalan. 
                Setiap juz memiliki kurang lebih 20 halaman dengan pembagian yang seimbang.
              </p>
            </div>
          </div>
        </div>

        {/* Juz Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {juzData.map((juz) => (
              <Link
                key={juz.no}
                href={`/juz/${juz.no}`}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-white font-bold text-lg">
                        {juz.no}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        Juz {juz.no}
                      </h3>
                      <p className="text-2xl font-arabic text-gray-600 dark:text-gray-400">
                        {juz.name}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span className="font-medium">Mulai:</span>
                    <span>{juz.start}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Berakhir:</span>
                    <span>{juz.end}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Halaman:</span>
                    <span>{juz.pages}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Klik untuk membaca
                    </span>
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <ChevronRight className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Tentang Pembagian Juz
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600 dark:text-gray-400">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Sejarah Pembagian
                </h4>
                <p className="text-sm leading-relaxed">
                  Pembagian Al-Quran menjadi 30 juz dimulai pada masa Khalifah Utsman bin Affan 
                  untuk memudahkan pembacaan dan penghafalan Al-Quran.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Manfaat Pembagian Juz
                </h4>
                <p className="text-sm leading-relaxed">
                  Dengan pembagian ini, seseorang dapat khatam Al-Quran dalam sebulan 
                  dengan membaca satu juz setiap hari.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .font-arabic {
          font-family: 'Amiri', 'Times New Roman', serif;
        }
        
        .dark {
          color-scheme: dark;
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
      `}</style>
    </div>
  );
}