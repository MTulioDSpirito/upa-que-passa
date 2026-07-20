import { ArrowLeft, Shield, Eye, Lock, RefreshCw, UserCheck } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade — Upa que Passa",
  description: "Entenda como coletamos, guardamos e protegemos os seus dados de acordo com a LGPD no Upa que Passa.",
};

export default function PoliticaDePrivacidadePage() {
  return (
    <main className="min-h-screen bg-[#07070a] text-white py-12 px-4 md:px-8 relative overflow-hidden hero-glow-bg">
      {/* Background glow effects */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

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
          <div className="absolute -top-6 left-6 md:left-10 transform rotate-1 select-none">
            <div className="absolute inset-0 bg-[#0072ce] rounded-xl translate-x-1.5 translate-y-1.5 border-4 border-black" />
            <div className="relative flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white bg-black border-4 border-black px-5 py-2.5 rounded-xl">
              <Shield className="w-5 h-5 text-blue-400" />
              <span>Privacidade & LGPD</span>
            </div>
          </div>

          <div className="mt-6 md:mt-4">
            <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white leading-none uppercase mb-4">
              POLÍTICA DE <span className="text-[#0072ce] bg-black px-2 py-0.5 inline-block transform -rotate-1">PRIVACIDADE</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Última atualização: 20 de Julho de 2026. A sua privacidade é prioridade máxima para a guilda do Upa que Passa. Conheça abaixo como tratamos suas informações.
            </p>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-8">
          {/* Card 1: Coleta de Dados */}
          <section className="bg-[#121220] border-4 border-black rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#000]">
            <h2 className="text-xl md:text-2xl font-display font-black text-yellow-400 uppercase mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-yellow-400" />
              1. Quais dados coletamos e por quê?
            </h2>
            <div className="text-gray-300 space-y-4 text-sm md:text-base leading-relaxed">
              <p>
                Para prover nossos serviços de classificados e interação social de reviews, necessitamos coletar os seguintes dados:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400">
                <li>
                  <strong className="text-white">Dados de Conta:</strong> Nome de usuário, endereço de e-mail, senha criptografada (hash) e imagem de perfil (avatar). Usados unicamente para controle de acesso seguro e identificação nas reviews e anúncios.
                </li>
                <li>
                  <strong className="text-white">Informações de Contato no Marketplace:</strong> Ao criar um anúncio de compra, venda ou troca de jogo, você poderá optar por preencher seu telefone ou links de redes sociais para que outros usuários entrem em contato.
                </li>
                <li>
                  <strong className="text-white">Conteúdo do Usuário:</strong> Resenhas, pontuações de jogos e fotos dos encartes dos jogos que você cadastrar voluntariamente nos anúncios.
                </li>
              </ul>
            </div>
          </section>

          {/* Card 2: Uso e Compartilhamento */}
          <section className="bg-[#121220] border-4 border-black rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#000]">
            <h2 className="text-xl md:text-2xl font-display font-black text-purple-400 uppercase mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-purple-400" />
              2. Como protegemos e compartilhamos seus dados?
            </h2>
            <div className="text-gray-300 space-y-4 text-sm md:text-base leading-relaxed">
              <p>
                Levamos a segurança a sério. Suas senhas são convertidas em hashes criptográficos seguros e nunca armazenadas em texto puro.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400">
                <li>
                  <strong className="text-white">Não vendemos seus dados:</strong> O UQP é financiado por amor à comunidade gamer e, eventualmente, anúncios. Nunca vendemos ou alugamos suas informações pessoais para empresas de publicidade.
                </li>
                <li>
                  <strong className="text-white">Visibilidade Pública Limitada:</strong> Apenas as informações que você decide disponibilizar em seus anúncios (nome de exibição e forma de contato escolhida) ficarão públicas para permitir que o negócio aconteça.
                </li>
              </ul>
            </div>
          </section>

          {/* Card 3: Seus Direitos (LGPD) */}
          <section className="bg-[#121220] border-4 border-black rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#000]">
            <h2 className="text-xl md:text-2xl font-display font-black text-[#0072ce] uppercase mb-4 flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-[#0072ce]" />
              3. Controle Total e Direitos LGPD
            </h2>
            <div className="text-gray-300 space-y-4 text-sm md:text-base leading-relaxed">
              <p>
                Em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD)</strong>, você tem controle total sobre suas informações no portal Upa que Passa:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400">
                <li>
                  <strong className="text-white">Acesso e Correção:</strong> Você pode alterar todos os seus dados diretamente no seu painel de <Link href="/perfil" className="text-purple-400 hover:underline">Meu Perfil</Link> a qualquer momento.
                </li>
                <li>
                  <strong className="text-white">Exclusão Permanente (Esquecimento):</strong> Se desejar apagar completamente sua conta, seus anúncios e seu histórico de dados do nosso banco de dados, você pode solicitar a exclusão através das opções do seu perfil ou contatando um administrador.
                </li>
              </ul>
            </div>
          </section>

          {/* Card 4: Retenção de Dados */}
          <section className="bg-[#121220] border-4 border-black rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#000]">
            <h2 className="text-xl md:text-2xl font-display font-black text-pink-400 uppercase mb-4 flex items-center gap-2">
              <RefreshCw className="w-6 h-6 text-pink-400" />
              4. Período de Retenção
            </h2>
            <div className="text-gray-300 space-y-4 text-sm md:text-base leading-relaxed">
              <p>
                Mantemos seus dados cadastrais ativos enquanto sua conta existir. Seus anúncios expiram e são removidos do feed público automaticamente após um período ou quando você os marcar como "vendido" ou "inativo".
              </p>
            </div>
          </section>
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 text-center text-xs text-gray-500">
          Upa que Passa — Protegendo o seu save e a sua privacidade desde o Level 1.
        </div>
      </div>
    </main>
  );
}
