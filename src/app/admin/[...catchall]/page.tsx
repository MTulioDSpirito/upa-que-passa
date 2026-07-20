import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminNotFoundClient from "./AdminNotFoundClient";

export default async function AdminCatchAllPage() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminNotFoundClient
      user={{ name: session.name, email: session.email, role: session.role }}
    />
  );
}
