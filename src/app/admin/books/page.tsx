// src/app/admin/books/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, Loader2, Link as LinkIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import FileDropzone from "../../components/admin/FileDropzone";

// Type matching your books table
type Book = {
  id: string;
  title: string;
  author: string;
  description?: string | null;
  cover_url?: string | null;
  downloads?: { label: string; url: string }[] | null;
  published_year?: number | null;
  status: "draft" | "published";
  created_at: string;
};

export default function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [downloads, setDownloads] = useState<{ label: string; url: string }[]>([]);
  const [saving, setSaving] = useState(false);

  // Fetch real books
  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      setError(null);

      const supabase = createClient();

      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        console.error("Fetch error:", error);
      } else {
        setBooks(data || []);
      }
      setLoading(false);
    }

    fetchBooks();
  }, []);

  const openModal = (book: Book | null = null) => {
    if (book) {
      setCurrentBook(book);
      setTitle(book.title);
      setAuthor(book.author);
      setDescription(book.description || "");
      setCoverUrl(book.cover_url || "");
      setDownloads(book.downloads || []);
    } else {
      setCurrentBook(null);
      setTitle("");
      setAuthor("");
      setDescription("");
      setCoverUrl("");
      setDownloads([]);
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!title || !author) {
      setError("Title and Author are required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();

      const bookData = {
        title,
        author,
        description: description || null,
        cover_url: coverUrl || null,
        downloads: downloads.length > 0 ? downloads : null,
        status: "published" as const,
      };

      let result;

      if (currentBook) {
        result = await supabase
          .from("books")
          .update(bookData)
          .eq("id", currentBook.id);
      } else {
        result = await supabase.from("books").insert(bookData);
      }

      if (result.error) throw result.error;

      // Refresh list
      const { data } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });

      setBooks(data || []);
      setIsModalOpen(false);
    } catch (err: any) {
      setError("Save failed: " + (err.message || "Unknown error"));
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addDownloadLink = () => {
    setDownloads([...downloads, { label: "", url: "" }]);
  };

  const updateDownloadLink = (index: number, field: "label" | "url", value: string) => {
    const newDownloads = [...downloads];
    newDownloads[index][field] = value;
    setDownloads(newDownloads);
  };

  const removeDownloadLink = (index: number) => {
    setDownloads(downloads.filter((_, i) => i !== index));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this book permanently?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from("books").delete().eq("id", id);

      if (error) throw error;

      setBooks(books.filter(b => b.id !== id));
    } catch (err: any) {
      alert("Delete failed: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div className="mt-30 md:mt-20">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Manage Books
        </h1>

        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-red-900 text-white px-6 py-3 rounded-xl hover:bg-red-800 transition shadow-md"
        >
          <Plus size={20} />
          Add Book
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="animate-spin mx-auto" size={48} />
          <p className="mt-4 text-gray-600">Loading books...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-800 p-6 rounded-xl text-center font-medium">
          {error}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          No books yet. Click "Add Book" to get started.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Author</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{book.title}</td>
                  <td className="px-6 py-4 text-gray-600">{book.author}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      book.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-4">
                    <button onClick={() => openModal(book)} className="text-blue-600 hover:text-blue-800">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(book.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentBook ? "Edit Book" : "Add New Book"}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={28} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Book Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                  placeholder="Enter book title..."
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Author *</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                  placeholder="Author name"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900 h-32"
                  placeholder="Brief book description..."
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Book Cover</label>
                <FileDropzone
                  bucket="book-covers"  // Change to your exact bucket name!
                  onUploadComplete={(url) => setCoverUrl(url || "")}
                  currentUrl={coverUrl}
                  accept="image/*"
                  maxSizeMB={5}
                  label="Drag & drop cover image (JPG/PNG)"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Download Links</label>
                {downloads.map((link, index) => (
                  <div key={index} className="flex gap-4 mb-4 items-center">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateDownloadLink(index, "label", e.target.value)}
                      placeholder="Label (e.g. PDF Nigeria)"
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-300"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => updateDownloadLink(index, "url", e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-300"
                    />
                    <button
                      onClick={() => removeDownloadLink(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addDownloadLink}
                  className="text-red-900 hover:text-red-700 font-medium flex items-center gap-2 mt-2"
                >
                  <Plus size={18} /> Add Download Link
                </button>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-3 px-8 py-4 bg-red-900 text-white rounded-xl hover:bg-red-800 transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  {saving ? "Saving..." : currentBook ? "Update Book" : "Add Book"}
                </button>
              </div>

              {error && <p className="text-red-600 text-center mt-4">{error}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}