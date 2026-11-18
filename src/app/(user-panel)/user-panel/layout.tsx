import Uheader from "@/_components/userPanelComponents/Uheader";
import { USideMenu } from "@/_components/userPanelComponents/USideMenu";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
export const instant = false;
export default async function UserPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const notifications = [
  { id: 1, title: "Bem-vindo", message: "Sua conta foi criada.", read: false, createdAt: "2026-11-17T10:00:00.000Z", data: null },
  { id: 2, title: "Marca atualizada", message: "Brand X foi editada.", read: true, createdAt: "2026-11-17T10:00:00.000Z", data: null },
  { id: 3, title: "Marca atualizada", message: "Brand X foi editada.", read: true, createdAt: "2026-11-17T10:00:00.000Z", data: null },
  { id: 4, title: "Marca atualizada", message: "Brand X foi editada.", read: true, createdAt: "2026-11-17T10:00:00.000Z", data: null },
  { id: 5, title: "Marca atualizada", message: "Brand X foi editada.", read: true, createdAt: "2026-11-17T10:00:00.000Z", data: null },
  ];
  
  const unreadCount = notifications.length;

  return (
    <main className="container-global">
      <Uheader
        user={user}
        notifications={notifications}
        unreadCount={unreadCount}
      />
      <div className="container-stage">
        <USideMenu role={user.systemRole} />
        {children}
        <Toaster richColors position="top-right" />
      </div>
    </main>
  );
}