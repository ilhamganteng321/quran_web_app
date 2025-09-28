// src/app/juz/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Bookmark, BookmarkCheck, Play, Pause, Share, ChevronRight } from 'lucide-react';

export default function JuzDetailPage() {
  const params = useParams();
  const router = useRouter();
  const juzId = params.no_juz;
  
  const [juzData, setJuzData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [playingAyat, setPlayingAyat] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Data nama juz
  const juzNames = {
    1: "الم", 2: "سيقول", 3: "تلك الرسل", 4: "لن تنالوا", 5: "والمحصنات",
    6: "لا يحب الله", 7: "وإذا سمعوا", 8: "ولو أننا", 9: "قال الملأ", 10: "واعلموا",
    11: "يعتذرون", 12: "وما من دابة", 13: "وما أبرئ", 14: "ربما", 15: "سبحان الذي",
    16: "قال ألم", 17: "اقترب للناس", 18: "قد أفلح", 19: "وقال الذين", 20: "أمن خلق",
    21: "اتل ما أوحي", 22: "ومن يقنت", 23: "وما لي", 24: "فمن أظلم", 25: "إليه يرد",
    26: "حم", 27: "قال فما خطبكم", 28: "قد سمع الله", 29: "تبارك الذي", 30: "عم"
  };

  useEffect(() => {
    // Check dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    document.documentElement.classList.toggle('dark', darkMode);

    // Load bookmarks from localStorage
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarks(savedBookmarks);

    fetchJuzDetail();
  }, [juzId]);

  const fetchJuzDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/juz/${juzId}`);
      if (!response.ok) {
        throw new Error('Juz tidak ditemukan');
      }
      const data = await response.json();
      
      // Group ayat by surat
      const groupedData = data.reduce((acc, ayat) => {
        if (!acc[ayat.no_surat]) {
          acc[ayat.no_surat] = [];
        }
        acc[ayat.no_surat].push(ayat);
        return acc;
      }, {});
      
      setJuzData(groupedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSuratName = (suratNo) => {
    const suratNames = {
      1: "AL-FATIHAH", 2: "AL-BAQARAH", 3: "ALI IMRAN", 4: "AN-NISA", 5: "AL-MA'IDAH",
      6: "AL-AN'AM", 7: "AL-A'RAF", 8: "AL-ANFAL", 9: "AT-TAUBAH", 10: "YUNUS",
      // Add more surat names as needed
    };
    return suratNames[suratNo] || `SURAT ${suratNo}`;
  };

  const toggleBookmark = (ayat) => {
    const bookmarkKey = `${ayat.no_surat}-${ayat.no_ayat}`;
    const newBookmarks = [...bookmarks];
    const existingIndex = newBookmarks.findIndex(b => b.key === bookmarkKey);
    
    if (existingIndex > -1) {
      newBookmarks.splice(existingIndex, 1);
    } else {
      newBookmarks.push({
        key: bookmarkKey,
        no_surat: ayat.no_surat,
        no_ayat: ayat.no_ayat,
        nm_surat: getSuratName(ayat.no_surat),
        arab: ayat.arab,
        tafsir: ayat.tafsir,
        timestamp: new Date().toISOString()
      });
    }
    
    setBookmarks(newBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
  };

  const isBookmarked = (ayat) => {
    const bookmarkKey = `${ayat.no_surat}-${ayat.no_ayat}`;
    return bookmarks.some(b => b.key === bookmarkKey);
  };

  const shareAyat = async (ayat) => {
    const text = `${ayat.arab}\n\n"${ayat.tafsir}"\n\n- QS. ${getSuratName(ayat.no_surat)}:${ayat.no_ayat}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QS. ${getSuratName(ayat.no_surat)}:${ayat.no_ayat}`,
          text: text,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert('Ayat telah disalin ke clipboard');
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Memuat juz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Link
            href="/juz"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Juz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-green-50 via-blue-50 to-purple-50'
    }`}>
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-green-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/juz"
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Kembali</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                Juz {juzId}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                {juzNames[parseInt(juzId)]}
              </p>
            </div>
            
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Juz Info */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">{juzId}</span>
              </div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Juz {juzId}
              </h1>
              <p className="text-2xl font-arabic text-gray-800 dark:text-white mb-4">
                {juzNames[parseInt(juzId)]}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Para ke-{juzId} dari 30 juz Al-Quran
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-between items-center">
            {parseInt(juzId) > 1 && (
              <Link
                href={`/juz/${parseInt(juzId) - 1}`}
                className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-md"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Juz Sebelumnya
              </Link>
            )}
            
            <div className="flex-1"></div>
            
            {parseInt(juzId) < 30 && (
              <Link
                href={`/juz/${parseInt(juzId) + 1}`}
                className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-md"
              >
                Juz Selanjutnya
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            )}
          </div>
        </div>

        {/* Ayat by Surat */}
        <div className="max-w-4xl mx-auto space-y-8">
          {Object.entries(juzData).map(([suratNo, ayatList]) => (
            <div key={suratNo} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              {/* Surat Header */}
              <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-t-2xl p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="font-bold">{suratNo}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{getSuratName(parseInt(suratNo))}</h3>
                      <p className="text-sm opacity-90">
                        Ayat {ayatList[0].no_ayat} - {ayatList[ayatList.length - 1].no_ayat}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/surat/${suratNo}`}
                    className="flex items-center px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
                  >
                    Lihat Surat Lengkap
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Ayat List */}
              <div className="p-6 space-y-6">
                {ayatList.map((ayat, index) => (
                  <div
                    key={`${ayat.no_surat}-${ayat.no_ayat}`}
                    id={`ayat-${ayat.no_surat}-${ayat.no_ayat}`}
                    className="border-b border-gray-200 dark:border-gray-600 last:border-b-0 pb-6 last:pb-0"
                  >
                    {/* Ayat Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{ayat.no_ayat}</span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Halaman {ayat.no_hal}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setPlayingAyat(playingAyat === `${ayat.no_surat}-${ayat.no_ayat}` ? null : `${ayat.no_surat}-${ayat.no_ayat}`)}
                          className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                          title="Putar Audio"
                        >
                          {playingAyat === `${ayat.no_surat}-${ayat.no_ayat}` ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>
                        
                        <button
                          onClick={() => toggleBookmark(ayat)}
                          className={`p-2 transition-colors ${
                            isBookmarked(ayat)
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-gray-500 hover:text-yellow-500 dark:text-gray-400'
                          }`}
                          title={isBookmarked(ayat) ? 'Hapus Bookmark' : 'Tambah Bookmark'}
                        >
                          {isBookmarked(ayat) ? (
                            <BookmarkCheck className="w-4 h-4" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                        
                        <button
                          onClick={() => shareAyat(ayat)}
                          className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
                          title="Bagikan Ayat"
                        >
                          <Share className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Arabic Text */}
                    <div className="mb-4">
                      <p className="text-right text-2xl leading-relaxed font-arabic text-gray-800 dark:text-white">
                        {ayat.arab}
                      </p>
                    </div>

                    {/* Tafsir */}
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {ayat.tafsir}
                      </p>
                    </div>

                    {/* Additional Tafsir if available */}
                    {ayat.tafsir_muasir && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Tafsir Muyassar:
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {ayat.tafsir_muasir}
                        </p>
                      </div>
                    )}

                    {/* Audio Playing Indicator */}
                    {playingAyat === `${ayat.no_surat}-${ayat.no_ayat}` && (
                      <div className="mt-3 flex items-center text-blue-600 dark:text-blue-400">
                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse mr-2"></div>
                        <span className="text-sm">Sedang memutar audio...</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            {parseInt(juzId) > 1 ? (
              <Link
                href={`/juz/${parseInt(juzId) - 1}`}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all shadow-md"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Juz {parseInt(juzId) - 1}
              </Link>
            ) : (
              <div></div>
            )}
            
            <Link
              href="/juz"
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Daftar Juz
            </Link>
            
            {parseInt(juzId) < 30 ? (
              <Link
                href={`/juz/${parseInt(juzId) + 1}`}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all shadow-md"
              >
                Juz {parseInt(juzId) + 1}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            ) : (
              <div></div>
            )}
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