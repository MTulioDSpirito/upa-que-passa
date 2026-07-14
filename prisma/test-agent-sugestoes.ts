import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testInsert() {
  console.log("Simulando envio de rascunhos pelos agentes no banco de dados...");

  // 1. Simula Kai (Notícia)
  const noticiaKai = await prisma.sugestaoAgente.create({
    data: {
      tipo: "NOTICIA",
      criador: "KAI_REPORTER",
      titulo: "Novo update de firmware do PS5 traz melhorias de estabilidade e novos recursos",
      slug: "novo-update-firmware-ps5-2026",
      fontes: [
        "https://blog.playstation.com/2026/07/update",
        "https://www.pushsquare.com/news/firmware-update"
      ],
      payload: {
        excerpt: "A Sony lançou hoje um patch surpresa que aprimora significativamente a performance da interface do usuário.",
        body: "Um novo update de firmware do PS5 já está disponível para download mundialmente. A atualização traz recursos solicitados pela comunidade, incluindo melhorias de performance em drives SSD externos."
      }
    }
  });

  // 2. Simula Theo (Review)
  const reviewTheo = await prisma.sugestaoAgente.create({
    data: {
      tipo: "REVIEW",
      criador: "THEO_REVIEWS",
      titulo: "Ghost of Yotei - A evolução artística e técnica da Sucker Punch",
      slug: "ghost-of-yotei-review",
      fontes: [
        "https://www.ign.com/articles/ghost-of-yotei-review"
      ],
      payload: {
        excerpt: "Análise completa da sequência espiritual do aclamado Ghost of Tsushima.",
        body: "Ghost of Yotei consegue manter a essência do combate elegante do primeiro jogo enquanto expande de forma grandiosa o visual artístico do Japão feudal sob novas tecnologias e mecânicas refinadas.",
        pros: ["Combate fluido e aprimorado", "Direção de arte estonteante", "Excelente performance no PS5 Pro"],
        cons: ["Algumas missões secundárias repetitivas"],
        overallScore: 9.5
      }
    }
  });

  console.log("Inserido rascunhos de teste com sucesso!");
  console.log(`- Notícia ID: ${noticiaKai.id}`);
  console.log(`- Review ID: ${reviewTheo.id}`);
}

testInsert()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
