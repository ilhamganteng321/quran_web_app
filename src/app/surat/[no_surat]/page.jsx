// src/app/surat/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Bookmark, BookmarkCheck, Play, Pause, Volume2, Share } from 'lucide-react';

export default function SuratDetailPage() {
  const params = useParams();
  const router = useRouter();
  const suratId = params.no_surat;
  
  const [suratData, setSuratData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [playingAyat, setPlayingAyat] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    document.documentElement.classList.toggle('dark', darkMode);

    // Load bookmarks from localStorage
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarks(savedBookmarks);

    fetchSuratDetail();
  }, [suratId]);

  const fetchSuratDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/surat/${suratId}`);
      if (!response.ok) {
        throw new Error('Surat tidak ditemukan');
      }
      const data = await response.json();
      setSuratData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Di dalam komponen SuratDetailPage, perbaiki fungsi toggleBookmark:
const toggleBookmark = (ayat) => {
  const bookmarkKey = `${suratId}-${ayat.no_ayat}`;
  const newBookmarks = [...bookmarks];
  const existingIndex = newBookmarks.findIndex(b => b.key === bookmarkKey);
  
  if (existingIndex > -1) {
    // Remove bookmark
    newBookmarks.splice(existingIndex, 1);
  } else {
    // Add bookmark
    newBookmarks.push({
      key: bookmarkKey,
      no_surat: parseInt(suratId), // Pastikan ini number
      no_ayat: ayat.no_ayat,
      nm_surat: suratData.infoSurat.nm_surat,
      arab: ayat.arab,
      tafsir: ayat.tafsir,
      timestamp: new Date().toISOString()
    });
  }
  
  setBookmarks(newBookmarks);
  localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
};

  const isBookmarked = (ayat) => {
    const bookmarkKey = `${suratId}-${ayat.no_ayat}`;
    return bookmarks.some(b => b.key === bookmarkKey);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Memuat surat...</p>
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
            href="/"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const { infoSurat, ayat } = suratData;

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
                {infoSurat.nm_surat}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {infoSurat.arti_surat}
              </p>
            </div>
            
            <div className="w-20"></div> {/* Spacer */}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Surat Info */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {infoSurat.nm_surat}
              </h1>
              <p className="text-3xl font-arabic text-gray-800 dark:text-white mb-2">
                {infoSurat.nm_surat2}
              </p>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                {infoSurat.arti_surat}
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                  {infoSurat.jml_ayat} Ayat
                </span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  {infoSurat.tmp_turun}
                </span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
                  Surat ke-{infoSurat.no_surat}
                </span>
              </div>
            </div>

            {/* Bismillah for non-Taubah surat */}
            {infoSurat.no_surat !== 9 && (
              <div className="text-center py-8 border-t border-gray-200 dark:border-gray-600">
                <p className="text-3xl font-arabic text-gray-800 dark:text-white mb-2">
                  بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-between items-center">
            {parseInt(suratId) > 1 && (
              <Link
                href={`/surat/${parseInt(suratId) - 1}`}
                className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-md"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Surat Sebelumnya
              </Link>
            )}
            
            <div className="flex-1"></div>
            
            {parseInt(suratId) < 114 && (
              <Link
                href={`/surat/${parseInt(suratId) + 1}`}
                className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-md"
              >
                Surat Selanjutnya
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Link>
            )}
          </div>
        </div>

        {/* Ayat List */}
        <div className="max-w-4xl mx-auto space-y-6">
          {ayat.map((ayatItem, index) => (
            <div
              key={ayatItem.no_ayat}
              id={`ayat-${ayatItem.no_ayat}`}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
            >
              {/* Ayat Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {ayatItem.no_ayat}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Juz {ayatItem.no_juz} • Halaman {ayatItem.no_hal}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleBookmark(ayatItem)}
                    className={`p-2 transition-colors ${
                      isBookmarked(ayatItem)
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : 'text-gray-500 hover:text-yellow-500 dark:text-gray-400'
                    }`}
                    title={isBookmarked(ayatItem) ? 'Hapus Bookmark' : 'Tambah Bookmark'}
                  >
                    {isBookmarked(ayatItem) ? (
                      <BookmarkCheck className="w-5 h-5" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Arabic Text */}
              <div className="mb-6">
                <p className="text-right text-3xl leading-relaxed font-arabic text-gray-800 dark:text-white">
                  {ayatItem.arab}
                </p>
              </div>

              {/* Tafsir */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                    Terjemahan:
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {ayatItem.tafsir}
                  </p>
                </div>

                {/* Additional Tafsir if available */}
                {ayatItem.tafsir_muasir && (
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                      Tafsir Muyassar:
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {ayatItem.tafsir_muasir}
                    </p>
                  </div>
                )}

                {ayatItem.tafsir_clearQuran && (
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                      Tafsir Clear Quran:
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {ayatItem.tafsir_clearQuran}
                    </p>
                  </div>
                )}

                {ayatItem.tafsir_sureQuran && (
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                      Tafsir Sure Quran:
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {ayatItem.tafsir_sureQuran}
                    </p>
                  </div>
                )}
              </div>

              {/* Audio Indicator */}
              {playingAyat === ayatItem.no_ayat && (
                <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400">
                  <Volume2 className="w-4 h-4 mr-2 animate-pulse" />
                  <span className="text-sm">Sedang memutar audio...</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            {parseInt(suratId) > 1 ? (
              <Link
                href={`/surat/${parseInt(suratId) - 1}`}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all shadow-md"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Surat Sebelumnya
              </Link>
            ) : (
              <div></div>
            )}
            
            <Link
              href="/"
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Kembali ke Beranda
            </Link>
            
            {parseInt(suratId) < 114 ? (
              <Link
                href={`/surat/${parseInt(suratId) + 1}`}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all shadow-md"
              >
                Surat Selanjutnya
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
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