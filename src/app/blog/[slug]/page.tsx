// src/app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { Calendar, User, Clock, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import ShareButton from "../../components/ShareButton";



// Helper: estimate reading time based on word count
function estimateReadingTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200); // ~200 words per minute
  return minutes === 1 ? "1 min read" : `${minutes} min read`;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = createClient();

  // Fetch the post by slug
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !post) {
    console.error("Post fetch error:", error);
    notFound();
  }

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recent";

  const readingTime = estimateReadingTime(post.content);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 mt-20">
      {/* Back button + share */}
      <div className="max-w-5xl mx-auto px-6 pt-8 md:pt-12 flex justify-between items-left">
        <Link
          href="/blog"
          className="flex items-center gap-2 text-gray-700 hover:text-red-900 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Blog
        </Link>

      
      </div>

      <article className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        {/* Title & Meta */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-gray-600 text-lg">
            <span className="flex items-center gap-2">
              <Calendar size={20} className="text-red-900" />
              {publishedDate}
            </span>
            <span className="flex items-center gap-2">
              <User size={20} className="text-red-900" />
              {post.publisher_name || "LO Publications"}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={20} className="text-red-900" />
              {readingTime}
            </span>
          </div>
        </header>

        {/* Featured Image */}
        {post.thumbnail_url && (
          <div className="mb-16 rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
            <img
              src={post.thumbnail_url}
              alt={post.title}
              className="w-full h-auto max-h-[300] object-cover"
            />
          </div>
        )}

        {/* Rich Content */}
        <div
          className="
            prose prose-lg md:prose-xl lg:prose-2xl max-w-none 
            prose-headings:text-black prose-headings:font-bold
            prose-p:text-gray-800 prose-p:leading-relaxed
            prose-a:text-red-900 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-2xl prose-img:shadow-xl prose-img:border prose-img:border-gray-200
            prose-blockquote:border-l-4 prose-blockquote:border-red-900 prose-blockquote:pl-6 prose-blockquote:italic
            prose-li:text-gray-800
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer / Share again */}
        <footer className="mt-20 pt-10 border-t border-gray-200 text-center">
          <p className="text-gray-600 mb-6">
            Published by {post.publisher_name || "LO Publications"} •{" "}
            {publishedDate}
          </p>

          <div className="flex justify-center gap-6">
            <ShareButton 
  title={post.title}
  url={typeof window !== 'undefined' ? window.location.href : ""}
/>
            <Link
              href="/blog"
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
            >
              Back to all posts
            </Link>
          </div>
        </footer>
      </article>
    </main>
  );
}