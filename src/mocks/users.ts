import { User } from "@/lib/types";

export const USERS: User[] = [
  {
    id: "1",
    nickname: "KratosFan_BR",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=KratosFan",
    bio: "Gamer de carteirinha. Platinador compulsivo.",
    favoriteGames: ["1", "2", "4"],
    console: "PS5",
    city: "São Paulo",
    state: "SP",
    socialLinks: [
      { platform: "twitch", url: "#" },
      { platform: "youtube", url: "#" },
    ],
    reviewsCount: 47,
    commentsCount: 284,
    tradesCount: 23,
    reputation: 98,
    level: 42,
    achievements: [
      { id: "1", name: "Platinador", description: "Conquistou 10 platinas", icon: "🏆" },
      { id: "2", name: "Crítico", description: "Escreveu 50 reviews", icon: "✍️" },
      { id: "3", name: "Negociante", description: "Realizou 20 trocas", icon: "🤝" },
    ],
    joinedAt: "2021-03-15",
  },
  {
    id: "2",
    nickname: "SpiderMilena",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SpiderMilena",
    bio: "Fã da Marvel e de JRPGs. Sempre procurando o próximo platinão.",
    favoriteGames: ["2", "3"],
    console: "PS5",
    city: "Rio de Janeiro",
    state: "RJ",
    socialLinks: [],
    reviewsCount: 12,
    commentsCount: 89,
    tradesCount: 7,
    reputation: 94,
    level: 18,
    achievements: [
      { id: "1", name: "Iniciante", description: "Fez seu primeiro review", icon: "⭐" },
    ],
    joinedAt: "2023-06-20",
  },
];
