// src/app/admin/blog/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, Loader2, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Dropcursor from '@tiptap/extension-dropcursor';
import Placeholder from '@tiptap/extension-placeholder';
import FileDropzone from "../../components/admin/FileDropzone";
import { ImageUpload } from '@/lib/tiptap/extensions/ImageUpload'

type BlogPost = {
  id: string;
  title: string;
  slug?: string | null;
  excerpt?: string | null;
  content: string;
  thumbnail_url?: string | null;
  publisher_name?: string | null; // ← New field
  status: "draft" | "published";
  published_at?: string | null;
};

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState("");
  const [publisherName, setPublisherName] = useState(""); // ← New state
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [saving, setSaving] = useState(false);

  // TipTap editor setup
const editor = useEditor({
  extensions: [
    StarterKit,
    Image.configure({ inline: true }),
    Dropcursor,
    Placeholder.configure({ placeholder: "Start writing..." }),
    ImageUpload.configure({
      uploadFn: async (file: File) => {
        const supabase = createClient()
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
        const { data, error } = await supabase.storage
          .from('thumbnails')
          .upload(fileName, file)

        if (error) throw error

        const { data: urlData } = supabase.storage
          .from('thumbnails')
          .getPublicUrl(fileName)

        return urlData.publicUrl
      }
    })
  ],
  content: currentPost?.content || '',
  immediatelyRender: false,
})

// Custom image upload handler
const handleImageUpload = async (file: File): Promise<string> => {
  try {
    const supabase = createClient();
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = `blog-images/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('thumbnails') // or your preferred bucket
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('thumbnails')
      .getPublicUrl(filePath);

    if (!urlData.publicUrl) throw new Error("Failed to get public URL");

    return urlData.publicUrl;
  } catch (err) {
    console.error("Image upload failed:", err);
    throw err; // TipTap will handle the error
  }
};

  // Fetch real posts (include publisher_name)
  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) {
        setError(error.message);
        console.error(error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    }

    fetchPosts();
  }, []);

  const openModal = (post: BlogPost | null = null) => {
    if (post) {
      setCurrentPost(post);
      setTitle(post.title);
      setPublisherName(post.publisher_name || ""); // ← Load existing value
      setThumbnailUrl(post.thumbnail_url || "");
      if (editor) editor.commands.setContent(post.content);
    } else {
      setCurrentPost(null);
      setTitle("");
      setPublisherName(""); // ← Default empty
      setThumbnailUrl("");
      if (editor) editor.commands.setContent("");
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!title || !publisherName || !editor?.getHTML()) {
      setError("Title, Publisher Name, and content are required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();

      const postData = {
        title,
        slug: title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        excerpt: editor.getText().slice(0, 150) + "...",
        content: editor.getHTML(),
        thumbnail_url: thumbnailUrl || null,
        publisher_name: publisherName, // ← Save new field
        status: "published",
      };

      let result;

      if (currentPost) {
        result = await supabase.from("blog_posts").update(postData).eq("id", currentPost.id);
      } else {
        result = await supabase.from("blog_posts").insert(postData);
      }

      if (result.error) throw result.error;

      // Refresh list
      const { data } = await supabase.from("blog_posts").select("*").order("published_at", { ascending: false });
      setPosts(data || []);
      setIsModalOpen(false);
    } catch (err: any) {
      setError("Save failed: " + err.message);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;

      setPosts(posts.filter(p => p.id !== id));
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  return (
    <div className="p-6 md:p-10 mt-30 md:mt-20">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Manage Blog Posts</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-red-900 text-white px-6 py-3 rounded-xl hover:bg-red-800 transition shadow-md"
        >
          <Plus size={20} /> New Post
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="animate-spin mx-auto" size={48} />
          <p className="mt-4 text-gray-600">Loading posts...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-800 p-6 rounded-xl text-center">{error}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-600">No blog posts yet. Create your first one!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
              {post.thumbnail_url && (
                <img src={post.thumbnail_url} alt={post.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                {post.publisher_name && (
                  <p className="text-sm text-gray-600 mb-2">By {post.publisher_name}</p>
                )}
                <div className="text-sm text-gray-500 mb-4">
                  {post.status === "published" ? "Published" : "Draft"}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => openModal(post)} className="text-blue-600 hover:text-blue-800">
                    <Edit size={20} />
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentPost ? "Edit Post" : "New Blog Post"}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={28} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Post Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                  placeholder="Enter a catchy title..."
                />
              </div>

              {/* New field: Publisher Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Publisher Name *</label>
                <input
                  type="text"
                  value={publisherName}
                  onChange={(e) => setPublisherName(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                  placeholder="LO Publications / Your Name / Pen Name"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Thumbnail</label>
                <FileDropzone
                  bucket="thumbnails"
                  onUploadComplete={(url) => setThumbnailUrl(url || "")}
                  currentUrl={thumbnailUrl}
                  accept={{ 'image/*': ['.png', '.jpeg', '.jpg', '.gif'] }}
                  maxSizeMB={5}
                  label="Upload featured image (JPG/PNG)"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Content</label>
                <div className="border border-gray-300 rounded-xl overflow-hidden bg-white min-h-[400px]">
                  {/* Toolbar */}
                  <div className="flex gap-2 p-3 border-b bg-gray-50">
                    <button onClick={() => editor?.chain().focus().toggleBold().run()} className="p-2 hover:bg-gray-200 rounded">
                      <strong>B</strong>
                    </button>
                    <button onClick={() => editor?.chain().focus().toggleItalic().run()} className="p-2 hover:bg-gray-200 rounded">
                      <em>I</em>
                    </button>
                    <button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className="p-2 hover:bg-gray-200 rounded">
                      H1
                    </button>
                    <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className="p-2 hover:bg-gray-200 rounded">
                      • List
                    </button>
                   <button
  onClick={() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // Use the same uploadFn
        handleImageUpload(file).then(url => {
          editor?.chain().focus().setImage({ src: url }).run()
        })
      }
    }
    input.click()
  }}
  className="p-2 hover:bg-gray-200 rounded"
>
  <ImageIcon size={18} />
</button>
                  </div>

                  <EditorContent editor={editor} className="p-4 min-h-[300px]" />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-3 px-8 py-4 bg-red-900 text-white rounded-xl hover:bg-red-800 transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  {saving ? "Saving..." : currentPost ? "Update Post" : "Publish Post"}
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