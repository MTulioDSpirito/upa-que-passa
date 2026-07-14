"use client";

import { useState } from "react";
import { Sparkles, Trophy, Zap, Heart, Sword, Shield, Flame, Smile, Gamepad2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import team from "@/mocks/team";

// Atributos customizados no estilo RPG / Scott Pilgrim para cada integrante
interface TeamMemberExtra {
  quote: string;
  favGame: string;
  specialSkill: string;
  weakness: string;
  themeColor: string; // Tailwind bg color class
  accentColor: string; // Tailwind border/text class
  stats: {
    label: string;
    value: number;
    icon: any;
  }[];
}

const teamExtras: Record<string, TeamMemberExtra> = {
  "André": {
    quote: "Se a nota é boa, eu jogo. Se é ruim, eu discuto no grupo por 4 horas seguidas!",
    favGame: "Astro Bot",
    specialSkill: "Liderança Suprema de Grupo de WhatsApp",
    weakness: "Jogos indie sem nota no Metacritic",
    themeColor: "bg-yellow-400 text-black",
    accentColor: "border-yellow-400 text-yellow-400",
    stats: [
      { label: "Liderança", value: 99, icon: Trophy },
      { label: "Café / Cafeína", value: 85, icon: Flame },
      { label: "Linearidade", value: 60, icon: Shield },
      { label: "Hipster-ômetro", value: 40, icon: Zap },
    ]
  },
  "Capelli": {
    quote: "Só jogo se tiver trilhos. Mundos abertos me dão ansiedade e vontade de formatar o PC.",
    favGame: "Alan Wake 2",
    specialSkill: "Foco Absoluto (Ignora 100% de missões secundárias)",
    weakness: "Mapas gigantes da Ubisoft",
    themeColor: "bg-purple-600 text-white",
    accentColor: "border-purple-500 text-purple-400",
    stats: [
      { label: "Dev Skill", value: 95, icon: Sword },
      { label: "Linearidade", value: 100, icon: Shield },
      { label: "Foco", value: 80, icon: Trophy },
      { label: "Paciência", value: 90, icon: Smile },
    ]
  },
  "Fael": {
    quote: "Nostalgia é o meu superpoder. No meu tempo tudo isso aqui era mato e pixel.",
    favGame: "Jaleco Arcade Collection Vol. 1 & 2",
    specialSkill: "Invocar Memória Afetiva Gamer (+50% de Hype)",
    weakness: "Controles com mais de 4 botões",
    themeColor: "bg-red-500 text-white",
    accentColor: "border-red-500 text-red-400",
    stats: [
      { label: "Carisma", value: 95, icon: Smile },
      { label: "Nostalgia", value: 99, icon: Heart },
      { label: "Casual", value: 80, icon: Shield },
      { label: "Hype", value: 85, icon: Zap },
    ]
  },
  "Ique": {
    quote: "No meu tempo, os gráficos eram 4 pixels e a gente gostava e jogava rindo!",
    favGame: "Nioh 3",
    specialSkill: "Análise Crítica Paternal (+50% Resistência a Bugs)",
    weakness: "Noites em claro jogando",
    themeColor: "bg-green-500 text-white",
    accentColor: "border-green-500 text-green-400",
    stats: [
      { label: "Sabedoria", value: 99, icon: Shield },
      { label: "Coleção", value: 95, icon: Trophy },
      { label: "Paciência", value: 90, icon: Smile },
      { label: "Stamina", value: 70, icon: Flame },
    ]
  },
  "Mateus": {
    quote: "Se vendeu mais de 10 mil cópias ou tá no topo da PS Store, já ficou muito comercial.",
    favGame: "Split Fiction",
    specialSkill: "Garimpar Joias Ocultas na Steam/PS Store",
    weakness: "Jogos AAA de R$ 350,00",
    themeColor: "bg-cyan-500 text-black",
    accentColor: "border-cyan-400 text-cyan-400",
    stats: [
      { label: "Indie-radar", value: 99, icon: Zap },
      { label: "Pixel Art", value: 95, icon: Heart },
      { label: "Julgamento", value: 85, icon: Sword },
      { label: "Comercial-fobia", value: 90, icon: Flame },
    ]
  },
  "Patrão": {
    quote: "O jogo é bonito? Sim. Mas cadê a taxa de quadros estável a 60 FPS travado?!",
    favGame: "Death Stranding 2",
    specialSkill: "Visão de Lince (Detecta queda de 1 FPS a olho nu)",
    weakness: "Modo Qualidade a 30 FPS",
    themeColor: "bg-amber-500 text-black",
    accentColor: "border-amber-400 text-amber-400",
    stats: [
      { label: "Crítica", value: 98, icon: Sword },
      { label: "Exigência", value: 95, icon: Trophy },
      { label: "Frame testing", value: 99, icon: Zap },
      { label: "Hype", value: 30, icon: Flame },
    ]
  },
  "inTúlio": {
    quote: "Compilou sem erro? Ótimo, agora deixa eu dar uns headshots de sniper para comemorar.",
    favGame: "Call of Duty: Warzone",
    specialSkill: "Código Limpo & Mira Imbatível com fone estourado",
    weakness: "Gente que anda devagar em jogo linear",
    themeColor: "bg-pink-500 text-white",
    accentColor: "border-pink-500 text-pink-400",
    stats: [
      { label: "Reflexo", value: 95, icon: Zap },
      { label: "Dev Skill", value: 90, icon: Sword },
      { label: "Precisão", value: 99, icon: Trophy },
      { label: "Raciocínio", value: 85, icon: Shield },
    ]
  }
};

export default function SobrePage() {
  const [selectedName, setSelectedName] = useState<string>("André");
  const activeMember = team.find((m) => m.name === selectedName) || team[0];
  const activeExtra = teamExtras[activeMember.name] || teamExtras["André"];

  return (
    <main className="min-h-screen bg-[#07070a] text-white py-12 px-4 md:px-8 relative overflow-hidden hero-glow-bg">
      {/* Elementos visuais retro de fundo */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Botão de Voltar */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para a Home</span>
        </Link>

        {/* ================= SEÇÃO SUPERIOR: HISTÓRIA E ORIGEM ================= */}
        <section className="relative mb-20 bg-gradient-to-br from-[#121220] to-[#0c0c14] border-4 border-black rounded-3xl p-6 md:p-10 shadow-[8px_8px_0px_0px_#000] hover:shadow-[12px_12px_0px_0px_rgba(168,85,247,0.3)] transition-all duration-300">
          {/* Badge estilo Scott Pilgrim */}
          <div className="absolute -top-6 left-6 md:left-10 transform -rotate-3 select-none">
            <div className="absolute inset-0 bg-yellow-400 rounded-xl translate-x-1.5 translate-y-1.5 border-4 border-black" />
            <div className="relative flex items-center gap-2 text-sm font-black uppercase tracking-wider text-black bg-white border-4 border-black px-5 py-2.5 rounded-xl">
              <Sparkles className="w-5 h-5 text-purple-600 fill-purple-600" />
              <span>A Origem do UQP</span>
            </div>
          </div>

          <div className="mt-6 md:mt-4 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-none uppercase mt-2">
                De um grupo de <span className="text-yellow-400 bg-black px-2 py-0.5 inline-block transform -rotate-1">WhatsApp</span> para o Brasil!
              </h1>
              
              <div className="space-y-4 text-gray-300 text-base md:text-lg leading-relaxed font-sans">
                <p>
                  Tudo começou como a maioria das grandes rivalidades e amizades gamers: com discussões diárias inflamadas sobre quem tinha o melhor gosto, críticas ácidas sobre lançamentos e disputas infinitas de troféus em um modesto grupo de WhatsApp.
                </p>
                <p className="border-l-4 border-purple-500 pl-4 py-1 italic bg-white/5 rounded-r-lg">
                  "Se o jogo é bom, a gente compartilha. Se o jogo é ruim, a gente faz piada e zera assim mesmo."
                </p>
                <p>
                  Somos jogadores acima dos 40, com poucos poderes e muitas responsabilidades, tentando descobrir se vale ou não vale a pena jogar cada game.
                </p>
                <p>
                  Se você também já tá mais pra “cansado lendário” do que pra “jogador pró”, esse é o seu lugar.
                </p>
                <p>
                  Cansados da impessoalidade e do excesso de formalismo na mídia especializada tradicional, nós, 7 amigos de longa data, decidimos criar o <strong>Upa que Passa (UQP)</strong>. Um espaço feito por gamers reais, com opiniões cruas, honestidade implacável e o autêntico espírito de cooperação (e zoeira) de sofá de videogame.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex justify-center">
              {/* Moldura de quadrinho estilizada com estatísticas gerais do site */}
              <div className="w-full max-w-sm bg-yellow-400 border-4 border-black rounded-2xl p-6 text-black shadow-[6px_6px_0px_0px_#000] rotate-2 hover:rotate-0 transition-transform duration-300">
                <h3 className="font-display font-black text-xl mb-4 border-b-2 border-black pb-2 flex items-center justify-between">
                  <span>ATRIBUTOS DO PORTAL</span>
                  <Gamepad2 className="w-6 h-6 animate-bounce" />
                </h3>
                <ul className="space-y-3 font-bold text-sm">
                  <li className="flex justify-between items-center bg-white border-2 border-black p-2 rounded-lg">
                    <span>HONESTIDADE:</span>
                    <span className="bg-purple-600 text-white px-2 py-0.5 rounded border border-black">LEVEL MAX</span>
                  </li>
                  <li className="flex justify-between items-center bg-white border-2 border-black p-2 rounded-lg">
                    <span>MEMES NO GRUPO:</span>
                    <span className="bg-red-500 text-white px-2 py-0.5 rounded border border-black">9999+</span>
                  </li>
                  <li className="flex justify-between items-center bg-white border-2 border-black p-2 rounded-lg">
                    <span>DISCUSSÕES INÚTEIS:</span>
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded border border-black">INFINITO</span>
                  </li>
                  <li className="flex justify-between items-center bg-white border-2 border-black p-2 rounded-lg">
                    <span>XP TOTAL ACUMULADO:</span>
                    <span className="bg-green-600 text-white px-2 py-0.5 rounded border border-black">LEVEL 99</span>
                  </li>
                </ul>
                <div className="mt-4 text-center text-xs font-black uppercase tracking-wider bg-black text-white p-2 rounded-lg">
                  "UQP! Jogue. Discuta. Sobreviva."
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SEÇÃO INFERIOR: TIME SCOTT PILGRIM ================= */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-black tracking-wider uppercase mb-2">
              SELECIONE SEU LUTADOR!
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
              Clique em um integrante do UQP na barra lateral para abrir sua ficha técnica oficial de combate e atributos.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-start">
            
            {/* Coluna Esquerda: Lista de Integrantes */}
            <div className="md:col-span-4 lg:col-span-3 flex flex-row md:flex-col gap-3 overflow-x-auto pb-4 md:pb-0 scrollbar-thin">
              {team.map((member) => {
                const active = member.name === selectedName;
                const extra = teamExtras[member.name] || teamExtras["André"];
                
                return (
                  <button
                    key={member.name}
                    onClick={() => setSelectedName(member.name)}
                    className={`btn-press w-full min-w-[200px] md:min-w-0 flex items-center gap-3 p-3 rounded-xl border-4 text-left font-black transition-all cursor-pointer relative overflow-hidden group/btn ${
                      active
                        ? "bg-white text-black border-black shadow-[4px_4px_0px_0px_#7c3aed]"
                        : "bg-[#121220]/80 border-black/40 text-white hover:bg-[#1b1b30] hover:border-white/50"
                    }`}
                  >
                    {/* Linha decorativa de quadrinhos na borda esquerda */}
                    {active && (
                      <div className="absolute top-0 left-0 w-2 h-full bg-purple-600" />
                    )}

                    <div className="relative w-12 h-12 rounded-lg border-2 border-black overflow-hidden bg-purple-950/20 flex-shrink-0">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover/btn:scale-110 transition-transform duration-200"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-display uppercase text-sm md:text-base tracking-tight truncate">
                        {member.name}
                      </div>
                      <div className={`text-[10px] uppercase font-bold truncate ${active ? "text-purple-600" : "text-gray-400"}`}>
                        {member.role}
                      </div>
                    </div>

                    {/* Badge "VS" retrô no selecionado */}
                    {active && (
                      <span className="text-[10px] font-black bg-purple-600 text-white px-1.5 py-0.5 rounded border border-black transform rotate-12 absolute right-2">
                        OK!
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Coluna Direita: Ficha do Personagem (Estilo Scott Pilgrim) */}
            <div className="md:col-span-8 lg:col-span-9">
              <div className="bg-[#121220] border-4 border-black rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_#000] relative overflow-hidden transition-all duration-300 animate-slide-up">
                
                {/* Estrelinhas retro amarelas no topo do card */}
                <div className="absolute top-4 right-4 flex gap-1 text-yellow-400">
                  <Sparkles className="w-5 h-5 fill-current animate-pulse" />
                  <Sparkles className="w-3 h-3 fill-current" />
                </div>

                {/* Grid interno do card */}
                <div className="grid md:grid-cols-12 gap-8 items-center">
                  
                  {/* Avatar do integrante em tamanho maior */}
                  <div className="md:col-span-5 flex flex-col items-center">
                    <div className="relative w-48 h-48 md:w-56 md:h-56 transform -rotate-1 hover:rotate-1 transition-transform duration-300">
                      {/* Sombra sólida Scott Pilgrim */}
                      <div className="absolute inset-0 bg-black rounded-2xl translate-x-2 translate-y-2 border-4 border-black" />
                      <div className={`relative w-full h-full rounded-2xl border-4 border-black overflow-hidden p-2 ${activeExtra.themeColor}`}>
                        <img
                          src={activeMember.avatar}
                          alt={activeMember.name}
                          className="w-full h-full object-cover rounded-xl bg-black/10 border-2 border-black"
                        />
                      </div>
                    </div>

                    {/* Alcunha em forma de Badge abaixo do avatar */}
                    <div className="mt-6 text-center">
                      <div className="font-display text-2xl font-black uppercase text-yellow-400 tracking-wider bg-black border-2 border-black px-4 py-1.5 rounded-lg inline-block transform -rotate-1 select-none">
                        {activeMember.name}
                      </div>
                      <div className="text-gray-400 text-xs font-black uppercase tracking-widest mt-2">
                        {activeMember.role}
                      </div>
                    </div>
                  </div>

                  {/* Informações detalhadas e atributos */}
                  <div className="md:col-span-7 space-y-6">
                    {/* Citação em Balão de Fala do quadrinho */}
                    <div className="relative bg-white text-black p-4 rounded-2xl border-4 border-black font-bold text-sm md:text-base shadow-[4px_4px_0px_0px_#000]">
                      <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-r-[12px] border-r-black border-b-[8px] border-b-transparent hidden md:block" />
                      <p className="italic">
                        "{activeExtra.quote}"
                      </p>
                    </div>

                    {/* Stats deRPG / Luta */}
                    <div className="space-y-3 bg-black/30 border-2 border-black p-4 rounded-2xl">
                      <h4 className="font-display text-xs text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-2">
                        <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        Atributos de Combate
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeExtra.stats.map((stat, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className="flex items-center gap-1 text-gray-300">
                                <stat.icon className="w-3.5 h-3.5 text-purple-400" />
                                {stat.label}
                              </span>
                              <span className="text-yellow-400 font-black">{stat.value}%</span>
                            </div>
                            <div className="w-full h-3 bg-gray-800 border-2 border-black rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 border-r border-white"
                                style={{ width: `${stat.value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fatos Extras (Jogo fav, arma, fraqueza) */}
                    <div className="grid sm:grid-cols-2 gap-3 text-xs font-bold">
                      <div className="bg-[#1b1b30] border-2 border-black p-3 rounded-xl">
                        <span className="text-purple-400 block uppercase mb-1">🎮 JOGO FAVORITO:</span>
                        <span className="text-white text-sm font-black">{activeExtra.favGame}</span>
                      </div>
                      <div className="bg-[#1b1b30] border-2 border-black p-3 rounded-xl">
                        <span className="text-purple-400 block uppercase mb-1">⚔️ HABILIDADE ESPECIAL:</span>
                        <span className="text-white text-sm font-black">{activeExtra.specialSkill}</span>
                      </div>
                      <div className="bg-[#1b1b30] border-2 border-black p-3 rounded-xl sm:col-span-2">
                        <span className="text-red-400 block uppercase mb-1">💀 FRAQUEZA / CRIPTONITA:</span>
                        <span className="text-white text-sm font-black">{activeExtra.weakness}</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}
