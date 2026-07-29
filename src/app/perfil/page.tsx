import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PerfilClient from "./PerfilClient";

export default async function PerfilPage() {
  const session = await getUserSession();
  if (!session) {
    redirect("/login");
  }

  const [user, favorites, commentsCount] = await Promise.all([
    prisma.siteUser.findUnique({ where: { id: session.sub } }),
    prisma.favorite.findMany({ where: { userId: session.sub } }),
    prisma.comment.count({ where: { userId: session.sub } }),
  ]);

  if (!user) {
    redirect("/login");
  }

  const favoriteGames = await prisma.game.findMany({
    where: { id: { in: favorites.map((f) => f.gameId) } },
    select: { id: true, slug: true, title: true, cover: true, developer: true, adminScore: true },
  });

  return (
    <PerfilClient
      user={{
        nickname: user.nickname,
        avatar: user.avatar,
        city: user.city,
        state: user.state,
        bio: user.bio,
        console: user.console,
        createdAt: user.createdAt.toISOString(),
      }}
      favoriteGames={favoriteGames.map((g) => ({ ...g, adminScore: g.adminScore ?? undefined }))}
      commentsCount={commentsCount}
    />
  );
}
