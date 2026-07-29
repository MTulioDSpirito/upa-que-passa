"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Eye, Heart, Share2, Check } from "lucide-react";
import { useUserSession } from "@/hooks/useUserSession";

export function ViewsCounter({ articleId, initialViews }: { articleId: string; initialViews: number }) {
  const [viewsCount, setViewsCount] = useState(initialViews);

  useEffect(() => {
    const sessionKey = `viewed_news_${articleId}`;
    if (sessionStorage.getItem(sessionKey)) return;
    fetch("/api/noticias/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.views === "number") {
          setViewsCount(data.views);
          sessionStorage.setItem(sessionKey, "true");
        }
      })
      // Fire-and-forget proposital: se falhar, sessionKey não é setada e a
      // próxima visita tenta de novo — sem backoff, mas sem travar a leitura da notícia.
      .catch(() => {});
  }, [articleId]);

  return (
    <span className="flex items-center gap-1.5">
      <Eye className="w-4 h-4" /> {viewsCount.toLocaleString("pt-BR")} views
    </span>
  );
}

export function ReactionBar({ articleId, initialLikes }: { articleId: string; initialLikes: number }) {
  const currentUser = useUserSession();
  const router = useRouter();
  const pathname = usePathname();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/noticias/like?articleId=${articleId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setLiked(data.liked);
          setLikesCount(data.likesCount);
        }
      })
      .catch(() => {});
  }, [articleId, currentUser]);

  const handleLike = async () => {
    if (!currentUser) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    try {
      const res = await fetch("/api/noticias/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId }),
      });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setLikesCount(data.likesCount);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-4 mb-14">
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 btn-press ${
          liked
            ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
            : "bg-red-900/10 border border-red-800/20 text-red-400 hover:bg-red-900/25"
        }`}
      >
        <Heart className={`w-4 h-4 ${liked ? "fill-white" : ""}`} />
        {likesCount} Curtidas
      </button>
      <button
        onClick={handleShare}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 btn-press ${
          copied
            ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
            : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
        }`}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            Copiado!
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            Compartilhar
          </>
        )}
      </button>
    </div>
  );
}
