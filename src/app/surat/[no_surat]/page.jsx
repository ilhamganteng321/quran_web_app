// src/app/surat/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Bookmark, BookmarkCheck, Play, Pause, Volume2, Share, ZoomIn, ZoomOut, Type } from 'lucide-react';

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
  const [fontSize, setFontSize] = useState(3); // 1=small, 2=medium, 3=large, 4=xlarge, 5=xxlarge

  useEffect(() => {
    // Check dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    document.documentElement.classList.toggle('dark', darkMode);

    // Load font size preference
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize));
    }

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

  const toggleBookmark = (ayat) => {
    const bookmarkKey = `${suratId}-${ayat.no_ayat}`;
    const newBookmarks = [...bookmarks];
    const existingIndex = newBookmarks.findIndex(b => b.key === bookmarkKey);
    
    if (existingIndex > -1) {
      newBookmarks.splice(existingIndex, 1);
    } else {
      newBookmarks.push({
        key: bookmarkKey,
        no_surat: parseInt(suratId),
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

  const increaseFontSize = () => {
    if (fontSize < 5) {
      const newSize = fontSize + 1;
      setFontSize(newSize);
      localStorage.setItem('fontSize', newSize.toString());
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 1) {
      const newSize = fontSize - 1;
      setFontSize(newSize);
      localStorage.setItem('fontSize', newSize.toString());
    }
  };

  const getFontSizeClass = () => {
    const sizes = {
      1: 'text-xl',
      2: 'text-2xl',
      3: 'text-3xl',
      4: 'text-4xl',
      5: 'text-5xl'
    };
    return sizes[fontSize] || 'text-3xl';
  };

  const getTafsirFontSizeClass = () => {
    const sizes = {
      1: 'text-sm',
      2: 'text-base',
      3: 'text-lg',
      4: 'text-xl',
      5: 'text-2xl'
    };
    return sizes[fontSize] || 'text-lg';
  };

  // Function to parse and style tajwid rules and formatting
  const parseTextWithTajwid = (text) => {
    if (!text) return null;

    // Parse HTML tags first (for tafsir)
    const parts = [];
    let partCounter = 0;
    const regex = /<(i|b|sup)>([^<]*)<\/(i|b|sup)>|([^<]+)/g;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      if (match[1]) {
        const tag = match[1];
        const content = match[2];
        
        if (tag === 'i') {
          parts.push(<em key={partCounter++} className="italic">{content}</em>);
        } else if (tag === 'b') {
          parts.push(<strong key={partCounter++} className="font-bold">{content}</strong>);
        } else if (tag === 'sup') {
          parts.push(<sup key={partCounter++} className="text-xs align-super text-blue-600 dark:text-blue-400">{content}</sup>);
        }
      } else if (match[4]) {
        parts.push(<span key={partCounter++}>{match[4]}</span>);
      }
    }

    return parts.length > 0 ? parts : text;
  };

  // Function to detect and colorize tajwid in Arabic text
  const parseArabicWithTajwid = (arabicText) => {
    if (!arabicText) return null;

    const parts = [];
    let partCounter = 0;
    
    // Convert string to array of characters for better processing
    const chars = Array.from(arabicText);
    let i = 0;
    
    while (i < chars.length) {
      const char = chars[i];
      const nextChar = chars[i + 1];
      const prevChar = chars[i - 1];
      
      let className = '';
      let charToRender = char;
      
      // Detect Ghunnah (Tanwin + Shadda with Noon/Meem)
      // ً ٌ ٍ ّ with ن م
      if (char === 'ن' || char === 'م') {
        if (prevChar && (prevChar === 'ّ' || prevChar === 'ً' || prevChar === 'ٌ' || prevChar === 'ٍ')) {
          className = 'text-pink-600 dark:text-pink-400 font-semibold';
        }
      }
      
      // Detect Qalqalah letters: ق ط ب ج د
      if (char === 'ق' || char === 'ط' || char === 'ب' || char === 'ج' || char === 'د') {
        // Check if it has sukun or at the end
        if (nextChar === 'ْ' || !nextChar || nextChar === ' ') {
          className = 'text-green-600 dark:text-green-400 font-semibold';
        }
      }
      
      // Detect Idgham (Nun Sukun or Tanwin followed by يرملون)
      if (char === 'ن' && nextChar === 'ْ') {
        const afterNext = chars[i + 2];
        if (afterNext && 'يرملون'.includes(afterNext)) {
          className = 'text-purple-600 dark:text-purple-400 font-semibold';
        }
      }
      
      // Detect Iqlab (Nun Sukun or Tanwin + Ba)
      if ((char === 'ن' && nextChar === 'ْ') || ['ً', 'ٌ', 'ٍ'].includes(char)) {
        const afterNext = chars[i + 2] || chars[i + 1];
        if (afterNext === 'ب') {
          className = 'text-orange-600 dark:text-orange-400 font-semibold';
        }
      }
      
      // Detect Ikhfa (Nun Sukun or Tanwin + specific letters)
      if ((char === 'ن' && nextChar === 'ْ') || ['ً', 'ٌ', 'ٍ'].includes(char)) {
        const ikhfaLetters = 'صذثكجشقسدطزفتضظ';
        const afterNext = chars[i + 2] || chars[i + 1];
        if (afterNext && ikhfaLetters.includes(afterNext)) {
          className = 'text-yellow-600 dark:text-yellow-400 font-semibold';
        }
      }
      
      // Detect Mad (Alif, Waw, Ya with specific marks)
      // آ or Alif with Madda
      if (char === 'آ' || (char === 'ا' && (nextChar === 'ٓ' || prevChar === 'َ'))) {
        className = 'text-red-600 dark:text-red-400 font-semibold';
      }
      
      // Waw Mad (و with Dammah before it)
      if (char === 'و' && prevChar === 'ُ') {
        className = 'text-red-600 dark:text-red-400 font-semibold';
      }
      
      // Ya Mad (ي with Kasrah before it)
      if (char === 'ي' && prevChar === 'ِ') {
        className = 'text-red-600 dark:text-red-400 font-semibold';
      }
      
      // Detect Lam Syamsiyah/Qamariyah (ال)
      if (char === 'ل' && prevChar === 'ا') {
        // Lam Syamsiyah letters: ت ث د ذ ر ز س ش ص ض ط ظ ل ن
        const syamsiyahLetters = 'تثدذرزسشصضطظلن';
        if (nextChar && syamsiyahLetters.includes(nextChar)) {
          className = 'text-blue-600 dark:text-blue-400 font-semibold';
        }
      }
      
      // Detect Ra Tafkhim/Tarqiq (ر with fathah, dhammah = tafkhim / kasrah = tarqiq)
      if (char === 'ر') {
        if (nextChar === 'َ' || nextChar === 'ُ') {
          className = 'text-indigo-600 dark:text-indigo-400 font-semibold';
        } else if (nextChar === 'ِ') {
          className = 'text-cyan-600 dark:text-cyan-400 font-semibold';
        }
      }
      
      parts.push(
        <span key={partCounter++} className={className || ''}>
          {char}
        </span>
      );
      
      i++;
    }
    
    return parts;
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
            
            {/* Font Size Controls */}
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={decreaseFontSize}
                disabled={fontSize === 1}
                className={`p-2 rounded transition-colors ${
                  fontSize === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title="Perkecil font"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-600 dark:text-gray-400 px-2">
                <Type className="w-4 h-4" />
              </span>
              <button
                onClick={increaseFontSize}
                disabled={fontSize === 5}
                className={`p-2 rounded transition-colors ${
                  fontSize === 5
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title="Perbesar font"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
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
                <p className={`${getFontSizeClass()} font-arabic text-gray-800 dark:text-white mb-2`}>
                  {parseArabicWithTajwid('بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ')}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tajwid Legend */}
        <div className="max-w-4xl mx-auto mb-8">
          <details className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer font-semibold text-gray-800 dark:text-white flex items-center justify-between">
              <span>Keterangan Warna Tajwid</span>
              <span className="text-xs text-gray-500">Klik untuk lihat</span>
            </summary>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-pink-600 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Ghunnah</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-600 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Qalqalah</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-600 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Idgham</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-600 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Iqlab</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Ikhfa</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-600 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Mad</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Lam</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-indigo-600 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Ra Tafkhim</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-cyan-600 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Ra Tarqiq</span>
              </div>
            </div>
          </details>
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
                <p className={`text-right ${getFontSizeClass()} leading-relaxed font-arabic text-gray-800 dark:text-white`}>
                  {parseArabicWithTajwid(ayatItem.arab)}
                </p>
              </div>

              {/* Tafsir */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                    Terjemahan:
                  </h4>
                  <p className={`${getTafsirFontSizeClass()} text-gray-700 dark:text-gray-300 leading-relaxed`}>
                    {parseTextWithTajwid(ayatItem.tafsir)}
                  </p>
                </div>

                {/* Additional Tafsir if available */}
                {ayatItem.tafsir_muasir && (
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                      Tafsir Muyassar:
                    </h4>
                    <p className={`${getTafsirFontSizeClass()} text-gray-700 dark:text-gray-300 leading-relaxed`}>
                      {parseTextWithTajwid(ayatItem.tafsir_muasir)}
                    </p>
                  </div>
                )}

                {ayatItem.tafsir_clearQuran && (
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                      Tafsir Clear Quran:
                    </h4>
                    <p className={`${getTafsirFontSizeClass()} text-gray-700 dark:text-gray-300 leading-relaxed`}>
                      {parseTextWithTajwid(ayatItem.tafsir_clearQuran)}
                    </p>
                  </div>
                )}

                {ayatItem.tafsir_sureQuran && (
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                      Tafsir Sure Quran:
                    </h4>
                    <p className={`${getTafsirFontSizeClass()} text-gray-700 dark:text-gray-300 leading-relaxed`}>
                      {parseTextWithTajwid(ayatItem.tafsir_sureQuran)}
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