// src/app/admin/layout.tsx
import { redirect } from "next/navigation";
import AdminSidebar from "../components/admin/AdminSidebar";
// Change this line:
import { createClient } from "@/lib/supabase/server";  // ← correct name
export const metadata = {
  title: "LO Admin Dashboard",
  description: "Manage LO Publications content",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user → redirect to login
  if (!user) {
    redirect("/admin-login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}