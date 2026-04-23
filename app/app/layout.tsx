import { Topbar } from "@/components/dashboard/topbar";
import { getCurrentSession } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Topbar initialSession={session} />
      {children}
    </div>
  );
}
