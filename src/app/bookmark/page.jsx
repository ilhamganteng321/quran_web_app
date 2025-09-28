// src/app/bookmark/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Trash2 } from 'lucide-react';

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    document.documentElement.classList.toggle('dark', darkMode);

    // Load bookmarks from localStorage
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    // Sort by timestamp (newest first)
    const sortedBookmarks = savedBookmarks.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    setBookmarks(sortedBookmarks);
  };

  const removeBookmark = (bookmarkKey) => {
    const newBookmarks = bookmarks.filter(b => b.key !== bookmarkKey);
    setBookmarks(newBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
  };

  const clearAllBookmarks = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua bookmark?')) {
      setBookmarks([]);
      localStorage.setItem('bookmarks', JSON.stringify([]));
    }
  };

  if (bookmarks.length === 0) {
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
                <span>Kembali ke Beranda</span>
              </Link>
              
              <div className="text-center">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                  Bookmark Ayat
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ayat-ayat yang telah Anda tandai
                </p>
              </div>
              
              <div className="w-20"></div> {/* Spacer */}
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bookmark className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Belum Ada Bookmark
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Anda belum menambahkan ayat ke bookmark. Kunjungi surat dan klik ikon bookmark pada ayat yang ingin Anda simpan.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all shadow-md"
            >
              Jelajahi Surat
            </Link>
          </div>
        </main>
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
              href="/"
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Kembali ke Beranda</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                Bookmark Ayat
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {bookmarks.length} ayat yang ditandai
              </p>
            </div>
            
            <button
              onClick={clearAllBookmarks}
              className="px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
            >
              Hapus Semua
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Bookmark List */}
          <div className="space-y-6">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.key}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {bookmark.no_ayat}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white">
                        {bookmark.nm_surat} - Ayat {bookmark.no_ayat}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Surat ke-{bookmark.no_surat}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeBookmark(bookmark.key)}
                    className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    title="Hapus Bookmark"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Arabic Text */}
                <div className="mb-4">
                  <p className="text-right text-2xl leading-relaxed font-arabic text-gray-800 dark:text-white">
                    {bookmark.arab}
                  </p>
                </div>

                {/* Translation */}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {bookmark.tafsir}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Ditambahkan pada {new Date(bookmark.timestamp).toLocaleDateString('id-ID')}
                  </span>
                  <Link
                    href={`/surat/${bookmark.no_surat}#ayat-${bookmark.no_ayat}`}
                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium text-sm"
                  >
                    Baca dalam konteks surat →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Clear All Button */}
          {bookmarks.length > 0 && (
            <div className="text-center mt-8">
              <button
                onClick={clearAllBookmarks}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-md"
              >
                Hapus Semua Bookmark
              </button>
            </div>
          )}
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