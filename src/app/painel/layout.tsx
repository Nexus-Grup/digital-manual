import Uheader from "@/_components/userPanelComponents/utils_panel/Uheader";
import { USideMenu } from "@/_components/userPanelComponents/managen/USideMenu";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Toaster } from "sonner";
import ReadAloud from "@/_components/productComponents/ReadAloud";
import type { Metadata } from "next";

// every panel page sets only its own name; the template adds the area and the site
export const metadata: Metadata = {
  title: { default: "Painel | Manual digital", template: "%s | Painel | Manual digital" },
  robots: { index: false, follow: false },
};

export const instant = false;
export default async function UserPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const user = await getCurrentUser();
  if (!user) return null;

  const memberships = await prisma.userCompany.findMany({
  where: { userId: user.id, company: { isActive: true } },
  select: { companyRole: true },
    });

  // the user's real notifications (e.g. support replies): the latest 8 in the bell, plus the unread count
  const [rows, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, title: true, message: true, read: true, createdAt: true, data: true },
    }),
    prisma.notification.count({ where: { userId: user.id, read: false } }),
  ]);
  const notifications = rows.map((n) => ({
    ...n,
    createdAt: n.createdAt.toISOString(),
    data: (n.data as { url?: string } | null) ?? null,
  }));

  return (
    <div className="container-global container-global--panel">
      <Uheader
        user={user}
        notifications={notifications}
        unreadCount={unreadCount}
      />
      <div className="container-stage">
        <USideMenu role={user.systemRole} companyRoles={memberships.map((m) => m.companyRole)} />
        {children}
        <Toaster richColors position="top-right" />
      </div>
      {/* select any text to hear it read aloud (same reader as the landing and product pages) */}
      <ReadAloud lang="pt-BR" />
    </div>
  );
}