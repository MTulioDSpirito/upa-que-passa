import Link from "next/link";
import { Play } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#07070e] border-t border-purple-900/20 mt-20 relative overflow-hidden">
      {/* Detalhe de luz neon no topo do footer */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-purple-500/30 bg-[#0f0f18] transition-all duration-300 group-hover:border-purple-500/60 shadow-lg shadow-purple-500/10">
                <img
                  src="/logo_upa_que_passa.jpg"
                  alt="Upa que Passa Logo"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="font-display text-xl tracking-tight font-extrabold">
                <span className="text-white">UPA</span>
                <span className="text-purple-400"> QUE</span>
                <span className="text-[#0072ce]"> PASSA</span>
              </span>
            </Link>
            
            <p className="text-sm text-gray-400 leading-relaxed">
              O maior portal brasileiro de reviews, notícias e marketplace de jogos para PlayStation 5, PC e Nintendo Switch.
            </p>
            
            <div className="flex gap-3 mt-2">
              {[
                { Icon: Play, label: "YouTube", href: "https://youtube.com/@UpaquePassa", color: "hover:bg-red-600/20 hover:text-red-500" },
              ].map(({ Icon, label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl text-gray-400 transition-all duration-300 border border-white/5 ${color}`}
                >
                  <Icon className="w-5 h-5 fill-current" />
                </a>
              ))}
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider border-l-2 border-purple-500 pl-3">
              Navegação
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Início", path: "/" },
                { name: "Reviews de Jogos", path: "/reviews" },
                { name: "Notícias & Artigos", path: "/noticias" },
                { name: "Últimos Lançamentos", path: "/lancamentos" },
                { name: "Ranking de Notas", path: "/ranking" }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.path} className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider border-l-2 border-[#0072ce] pl-3">
              Marketplace
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Ver Anúncios", path: "/marketplace" },
                { name: "Quem Somos", path: "/quem-somos" },
                { name: "Meu Perfil", path: "/perfil" }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.path} className="text-sm text-gray-400 hover:text-[#0072ce] transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portal & Admin */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider border-l-2 border-pink-500 pl-3">
              Conta & Acesso
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Entrar na Conta", path: "/login" },
                { name: "Criar Conta", path: "/cadastrar" }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.path} className="text-sm text-gray-400 hover:text-pink-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} Upa que Passa. Todos os direitos reservados. Site de fãs não afiliado à Sony Interactive Entertainment ou marcas parceiras.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Termos de Uso</Link>
            <Link href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacidade</Link>
            <Link href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

