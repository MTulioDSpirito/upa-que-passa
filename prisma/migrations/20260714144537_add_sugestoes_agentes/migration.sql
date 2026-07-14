-- CreateEnum
CREATE TYPE "AgenteCriador" AS ENUM ('KAI_REPORTER', 'NINA_CORRESPONDENTE', 'MILO_LANCAMENTOS', 'THEO_REVIEWS', 'VERA_NOTAS');

-- CreateEnum
CREATE TYPE "TipoSugestao" AS ENUM ('NOTICIA', 'REVIEW', 'LANCAMENTO');

-- CreateEnum
CREATE TYPE "StatusSugestao" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "SugestaoAgente" (
    "id" TEXT NOT NULL,
    "tipo" "TipoSugestao" NOT NULL,
    "criador" "AgenteCriador" NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "fontes" TEXT[],
    "status" "StatusSugestao" NOT NULL DEFAULT 'PENDING',
    "motivoRejeicao" TEXT,
    "revisadoPorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SugestaoAgente_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SugestaoAgente" ADD CONSTRAINT "SugestaoAgente_revisadoPorId_fkey" FOREIGN KEY ("revisadoPorId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
