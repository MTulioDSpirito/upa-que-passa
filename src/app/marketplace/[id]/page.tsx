import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, MapPin, Eye, Star, Package, Truck, Shield } from "lucide-react";
import { LISTINGS, formatPrice, formatDate } from "@/lib/data";
import { readAdminGames } from "@/lib/adminGames";
import { SITE_URL } from "@/lib/site";
import { PhotoGallery, ContactBox } from "./ListingInteractions";

interface Props { params: Promise<{ id: string }> }

async function getListing(id: string) {
  const listing = LISTINGS.find((l) => l.id === id) ?? null;
  if (!listing) return { listing: null, game: null };
  const games = await readAdminGames();
  const game = listing.gameId ? games.find((g) => g.id === listing.gameId) ?? null : null;
  return { listing, game };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { listing } = await getListing(id);
  if (!listing) return { title: "Anúncio não encontrado — Upa que Passa" };

  const url = `${SITE_URL}/marketplace/${listing.id}`;
  const description = `${listing.description.slice(0, 150)} — ${formatPrice(listing.price)}`;
  return {
    title: `${listing.title} — Marketplace | Upa que Passa`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: listing.title,
      description,
      type: "website",
      url,
      images: listing.photos[0] ? [{ url: listing.photos[0] }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: listing.title,
      description,
      images: listing.photos[0] ? [listing.photos[0]] : undefined,
    },
  };
}

export default async function ListingPage({ params }: Props) {
  const { id } = await params;
  const { listing, game } = await getListing(id);

  if (!listing) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/marketplace" className="hover:text-white">Marketplace</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white truncate">{listing.title}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Photos + Main info */}
        <div className="lg:col-span-2 space-y-6">
          <PhotoGallery photos={listing.photos} title={listing.title} />

          {/* Listing details */}
          <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl font-black text-white leading-tight">{listing.title}</h1>
            </div>

            <div className="flex items-center gap-3 flex-wrap mb-4">
              <span className={`text-sm px-3 py-1 rounded-full font-semibold ${
                listing.condition === "lacrado" ? "bg-green-600/20 text-green-400 border border-green-700/30" :
                listing.condition === "como novo" ? "bg-blue-neon/20 text-blue-neon border border-blue-700/30" :
                "bg-yellow-600/20 text-yellow-400 border border-yellow-700/30"
              }`}>
                {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}
              </span>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Package className="w-3 h-3" />
                {listing.media === "fisica" ? "Mídia Física" : "Mídia Digital"}
              </span>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {listing.views} visualizações
              </span>
              <span className="text-sm text-gray-500">{formatDate(listing.createdAt)}</span>
            </div>

            <div className="text-4xl font-black text-green-400 mb-6">{formatPrice(listing.price)}</div>

            <div className="mb-5">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Descrição</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{listing.description}</p>
            </div>

            {/* Payment & logistics */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="text-xs text-gray-500 mb-2">Formas de Pagamento</h4>
                <div className="flex flex-wrap gap-1.5">
                  {listing.paymentMethods.map((m) => (
                    <span key={m} className="text-xs bg-white/5 text-gray-300 px-2 py-0.5 rounded-full">
                      {m === "pix" ? "PIX" : m === "cartao" ? "Cartão" : m.charAt(0).toUpperCase() + m.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="text-xs text-gray-500 mb-2">Entrega / Retirada</h4>
                <div className="space-y-1">
                  {listing.shipping && (
                    <div className="flex items-center gap-1 text-xs text-blue-neon">
                      <Truck className="w-3 h-3" /> Frete disponível
                    </div>
                  )}
                  {listing.pickup && (
                    <div className="flex items-center gap-1 text-xs text-green-400">
                      <MapPin className="w-3 h-3" /> Retirada em mãos
                    </div>
                  )}
                </div>
              </div>
            </div>

            {listing.acceptsTrade && listing.wantedGames && (
              <div className="bg-purple-900/10 border border-purple-700/20 rounded-xl p-4 mb-5">
                <h4 className="text-purple-400 font-semibold text-sm mb-2">🔄 Aceita Troca</h4>
                <p className="text-xs text-gray-400">Jogos desejados:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {listing.wantedGames.map((g) => (
                    <span key={g} className="text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded-full">{g}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              {listing.city}, {listing.state}
            </div>
          </div>

          {/* Safety tips */}
          <div className="bg-blue-900/10 border border-blue-700/20 rounded-2xl p-5">
            <h3 className="flex items-center gap-2 text-blue-neon font-semibold mb-3">
              <Shield className="w-4 h-4" /> Dicas de Segurança
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Use sempre o chat interno para combinar a negociação</li>
              <li>• Prefira retirar em local público e seguro</li>
              <li>• Teste o jogo antes de finalizar o pagamento</li>
              <li>• Desconfie de preços muito abaixo do mercado</li>
              <li>• Avalie o vendedor após a negociação</li>
            </ul>
          </div>
        </div>

        {/* Sidebar — Seller info + CTA */}
        <div className="space-y-5">
          {/* Price + CTA */}
          <div className="bg-[#0f0f18] border border-green-800/20 rounded-2xl p-5 sticky top-20">
            <div className="text-3xl font-black text-green-400 mb-4">{formatPrice(listing.price)}</div>
            <ContactBox />
          </div>

          {/* Seller info */}
          <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5">
            <h3 className="text-sm text-gray-500 mb-4">Vendedor</h3>
            <div className="flex items-center gap-3 mb-4">
              <img src={listing.userAvatar} alt="" className="w-12 h-12 rounded-full border border-white/10" />
              <div>
                <p className="font-bold text-white">{listing.userNickname}</p>
                <div className="flex items-center gap-1 text-xs text-yellow-400">
                  <Star className="w-3 h-3 fill-yellow-400" />
                  {listing.userReputation}% de aprovação
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white/5 rounded-lg p-2">
                <div className="font-bold text-white">23</div>
                <div className="text-gray-500">Vendas</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <div className="font-bold text-white">8</div>
                <div className="text-gray-500">Trocas</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <div className="font-bold text-white">1h</div>
                <div className="text-gray-500">Resposta</div>
              </div>
            </div>
            <Link
              href={`/perfil/${listing.userId}`}
              className="block mt-3 text-center text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Ver Perfil Completo
            </Link>
          </div>

          {/* Game info */}
          {game && (
            <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm text-gray-500 mb-3">Sobre o Jogo</h3>
              <Link href={`/reviews/${game.slug}`} className="flex gap-3 group">
                <img src={game.cover} alt={game.title} className="w-14 h-20 object-cover rounded-lg" />
                <div>
                  <p className="font-semibold text-white text-sm group-hover:text-purple-300 transition-colors mb-1">{game.title}</p>
                  <p className="text-xs text-gray-500 mb-2">{game.developer}</p>
                  <div className="text-lg font-black text-green-400">
                    {game.adminScore}/10
                  </div>
                  <div className="text-xs text-gray-500">Nota UQP</div>
                </div>
              </Link>
              <Link
                href={`/reviews/${game.slug}`}
                className="block mt-3 text-center text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                Ver Review Completa →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
