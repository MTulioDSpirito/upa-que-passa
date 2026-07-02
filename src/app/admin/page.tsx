import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminDashboardClient
      user={{ name: session.name, email: session.email, role: session.role }}
    />
  );
}
