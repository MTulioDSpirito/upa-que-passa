"use client";

import React, { useState } from "react";

interface GameImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export default function GameImage({
  src,
  alt,
  className,
  fallbackSrc = "/cover_conteudo_nao_disponivel.png",
  ...props
}: GameImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      {...props}
      src={imgSrc || fallbackSrc}
      alt={alt}
      className={className}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
