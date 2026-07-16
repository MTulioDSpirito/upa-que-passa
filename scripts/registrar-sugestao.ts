import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const jsonArgIndex = args.indexOf("--json");
  
  if (jsonArgIndex === -1) {
    console.error("Erro: Use --json '<JSON_STRING>' contendo os dados da sugestão.");
    process.exit(1);
  }

  const jsonStr = args[jsonArgIndex + 1];
  if (!jsonStr) {
    console.error("Erro: Payload JSON vazio após a flag --json.");
    process.exit(1);
  }

  try {
    const data = JSON.parse(jsonStr);

    if (!data.tipo || !data.criador || !data.titulo || !data.slug || !data.payload) {
      console.error("Erro: O JSON enviado precisa ter: tipo, criador, titulo, slug, payload.");
      process.exit(1);
    }

    const sugestao = await prisma.sugestaoAgente.create({
      data: {
        tipo: data.tipo,
        criador: data.criador,
        titulo: data.titulo,
        slug: data.slug,
        payload: data.payload,
        fontes: data.fontes || [],
        status: "PENDING",
      },
    });

    console.log(`SUCESSO: Rascunho inserido com ID: ${sugestao.id}`);
  } catch (error: any) {
    console.error("Erro ao analisar JSON ou inserir no banco de dados:", error.message);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
