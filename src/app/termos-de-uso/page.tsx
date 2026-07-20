import { ArrowLeft, FileText, ShieldAlert, Users, Scale, MessageSquareCode } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Termos de Uso — Upa que Passa",
  description: "Termos e condições de uso da plataforma Upa que Passa. Leia atentamente as regras de convivência e do marketplace.",
};

export default function TermosDeUsoPage() {
  return (
    <main className="min-h-screen bg-[#07070a] text-white py-12 px-4 md:px-8 relative overflow-hidden hero-glow-bg">
      {/* Background glow effects */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

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
          <div className="absolute -top-6 left-6 md:left-10 transform -rotate-2 select-none">
            <div className="absolute inset-0 bg-purple-600 rounded-xl translate-x-1.5 translate-y-1.5 border-4 border-black" />
            <div className="relative flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white bg-black border-4 border-black px-5 py-2.5 rounded-xl">
              <FileText className="w-5 h-5 text-purple-400" />
              <span>Regras de Conduta</span>
            </div>
          </div>

          <div className="mt-6 md:mt-4">
            <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white leading-none uppercase mb-4">
              TERMOS DE <span className="text-purple-400 bg-black px-2 py-0.5 inline-block transform rotate-1">USO</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Última atualização: 20 de Julho de 2026. Bem-vindo ao Upa que Passa (UQP). Ao acessar ou utilizar nossa plataforma, você concorda com estes termos.
            </p>
          </div>
        </div>

        {/* Content sections in Scott Pilgrim style cards */}
        <div className="space-y-8">
          {/* Card 1: Natureza da Plataforma */}
          <section className="bg-[#121220] border-4 border-black rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#000]">
            <h2 className="text-xl md:text-2xl font-display font-black text-yellow-400 uppercase mb-4 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-yellow-400" />
              1. Natureza do Upa que Passa
            </h2>
            <div className="text-gray-300 space-y-4 text-sm md:text-base leading-relaxed">
              <p>
                O <strong>Upa que Passa</strong> é um portal focado em avaliações (reviews), notícias, rankings e facilitação de marketplace para jogos de PlayStation 5, PC e Nintendo Switch.
              </p>
              <p className="border-l-4 border-purple-500 pl-4 py-1 italic bg-white/5 rounded-r-lg">
                <strong>Nota Importante:</strong> Somos um site de fãs e uma plataforma de classificados. Não somos afiliados, autorizados, patrocinados ou associados de qualquer forma com a Sony Interactive Entertainment, Nintendo Co., Ltd., ou qualquer publicadora de jogos.
              </p>
            </div>
          </section>

          {/* Card 2: Marketplace e Negociações */}
          <section className="bg-[#121220] border-4 border-black rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#000]">
            <h2 className="text-xl md:text-2xl font-display font-black text-purple-400 uppercase mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              2. Isenção de Responsabilidade no Marketplace
            </h2>
            <div className="text-gray-300 space-y-4 text-sm md:text-base leading-relaxed">
              <p>
                O UQP disponibiliza uma área de marketplace para que os usuários cadastrados possam anunciar seus jogos físicos e negociar diretamente uns com os outros.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400">
                <li>
                  <strong className="text-white">Intermediação Limitada:</strong> A plataforma atua puramente como um mural de anúncios digitais. Não processamos pagamentos, não fazemos entregas e não cobramos comissões sobre as negociações.
                </li>
                <li>
                  <strong className="text-white">Responsabilidade Direta:</strong> Toda transação (valores, formas de pagamento, trocas, fretes e veracidade das informações dos itens) é de inteira responsabilidade dos próprios usuários envolvidos.
                </li>
                <li>
                  <strong className="text-white">Segurança:</strong> Recomendamos sempre efetuar trocas ou vendas presenciais em locais públicos e seguros. O UQP não se responsabiliza por prejuízos financeiros, golpes ou perdas de mercadorias.
                </li>
              </ul>
            </div>
          </section>

          {/* Card 3: Regras de Conteúdo e Conduta */}
          <section className="bg-[#121220] border-4 border-black rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#000]">
            <h2 className="text-xl md:text-2xl font-display font-black text-[#0072ce] uppercase mb-4 flex items-center gap-2">
              <Scale className="w-6 h-6 text-[#0072ce]" />
              3. Cadastro e Regras de Conduta
            </h2>
            <div className="text-gray-300 space-y-4 text-sm md:text-base leading-relaxed">
              <p>
                Para criar anúncios ou participar de determinadas interações, você deve criar uma conta válida. Ao fazer isso, você se compromete a:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400">
                <li>Fornecer informações cadastrais corretas e atualizadas.</li>
                <li>
                  Não anunciar jogos piratas, cópias digitais não autorizadas, chaves de ativação fraudulentas ou quaisquer produtos ilegais.
                </li>
                <li>
                  Não utilizar de linguagem ofensiva, tóxica, preconceituosa ou spam nos fóruns, comentários, descrições de anúncios ou perfis.
                </li>
                <li>Preservar a segurança dos seus dados de acesso (senha), que são de uso pessoal e intransferível.</li>
              </ul>
              <p className="text-xs text-gray-500">
                O descumprimento destas regras resultará no banimento ou suspensão permanente da conta pela nossa moderação de administradores.
              </p>
            </div>
          </section>

          {/* Card 4: Propriedade Intelectual */}
          <section className="bg-[#121220] border-4 border-black rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#000]">
            <h2 className="text-xl md:text-2xl font-display font-black text-pink-400 uppercase mb-4 flex items-center gap-2">
              <MessageSquareCode className="w-6 h-6 text-pink-400" />
              4. Propriedade Intelectual e Conteúdo do Site
            </h2>
            <div className="text-gray-300 space-y-4 text-sm md:text-base leading-relaxed">
              <p>
                As análises escritas (reviews), artigos de notícias originais, notas críticas agregadas e a própria interface do portal são propriedades intelectuais dos administradores do <strong>Upa que Passa</strong> ou de seus respectivos licenciadores.
              </p>
              <p>
                A reprodução de resenhas ou reportagens sem prévia autorização e sem atribuir os devidos créditos por meio de links diretos para o site é expressamente proibida.
              </p>
            </div>
          </section>
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 text-center text-xs text-gray-500">
          Dúvidas sobre os nossos termos? Fale com a nossa guilda de fundadores ou envie uma mensagem diretamente para a equipe do UQP.
        </div>
      </div>
    </main>
  );
}
