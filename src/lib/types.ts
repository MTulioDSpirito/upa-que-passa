export interface Game {
  id: string;
  slug: string;
  title: string;
  cover: string;
  trailer?: string;
  gallery: string[];
  description: string;
  synopsis: string;
  developer: string;
  publisher: string;
  engine?: string;
  releaseDate: string;
  suggestedPrice: number;
  platforms: string[];
  genres: string[];
  avgPlayTime?: string;
  online: boolean;
  offline: boolean;
  maxPlayers: number;
  languages: string[];
  subtitles: string[];
  dubbing: string[];
  ageRating: string;
  links: { label: string; url: string }[];
  metacriticScore?: number;
  openCriticScore?: number;
  userScore: number;
  adminScore?: number;
  siteScores: SiteScore[];
  worldAvg?: number;
  featured?: boolean;
  tags?: string[];
}

export interface SiteScore {
  site: string;
  score: number;
  url?: string;
}

export interface Review {
  id: string;
  gameId: string;
  title: string;
  text: string;
  pros: string[];
  cons: string[];
  conclusion: string;
  scores: ReviewScores;
  overallScore: number;
  author: string;
  publishedAt: string;
  likes: number;
}

export interface ReviewScores {
  graphics: number;
  gameplay: number;
  fun: number;
  story: number;
  soundtrack: number;
  performance: number;
  replay: number;
  multiplayer: number;
  difficulty: number;
  visual: number;
  ai: number;
  optimization: number;
  content: number;
}

export interface User {
  id: string;
  nickname: string;
  avatar: string;
  banner?: string;
  bio?: string;
  favoriteGames: string[];
  console: string;
  city?: string;
  state?: string;
  socialLinks: { platform: string; url: string }[];
  reviewsCount: number;
  commentsCount: number;
  tradesCount: number;
  reputation: number;
  level: number;
  achievements: Achievement[];
  joinedAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userNickname: string;
  userAvatar: string;
  text: string;
  likes: number;
  dislikes: number;
  createdAt: string;
  replies?: Comment[];
  pinned?: boolean;
  hasSpoiler?: boolean;
}

export interface Listing {
  id: string;
  userId: string;
  userNickname: string;
  userAvatar: string;
  userReputation: number;
  photos: string[];
  title: string;
  description: string;
  price: number;
  condition: "lacrado" | "como novo" | "bom estado" | "regular";
  media: "fisica" | "digital";
  city: string;
  state: string;
  cep?: string;
  shipping: boolean;
  pickup: boolean;
  acceptsTrade: boolean;
  paymentMethods: string[];
  category: string;
  gameId?: string;
  createdAt: string;
  views: number;
  favorites: number;
  active: boolean;
  wantedGames?: string[];
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  author: string;
  publishedAt: string;
  category: string;
  tags: string[];
  views: number;
  likes: number;
}
