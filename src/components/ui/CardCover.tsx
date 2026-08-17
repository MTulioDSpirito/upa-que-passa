"use client";

import { useCallback, useState } from "react";

interface CardCoverProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  /** Set true for above-the-fold hero covers (e.g. featured slide, article hero) so the
   * browser fetches them eagerly instead of deferring — improves LCP for those spots. */
  priority?: boolean;
}

// Se a proporção da imagem for parecida com a do card (dentro dessa margem), object-cover
// preenche o quadro inteiro sem corte perceptível. Fora dessa margem (ex: capa de jogo em pé
// dentro de um card largo), object-cover cortaria parte importante da arte — usamos
// object-contain (imagem inteira, sem corte) nesses casos.
const ASPECT_RATIO_TOLERANCE = 0.35;

/**
 * Drop-in replacement for a plain <img> inside a `relative` + fixed-size + `overflow-hidden`
 * card container. Decide automaticamente, comparando a proporção real da imagem com a do card,
 * entre cobrir o quadro (object-cover, sem sobra) ou mostrar a imagem inteira com um fundo
 * desfocado da própria imagem preenchendo o resto (object-contain) — nunca corta o que importa
 * e nunca deixa espaço vazio "morto". Só carrega a segunda imagem (o fundo desfocado) quando ela
 * é realmente necessária, o que também acelera o carregamento dos cards que já cabem certinho.
 */
export default function CardCover({
  src,
  alt,
  className = "",
  fallbackSrc = "/cover_conteudo_nao_disponivel.png",
  priority = false,
}: CardCoverProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  // Guarda pra qual src a medição vale, junto com o resultado — evita ler ref durante o render.
  const [measured, setMeasured] = useState<{ src: string; fit: "cover" | "contain" } | null>(null);
  const loading = priority ? "eager" : "lazy";

  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const container = img.parentElement;
    if (!container || !img.naturalWidth || !img.naturalHeight || !container.clientHeight) return;

    const imageAspect = img.naturalWidth / img.naturalHeight;
    const containerAspect = container.clientWidth / container.clientHeight;
    const relativeDiff = Math.abs(imageAspect / containerAspect - 1);

    setMeasured({ src: imgSrc, fit: relativeDiff <= ASPECT_RATIO_TOLERANCE ? "cover" : "contain" });
  }, [imgSrc]);

  // Enquanto a imagem atual não foi medida (troca de src, ex: fallback), assume cover — evita
  // um flash de "contain" antes da medição real, já que a maioria das capas cobre bem o card.
  const showBackdrop = measured?.src === imgSrc && measured.fit === "contain";

  return (
    <>
      {showBackdrop && (
        <img
          src={imgSrc}
          alt=""
          aria-hidden="true"
          loading={loading}
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-40"
        />
      )}
      <img
        src={imgSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={handleLoad}
        className={`absolute inset-0 w-full h-full ${showBackdrop ? "object-contain" : "object-cover"} ${className}`}
        onError={() => {
          setMeasured(null);
          setImgSrc(fallbackSrc);
        }}
      />
    </>
  );
}
