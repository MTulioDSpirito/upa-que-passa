import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import SugestoesClient from "./SugestoesClient";

export default async function SugestoesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <SugestoesClient
      user={{ name: session.name, email: session.email, role: session.role }}
    />
  );
}
