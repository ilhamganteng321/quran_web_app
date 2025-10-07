// src/app/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Book, Bookmark, Moon, Sun } from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [suratList, setSuratList] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch daftar surat saat komponen dimount
    fetchAllSurat();
    
    // Check dark mode preference from localStorage
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, []);

  const fetchAllSurat = async () => {
  try {
    const response = await fetch('/api/surat');
    if (!response.ok) throw new Error('Gagal fetch surat');
    const data = await response.json();
    setSuratList(data);
  } catch (error) {
    console.error('Error fetching surat:', error);
  } finally {
    setIsLoading(false);
  }
};

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search/${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-green-50 via-blue-50 to-purple-50'
    }`}>
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-green-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Book className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Al-Quran Digital
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  القرآن الكريم
                </p>
              </div>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari ayat, kata, atau topik..."
                className="w-full pl-12 pr-24 py-4 text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-green-500 dark:focus:border-green-400 focus:outline-none transition-colors shadow-lg"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 shadow-md"
                >
                  {isSearching ? 'Mencari...' : 'Cari'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
  Hasil Pencarian untuk {searchQuery}
</h2>
            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Surat {result.no_surat}, Ayat {result.no_ayat} • Juz {result.no_juz}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Halaman {result.no_hal}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-right text-2xl text-gray-800 dark:text-white leading-relaxed font-arabic">
                      {result.arab}
                    </p>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {result.tafsir}
                    </p>
                  </div>
                  
                  <Link
                    href={`/surat/${result.no_surat}#ayat-${result.no_ayat}`}
                    className="inline-flex items-center mt-4 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
                  >
                    Lihat dalam konteks surat →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Access Menu */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className={'text-2xl font-bold mb-8 text-center ' + (isDarkMode ? 'dark text-gray-50' : 'text-gray-800')}>
            Akses Cepat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* <Link
              href="/juz"
              className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Book className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Baca per Juz
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Baca Al-Quran berdasarkan pembagian juz (30 juz)
              </p>
            </Link> */}

            <Link
              href="/bookmark"
              className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bookmark className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Bookmark
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Ayat-ayat yang telah Anda bookmark
              </p>
            </Link>

            {/* <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold">تلاوة</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Audio Tilawah
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Dengarkan lantunan ayat suci Al-Quran
              </p>
          </div>
            

            <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold">تفسير</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Tafsir
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Pelajari makna dan tafsir ayat Al-Quran
              </p>
            </div> */}
        </div>
        {/* Daftar Surat */}
        <div className="max-w-6xl mx-auto mt-4">
          <h2 className={'text-2xl font-bold mb-8 text-center ' + (isDarkMode ? 'dark text-gray-50' : 'text-gray-800')}>
            Daftar Surat
          </h2>
          {isLoading ? (
    <div className="flex justify-center items-center py-10">
      <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-3 text-gray-600 dark:text-gray-300">Memuat surat...</span>
    </div>
  ) : suratList.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {suratList.map((surat) => (
        <Link key={surat.no_surat} href={`/surat/${surat.no_surat}`} className="group bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {surat.no_surat}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white">
                  {surat.nm_surat}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {surat.arti_surat}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-arabic text-gray-800 dark:text-white">
                {surat.nm_surat2}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {surat.jml_ayat} ayat • {surat.tmp_turun}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  ) : (
    <p className="text-center text-gray-600 dark:text-gray-400">
      Tidak ada surat ditemukan.
    </p>
  )}
        </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © 2025 Al-Quran Digital. Dibuat dengan ❤️ untuk umat Islam
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Dan Kami turunkan dari Al-Quran suatu yang menjadi penawar dan rahmat bagi orang-orang yang beriman - QS. Al-Isra: 82
            </p>
          </div>
        </div>
      </footer>

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