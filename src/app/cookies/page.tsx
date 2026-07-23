import { ArrowLeft, Cookie, HelpCircle, ToggleLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Política de Cookies — Upa que Passa",
  description: "Entenda o que são cookies, quais tipos utilizamos no Upa que Passa e como você pode controlá-los.",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#07070a] text-white py-12 px-4 md:px-8 relative overflow-hidden hero-glow-bg">
      {/* Background glow effects */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para a Home</span>
        </Link>

        {/* Header Block */}
        <div className="relative mb-12 bg-gradient-to-br from-[#121220] to-[#0c0c14] border-4 border-black rounded-3xl p-6 md:p-10 shadow-[8px_8px_0px_0px_#000]">
          <div className="absolute -top-6 left-6 md:left-10 transform -rotate-1 select-none">
            <div className="absolute inset-0 bg-purple rounded-xl translate-x-1.5 translate-y-1.5 border-4 border-black" />
            <div className="relative flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white bg-black border-4 border-black px-5 py-2.5 rounded-xl">
              <Cookie className="w-5 h-5 text-purple-400" />
              <span>Cookies do Sistema</span>
            </div>
          </div>

          <div className="mt-6 md:mt-4">
            <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white leading-none uppercase mb-4">
              POLÍTICA DE <span className="text-purple-light bg-black px-2 py-0.5 inline-block transform rotate-1">COOKIES</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Última atualização: 20 de Julho de 2026. Entenda de forma honesta o que são e para que servem os cookies que o UQP utiliza.
            </p>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-8">
          {/* Card 1: O que são cookies */}
          <section className="bg-[#121220] border-4 border-black rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#000]">
            <h2 className="text-xl md:text-2xl font-display font-black text-yellow-400 uppercase mb-4 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-yellow-400" />
              1. O que são cookies?
            </h2>
            <div className="text-gray-300 space-y-4 text-sm md:text-base leading-relaxed">
              <p>
                Cookies são pequenos arquivos de texto salvos pelo seu navegador (Chrome, Firefox, Safari, Edge, etc.) no seu computador ou celular quando você visita um site. Eles ajudam o portal a "lembrar" das suas ações e preferências ao longo do tempo.
              </p>
            </div>
          </section>

          {/* Card 2: Cookies que utilizamos */}
          <section className="bg-[#121220] border-4 border-black rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#000]">
            <h2 className="text-xl md:text-2xl font-display font-black text-purple-400 uppercase mb-4 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-purple-400" />
              2. Quais cookies nós utilizamos?
            </h2>
            <div className="text-gray-300 space-y-4 text-sm md:text-base leading-relaxed">
              <p>
                Utilizamos cookies estritamente necessários para o funcionamento e cookies analíticos para melhorar a sua experiência:
              </p>
              <ul className="list-disc pl-5 space-y-3 text-gray-400">
                <li>
                  <strong className="text-white">Cookies de Sessão e Autenticação (Essenciais):</strong> Identificam que você está logado na sua conta enquanto navega pelas páginas ou cria anúncios. Sem eles, você precisaria digitar seu e-mail e senha a cada clique.
                </li>
                <li>
                  <strong className="text-white">Cookies de Segurança:</strong> Protegem contra ataques virtuais e evitam falsificação de requisições entre sites (proteção contra CSRF).
                </li>
                <li>
                  <strong className="text-white">Cookies de Preferências do Usuário:</strong> Salvam pequenas configurações pessoais, como filtros de busca no marketplace e preferências de layout.
                </li>
                <li>
                  <strong className="text-white">Cookies de Análise e Performance (Opcionais):</strong> Podem ser utilizados para entender quantas pessoas acessam o UQP diariamente, quais notícias são mais lidas e se alguma página está lenta ou com erros.
                </li>
              </ul>
            </div>
          </section>

          {/* Card 3: Como controlar */}
          <section className="bg-[#121220] border-4 border-black rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#000]">
            <h2 className="text-xl md:text-2xl font-display font-black text-blue-neon uppercase mb-4 flex items-center gap-2">
              <ToggleLeft className="w-6 h-6 text-blue-neon" />
              3. Como gerenciar os cookies no seu navegador?
            </h2>
            <div className="text-gray-300 space-y-4 text-sm md:text-base leading-relaxed">
              <p>
                Você tem o poder de aceitar, recusar ou excluir os cookies do UQP a qualquer momento. Para fazer isso, basta alterar as configurações do seu próprio navegador.
              </p>
              <p className="border-l-4 border-purple-500 pl-4 py-1 italic bg-white/5 rounded-r-lg">
                <strong>Atenção:</strong> Ao desabilitar os cookies essenciais de autenticação, você não conseguirá manter-se logado na sua conta, tornando impossível criar novos anúncios ou gerenciar seus classificados no marketplace.
              </p>
            </div>
          </section>
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 text-center text-xs text-gray-500">
          Upa que Passa — Transparência total para sua navegação fluir a 60 FPS.
        </div>
      </div>
    </main>
  );
}
