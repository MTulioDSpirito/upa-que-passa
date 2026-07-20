import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminPanelLayout from "./AdminPanelLayout";

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminPanelLayout
      user={{ name: session.name, email: session.email, role: session.role }}
    />
  );
}
