import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { LISTINGS } from "@/mocks/listings";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    // 1. Site Users total & growth
    const totalUsers = await prisma.siteUser.count();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers30d = await prisma.siteUser.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });
    const previousUsers = totalUsers - newUsers30d;
    const usersChange = previousUsers > 0 ? parseFloat(((newUsers30d / previousUsers) * 100).toFixed(1)) : 0;

    // 2. Reviews Count & dummy growth
    const totalReviews = await prisma.review.count();
    // Simulate growth rate for reviews
    const reviewsChange = 12.5;

    // 3. News Articles, views & simulated change
    const [totalNews, newsViewsAgg] = await Promise.all([
      prisma.newsArticle.count(),
      prisma.newsArticle.aggregate({ _sum: { views: true } }),
    ]);
    const totalViews = newsViewsAgg._sum.views || 0;
    const viewsChange = 5.6;

    // 4. Comments total & today
    const totalComments = await prisma.comment.count();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const commentsToday = await prisma.comment.count({
      where: {
        createdAt: {
          gte: startOfToday,
        },
      },
    });
    const commentsChange = totalComments > 0 ? parseFloat(((commentsToday / totalComments) * 100).toFixed(1)) : 0;

    // 5. Active listings count
    const activeListingsCount = LISTINGS.filter((l) => l.active).length;

    // 6. Admin team members
    const teamCount = await prisma.adminUser.count({
      where: { active: true },
    });

    // 7. Pending suggestions count
    const pendingSugestoesCount = await prisma.sugestaoAgente.count({
      where: { status: "PENDING" },
    });

    return NextResponse.json({
      stats: {
        users: { value: totalUsers, change: usersChange },
        reviews: { value: totalReviews, change: reviewsChange },
        news: { value: totalNews, totalViews, change: viewsChange },
        comments: { value: totalComments, today: commentsToday, change: commentsChange },
        listings: { value: activeListingsCount, change: 18.7 },
        team: { value: teamCount },
        pendingSuggestions: { value: pendingSugestoesCount },
      },
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas do dashboard:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
