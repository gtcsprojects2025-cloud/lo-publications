// src/app/admin/testimonials/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, Loader2, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import FileDropzone from "../../components/admin/FileDropzone";

// Type matching your testimonials table
type Testimonial = {
  id: string;
  author: string;
  role?: string | null;
  quote: string;
  avatar_url?: string | null;
  rating: number; // 1-5
  created_at: string;
};

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [rating, setRating] = useState(5);
  const [saving, setSaving] = useState(false);

  // Fetch real testimonials
  useEffect(() => {
    async function fetchTestimonials() {
      setLoading(true);
      setError(null);

      const supabase = createClient();

      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        console.error("Fetch error:", error);
      } else {
        setTestimonials(data || []);
      }
      setLoading(false);
    }

    fetchTestimonials();
  }, []);

  const openModal = (testimonial: Testimonial | null = null) => {
    if (testimonial) {
      setCurrentTestimonial(testimonial);
      setAuthor(testimonial.author);
      setRole(testimonial.role || "");
      setQuote(testimonial.quote);
      setAvatarUrl(testimonial.avatar_url || "");
      setRating(testimonial.rating);
    } else {
      setCurrentTestimonial(null);
      setAuthor("");
      setRole("");
      setQuote("");
      setAvatarUrl("");
      setRating(5);
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!author || !quote) {
      setError("Author and Quote are required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();

      const testimonialData = {
        author,
        role: role || null,
        quote,
        avatar_url: avatarUrl || null,
        rating,
      };

      let result;

      if (currentTestimonial) {
        result = await supabase
          .from("testimonials")
          .update(testimonialData)
          .eq("id", currentTestimonial.id);
      } else {
        result = await supabase.from("testimonials").insert(testimonialData);
      }

      if (result.error) throw result.error;

      // Refresh list
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      setTestimonials(data || []);
      setIsModalOpen(false);
    } catch (err: any) {
      setError("Save failed: " + (err.message || "Unknown error"));
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial permanently?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from("testimonials").delete().eq("id", id);

      if (error) throw error;

      setTestimonials(testimonials.filter(t => t.id !== id));
    } catch (err: any) {
      alert("Delete failed: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div className="mt-30 md:mt-20">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Manage Testimonials
        </h1>

        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-red-900 text-white px-6 py-3 rounded-xl hover:bg-red-800 transition shadow-md"
        >
          <Plus size={20} />
          Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="animate-spin mx-auto" size={48} />
          <p className="mt-4 text-gray-600">Loading testimonials...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-800 p-6 rounded-xl text-center font-medium">
          {error}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          No testimonials yet. Click "Add Testimonial" to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 p-6 transition hover:shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={t.avatar_url || "https://via.placeholder.com/100?text=Avatar"}
                  alt={t.author}
                  className="w-16 h-16 rounded-full object-cover border-2 border-red-900"
                />
                <div>
                  <h3 className="font-bold text-gray-900">{t.author}</h3>
                  {t.role && <p className="text-sm text-gray-600">{t.role}</p>}
                </div>
              </div>

              <p className="text-gray-700 italic mb-4">"{t.quote}"</p>

              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < t.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={() => openModal(t)} className="text-blue-600 hover:text-blue-800">
                  <Edit size={20} />
                </button>
                <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-800">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={28} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Author Name *</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                  placeholder="Daniel"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Role/Title</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                  placeholder="Debut Novelist"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Quote/Testimonial *</label>
                <textarea
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900 h-32"
                  placeholder="The team was amazing..."
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Avatar Photo</label>
                <FileDropzone
                  bucket="testimonials-avatars"  // Change to your exact bucket name!
                  onUploadComplete={(url) => setAvatarUrl(url || "")}
                  currentUrl={avatarUrl}
                  accept="image/*"
                  maxSizeMB={5}
                  label="Drag & drop avatar (JPG/PNG, max 5MB)"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Rating (1–5 stars)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                >
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>
                      {r} Stars
                    </option>
                  ))}
                </select>
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
                  {saving ? "Saving..." : currentTestimonial ? "Update Testimonial" : "Add Testimonial"}
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