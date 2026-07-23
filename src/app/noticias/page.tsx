import { readAdminNews } from "@/lib/adminNews";
import NoticiasClient from "./NoticiasClient";

export const revalidate = 60;

export default async function NoticiasPage() {
  const news = await readAdminNews();
  return <NoticiasClient initialNews={news} />;
}
