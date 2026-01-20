// src/app/blog/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, User, Clock, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type BlogPost = {
  id: string;
  title: string;
  slug?: string | null;
  excerpt?: string | null;
  content: string;
  thumbnail_url?: string | null;
  published_at?: string | null;
  publisher_name?: string | null;  // ← Now included
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<BlogPost[]>([]);

  // Fetch all published posts
  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) {
        setError("Failed to load blog posts");
        console.error(error);
      } else {
        setPosts(data || []);

        // Featured = latest post
        if (data && data.length > 0) {
          setFeaturedPost(data[0]);
        }

        // Recently viewed from localStorage
        const viewedIds = JSON.parse(localStorage.getItem("recentlyViewedBlogs") || "[]");
        const viewedPosts = data?.filter(p => viewedIds.includes(p.id)).slice(0, 3) || [];
        setRecentlyViewed(viewedPosts);
      }
      setLoading(false);
    }

    fetchPosts();
  }, []);

  // Track recently viewed when clicking
  const handleReadMore = (post: BlogPost) => {
    const viewedIds = JSON.parse(localStorage.getItem("recentlyViewedBlogs") || "[]");
    const newIds = [post.id, ...viewedIds.filter((id: string) => id !== post.id)].slice(0, 10);
    localStorage.setItem("recentlyViewedBlogs", JSON.stringify(newIds));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-red-900" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
            Our Blog & Insights
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto">
            Stories, teachings, reflections, and inspiration from the heart of LO Publications.
          </p>
        </motion.div>

        {/* Featured + Recently Viewed */}
        {featuredPost && (
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Big Featured Post (reduced height) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="md:col-span-2 bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200 group hover:shadow-red-900/10 transition-shadow"
            >
              <Link href={`/blog/${featuredPost.slug || featuredPost.id}`}>
                <div className="relative h-64 md:h-[400px] overflow-hidden">
                  <img
                    src={featuredPost.thumbnail_url || "https://via.placeholder.com/1200x400?text=Featured+Post"}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 line-clamp-2">
                      {featuredPost.title}
                    </h2>
                    <div className="flex items-center gap-6 text-white/90 text-sm md:text-base">
                      <span className="flex items-center gap-2">
                        <Calendar size={20} /> {featuredPost.published_at ? new Date(featuredPost.published_at).toLocaleDateString() : "Recent"}
                      </span>
                      <span className="flex items-center gap-2">
                        <User size={20} /> {featuredPost.publisher_name || "LO Publications"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Recently Viewed */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Clock className="text-red-900" size={24} /> Recently Viewed
              </h3>

              {recentlyViewed.length === 0 ? (
                <p className="text-gray-600">No recently viewed posts yet. Explore the blog!</p>
              ) : (
                recentlyViewed.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug || post.id}`} onClick={() => handleReadMore(post)}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all group flex gap-4 p-4"
                    >
                      <img
                        src={post.thumbnail_url || "https://via.placeholder.com/120x120?text=Post"}
                        alt={post.title}
                        className="w-24 h-24 object-cover rounded-xl"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-red-900 transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {post.published_at ? new Date(post.published_at).toLocaleDateString() : "Recent"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {post.publisher_name || "LO Publications"}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}

        {/* Remaining Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts
            .filter(p => p.id !== featuredPost?.id)
            .map((post) => (
              <Link key={post.id} href={`/blog/${post.slug || post.id}`} onClick={() => handleReadMore(post)}>
                <motion.article
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03, y: -8 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={post.thumbnail_url || "https://via.placeholder.com/800x600?text=Blog+Post"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-8">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} /> {post.published_at ? new Date(post.published_at).toLocaleDateString() : "Recent"}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={16} /> {post.publisher_name || "LO Publications"}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-black mb-4 line-clamp-2 group-hover:text-red-900 transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-gray-600 line-clamp-3 mb-6">
                      {post.excerpt || post.content.slice(0, 150) + "..."}
                    </p>

                    <div className="text-red-900 font-medium group-hover:underline flex items-center gap-2">
                      Read More <ArrowRight size={18} />
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
        </div>
      </div>
    </main>
  );
}