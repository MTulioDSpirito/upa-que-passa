import Link from "next/link";
import { 
  ShoppingBag,
  Gamepad2, 
  ArrowLeftRight, 
  MapPin, 
  Star,
  Lock,
  ArrowRight
} from "lucide-react";
import { formatPrice } from "@/lib/data";

// Curated example listings to show what the marketplace offers
const EXAMPLE_LISTINGS = [
  {
    id: "ex-1",
    title: "Zelda: Tears of the Kingdom - Mídia Física",
    platform: "Nintendo Switch",
    condition: "como novo",
    price: 249.90,
    city: "Curitiba",
    state: "PR",
    acceptsTrade: true,
    userNickname: "PedroSwitch",
    userReputation: 99,
    photo: "/images/marketingPlace/zelda.jpg"
  },
  {
    id: "ex-2",
    title: "Controle DualSense Edge de Alta Performance",
    platform: "Acessório PS5",
    condition: "lacrado",
    price: 899.00,
    city: "São Paulo",
    state: "SP",
    acceptsTrade: false,
    userNickname: "GamingZone",
    userReputation: 97,
    photo: "/images/marketingPlace/DualSense Edge.png"
  },
  {
    id: "ex-3",
    title: "Console Xbox Series X 1TB - Com 2 Controles",
    platform: "Console Xbox",
    condition: "bom estado",
    price: 3200.00,
    city: "Belo Horizonte",
    state: "MG",
    acceptsTrade: true,
    userNickname: "XboxFan99",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=XboxFan",
    userReputation: 95,
    photo: "/images/marketingPlace/Xbox_Series.jpg"
  }
];

interface MarketplaceFeaturedProps {
  activeListings?: any[];
}

export default function MarketplaceFeatured({ activeListings }: MarketplaceFeaturedProps = {}) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Informative Header / Hero Box */}
      <div className="group relative overflow-hidden bg-gradient-to-r from-[#11111f] via-[#0b0b14] to-[#07070a] border border-white/5 rounded-3xl p-6 md:p-8 lg:p-10 mb-10 shadow-2xl hover:border-white/10 transition-all duration-300">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
          {/* Main Info */}
          <div className="lg:col-span-7 space-y-5">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight transition-transform duration-500 group-hover:scale-[1.05] origin-left">
              Marketplace de <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">Jogos Usados</span>
            </h2>
            
            <p className="text-gray-400 text-sm md:text-base max-w-xl leading-relaxed">
              O portal Upa que Passa conta com uma seção exclusiva onde você pode comprar, vender e trocar mídias físicas ou acessórios diretamente com outros membros do portal de forma 100% gratuita.
            </p>

            {/* Feature Bullets */}
            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">Mídias & Acessórios</h4>
                  <p className="text-[11px] text-gray-400">Veja e crie anúncios de itens gamers rapidamente.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <ArrowLeftRight className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">Filtros Avançados</h4>
                  <p className="text-[11px] text-gray-400">Pesquise por console, preço e estado de conservação.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">Negociação Direta</h4>
                  <p className="text-[11px] text-gray-400">Veja a localização do vendedor e fale diretamente.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Callouts */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center items-stretch lg:pl-6 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0">
            <div className="flex-1 text-center lg:text-left space-y-1 mb-2 sm:mb-0 lg:mb-4">
              <span className="text-xs text-gray-500 block uppercase tracking-wider font-bold">Faça parte do ecossistema</span>
              <p className="text-sm text-gray-300">Cadastre-se agora para publicar anúncios ou entrar em contato com vendedores.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Link 
                href="/marketplace" 
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-950/20 active:scale-[0.98]"
              >
                <ArrowRight className="w-4 h-4" /> Mais informações
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Listings Subsection Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-bold text-white">Como Funciona a Vitrine de Anúncios</h3>
        </div>
        <span className="text-xs text-gray-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
          Exemplos ilustrativos
        </span>
      </div>

      {/* Mock Listings Grid with Blur overlay */}
      <div className="relative">
        <div className="grid md:grid-cols-3 gap-6 select-none pointer-events-none filter blur-[3px] opacity-40">
          {EXAMPLE_LISTINGS.map((listing) => (
            <div
              key={listing.id}
              className="flex flex-col bg-[#0b0b13] border border-white/5 rounded-2xl overflow-hidden"
            >
              {/* Photo & badges */}
              <div className="relative h-48 bg-black/20">
                <img
                  src={listing.photo}
                  alt={listing.title}
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Console Badge */}
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] uppercase font-black px-2 py-1 bg-black text-white rounded">
                    {listing.platform}
                  </span>
                </div>

                {/* Condition & Trade badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-500 text-white">
                    {listing.condition}
                  </span>
                </div>
              </div>

              {/* Info block */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white mb-2 line-clamp-2 leading-snug">
                    {listing.title}
                  </h4>
                  
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-2xl font-black text-green-400">
                      {formatPrice(listing.price)}
                    </span>
                    
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-500" />
                      {listing.city}, {listing.state}
                    </span>
                  </div>
                </div>

                {/* User card row */}
                <div className="flex items-center gap-2.5 pt-3.5 border-t border-white/5">
                  <img src={listing.userAvatar} alt="" className="w-7 h-7 rounded-full bg-white/5" />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-300 font-semibold">
                      {listing.userNickname}
                    </span>
                    <span className="text-[10px] text-yellow-400 font-medium flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {listing.userReputation}% reputação
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lock / Authentication Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-[#07070a] via-[#07070a]/80 to-transparent p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-900/30 text-white mb-5 animate-pulse">
            <Lock className="w-6 h-6" />
          </div>
          
          <h4 className="text-xl md:text-2xl font-black text-white mb-2 max-w-md">
            Desbloqueie o Acesso ao Marketplace
          </h4>
          
          <p className="text-gray-400 text-sm max-w-sm mb-6 leading-relaxed">
            Cadastre-se na plataforma para visualizar todos os anúncios reais de outros usuários e negociar diretamente.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <Link
              href="/cadastrar"
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all shadow-md shadow-green-950/20 active:scale-[0.98]"
            >
              Criar Conta Grátis
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
