"use client";

import { useState } from "react";

interface CardCoverProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  /** Set true for above-the-fold hero covers (e.g. featured slide, article hero) so the
   * browser fetches them eagerly instead of deferring — improves LCP for those spots. */
  priority?: boolean;
}

/**
 * Drop-in replacement for a plain <img> inside a `relative` + fixed-size + `overflow-hidden`
 * card container. Covers use very different aspect ratios (tall box art vs wide banners), so a
 * single object-cover crops verticals hard and zooms into horizontals. This renders a blurred
 * object-cover backdrop to fill the frame plus a full, uncropped object-contain image on top,
 * so every cover reads correctly regardless of its own orientation.
 */
export default function CardCover({
  src,
  alt,
  className = "",
  fallbackSrc = "/cover_conteudo_nao_disponivel.png",
  priority = false,
}: CardCoverProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const loading = priority ? "eager" : "lazy";

  return (
    <>
      <img
        src={imgSrc}
        alt=""
        aria-hidden="true"
        loading={loading}
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-40"
      />
      <img
        src={imgSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={`absolute inset-0 w-full h-full object-contain ${className}`}
        onError={() => setImgSrc(fallbackSrc)}
      />
    </>
  );
}
