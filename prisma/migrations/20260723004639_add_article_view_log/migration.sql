-- CreateTable
CREATE TABLE "ArticleViewLog" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleViewLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArticleViewLog_articleId_ipHash_key" ON "ArticleViewLog"("articleId", "ipHash");
