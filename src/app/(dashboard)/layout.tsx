import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/requireAuth";
import Navbar from "@/components/layout/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();
  if (!session) redirect("/login");

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl p-4">{children}</main>
    </>
  );
}
