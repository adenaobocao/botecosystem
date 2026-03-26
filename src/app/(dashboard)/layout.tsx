// import { auth } from "@/lib/auth"; // TODO: reativar
// import { redirect } from "next/navigation"; // TODO: reativar
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: reativar auth da dashboard
  // const session = await auth();
  // if (!session?.user) {
  //   redirect("/login");
  // }
  // if (!["ADMIN", "MANAGER"].includes(session.user.role)) {
  //   redirect("/");
  // }

  return (
    <div className="flex min-h-dvh bg-background">
      <DashboardSidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
