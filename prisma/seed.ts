import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = "UpaQuePassa@2026";

const ADMINS = [
  { name: "Vic", email: "vic@upaquepassa.com.br", role: "EDITOR_CHEFE" as const },
  { name: "Kai", email: "kai@upaquepassa.com.br", role: "REPORTER" as const },
  { name: "Vera", email: "vera@upaquepassa.com.br", role: "CURADOR_NOTAS" as const },
  { name: "Theo", email: "theo@upaquepassa.com.br", role: "REDATOR_REVIEWS" as const },
  { name: "Dara", email: "dara@upaquepassa.com.br", role: "QA_DADOS" as const },
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
