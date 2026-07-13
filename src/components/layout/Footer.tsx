import Link from "next/link";
import { Gamepad2, Tv2, Play, Radio, Music, Video } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#07070e] border-t border-purple-900/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-lg">
                <span className="text-white">UPA</span>
                <span className="text-purple-400"> QUE</span>
                <span className="text-[#0072ce]"> PASSA</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              O maior portal brasileiro de reviews, notas e marketplace de jogos de PlayStation 5.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Tv2, label: "Twitch" },
                { Icon: Play, label: "YouTube" },
                { Icon: Radio, label: "Discord" },
                { Icon: Music, label: "TikTok" },
                { Icon: Video, label: "Kick" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-purple-600/30 rounded-lg text-gray-400 hover:text-white transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h4 className="font-semibold text-white mb-4">Reviews</h4>
            <ul className="space-y-2">
              {["Todas as Reviews", "Melhores do Ano", "Mais Comentadas", "Novas Reviews", "Reviews da Equipe"].map((item) => (
                <li key={item}>
                  <Link href="/reviews" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="font-semibold text-white mb-4">Marketplace</h4>
            <ul className="space-y-2">
              {["Ver Anúncios", "Vender Jogo", "Trocar Jogos", "Comprar Jogos", "Como Funciona"].map((item) => (
                <li key={item}>
                  <Link href="/marketplace" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Portal</h4>
            <ul className="space-y-2">
              {["Notícias", "Lançamentos", "Ranking", "Comunidade", "Sobre Nós", "Contato", "Anuncie Aqui", "LGPD / Privacidade"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Upa que Passa. Todos os direitos reservados. Site não afiliado à Sony Interactive Entertainment.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Termos de Uso</Link>
            <Link href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacidade</Link>
            <Link href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
