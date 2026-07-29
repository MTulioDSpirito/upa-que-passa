-- DropIndex
DROP INDEX "SugestaoAgente_createdAt_idx";

-- DropIndex
DROP INDEX "SugestaoAgente_status_idx";

-- CreateIndex
CREATE INDEX "SugestaoAgente_status_createdAt_idx" ON "SugestaoAgente"("status", "createdAt");
