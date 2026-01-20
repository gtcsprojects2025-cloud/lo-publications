// src/components/ShareButton.tsx
"use client";

import { Share2 } from "lucide-react";

export default function ShareButton({ title, url }: { title: string; url: string }) {
  const handleShare = async () => {
    const shareData = { title, text: "Check out this article", url };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied!");
      }
    } catch (err) {
      alert("Couldn't share. Copy manually.");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-6 py-3 bg-red-900 text-white rounded-xl hover:bg-red-800 transition shadow-md"
    >
      <Share2 size={20} />
      Share this post
    </button>
  );
}