import { prisma } from "../src/lib/prisma";

async function main() {
  const games = await prisma.game.findMany({
    include: { reviews: true }
  });
  console.log("Total games found:", games.length);
  for (const game of games) {
    const latestReview = game.reviews[0];
    const actualAdminScore = latestReview ? latestReview.overallScore : null;
    console.log(`Game: "${game.title}" | adminScore: ${game.adminScore} | actual expected: ${actualAdminScore}`);
    
    if (game.adminScore !== actualAdminScore) {
      console.log(`-> Updating game "${game.title}" score from ${game.adminScore} to ${actualAdminScore}`);
      await prisma.game.update({
        where: { id: game.id },
        data: { adminScore: actualAdminScore }
      });
    }
  }
  console.log("Done syncing scores!");
}

main().catch(console.error);
