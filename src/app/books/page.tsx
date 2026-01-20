// src/app/books/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, BookOpen, Calendar, User, Globe, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Define TypeScript type matching your books table
type Book = {
  id: string;
  title: string;
  author: string;
  cover_url?: string | null;
  description?: string | null;
  published_year?: number | null;
  genre?: string | null;
  downloads?: { label: string; url: string }[] | null;
  status: "draft" | "published";
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Fetch real books from Supabase
  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      setError(null);

      const supabase = createClient();

      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("status", "published") // Only show published books
        .order("published_year", { ascending: false });

      if (error) {
        setError("Failed to load books. Please try again later.");
        console.error("Fetch error:", error);
      } else {
        setBooks(data || []);
      }
      setLoading(false);
    }

    fetchBooks();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 mt-20 md:mt-0 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
            Our Published Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stories of faith, hope, transformation, and purpose — crafted with love and excellence.
          </p>
        </motion.div>

        {/* Loading / Error State */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="animate-spin mx-auto" size={48} />
            <p className="mt-4 text-gray-600">Loading books...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-600">
            {error}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            No books available yet. Check back soon!
          </div>
        ) : (
          /* Books Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {books.map((book) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.03, y: -8 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                onClick={() => setSelectedBook(book)}
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={book.cover_url || "https://via.placeholder.com/800x800?text=No+Cover"}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black mb-2 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{book.author}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} /> {book.published_year || "N/A"}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen size={16} /> {book.genre || "General"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {selectedBook && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedBook(null)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                transition={{ type: "spring", damping: 20 }}
                className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedBook(null)}
                  className="absolute top-6 right-6 z-10 p-3 bg-white/80 rounded-full hover:bg-white transition shadow-md"
                >
                  <X size={24} className="text-gray-800" />
                </button>

                <div className="grid md:grid-cols-2 gap-0">
                  {/* Left: Cover */}
                  <div className="relative h-96 md:h-full">
                    <img
                      src={selectedBook.cover_url || "https://via.placeholder.com/800x800?text=No+Cover"}
                      alt={selectedBook.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* Right: Details */}
                  <div className="p-10 md:p-12 space-y-8">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
                        {selectedBook.title}
                      </h2>
                      <p className="text-xl text-red-900 font-medium">
                        by {selectedBook.author}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-6 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={20} className="text-red-900" />
                        <span>{selectedBook.published_year || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen size={20} className="text-red-900" />
                        <span>{selectedBook.genre || "General"}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed text-lg">
                      {selectedBook.description || "No description available."}
                    </p>

                    {/* Download Options */}
                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Download size={24} className="text-red-900" />
                        Available Formats
                      </h4>

                      {selectedBook.downloads && selectedBook.downloads.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {selectedBook.downloads.map((download, idx) => (
                            <a
                              key={idx}
                              href={download.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-3 px-6 py-4 bg-red-900 text-white rounded-xl hover:bg-red-800 transition shadow-md"
                            >
                              <Globe size={20} />
                              {download.label}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600">No download formats available yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}