import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PerfilClient from "./PerfilClient";

export default async function PerfilPage() {
  const session = await getUserSession();
  if (!session) {
    redirect("/login");
  }

  const [user, favorites] = await Promise.all([
    prisma.siteUser.findUnique({ where: { id: session.sub } }),
    prisma.favorite.findMany({ where: { userId: session.sub } }),
  ]);

  if (!user) {
    redirect("/login");
  }

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
      favoriteGameIds={favorites.map((f) => f.gameId)}
    />
  );
}
