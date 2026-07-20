-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "cover" TEXT NOT NULL,
    "trailer" TEXT,
    "gallery" TEXT[],
    "description" TEXT NOT NULL,
    "synopsis" TEXT NOT NULL,
    "developer" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "engine" TEXT,
    "releaseDate" TEXT NOT NULL,
    "suggestedPrice" DOUBLE PRECISION NOT NULL,
    "platforms" TEXT[],
    "genres" TEXT[],
    "avgPlayTime" TEXT,
    "online" BOOLEAN NOT NULL,
    "offline" BOOLEAN NOT NULL,
    "maxPlayers" INTEGER NOT NULL,
    "languages" TEXT[],
    "subtitles" TEXT[],
    "dubbing" TEXT[],
    "ageRating" TEXT NOT NULL,
    "links" JSONB NOT NULL,
    "metacriticScore" INTEGER,
    "openCriticScore" INTEGER,
    "userScore" DOUBLE PRECISION NOT NULL,
    "adminScore" DOUBLE PRECISION,
    "siteScores" JSONB NOT NULL,
    "worldAvg" DOUBLE PRECISION,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsArticle" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "cover" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "publishedAt" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "imageCredits" TEXT,
    "fontes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "pros" TEXT[],
    "cons" TEXT[],
    "conclusion" TEXT NOT NULL,
    "scores" JSONB NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "author" TEXT NOT NULL,
    "publishedAt" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "imageCredits" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_slug_key" ON "Game"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "NewsArticle_slug_key" ON "NewsArticle"("slug");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
