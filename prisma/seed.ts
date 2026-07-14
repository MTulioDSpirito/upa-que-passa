import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = "UpaQuePassa@2026";

const ADMINS = [
  { name: "André", email: "andre@upaquepassa.com.br", role: "COLABORADOR" as const, avatar: "/team/andre-abertura.png" },
  { name: "Capelli", email: "capelli@upaquepassa.com.br", role: "DEVELOPER" as const, avatar: "/team/cappeli-abertura.png" },
  { name: "Fael", email: "fael@upaquepassa.com.br", role: "COLABORADOR" as const, avatar: "/team/fae-abertura.png" },
  { name: "Ique", email: "ique@upaquepassa.com.br", role: "COLABORADOR" as const, avatar: "/team/ique-abertura.png" },
  { name: "Mateus", email: "mateus@upaquepassa.com.br", role: "COLABORADOR" as const, avatar: "/team/mateus-abertura.png" },
  { name: "Patrão", email: "patrao@upaquepassa.com.br", role: "COLABORADOR" as const, avatar: "/team/patrao-abertura.png" },
  { name: "inTúlio", email: "tulio@upaquepassa.com.br", role: "DEVELOPER" as const, avatar: "/team/tulio-abertura.png" },
];


async function main() {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  for (const admin of ADMINS) {
    await prisma.adminUser.upsert({
      where: { email: admin.email },
      update: {},
      create: { ...admin, passwordHash },
    });
  }

  console.log(`Seeded ${ADMINS.length} admin users with default password "${DEFAULT_PASSWORD}".`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
