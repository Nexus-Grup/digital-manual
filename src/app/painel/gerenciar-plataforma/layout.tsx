import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ManagePlatformSidebar } from "@/_components/userPanelComponents/managen/ManagePlatformSidebar";
export const instant = false;

const BASE = "/painel";

export default async function ManagePlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    
  const user = (await getCurrentUser())!;

  // Logado, mas não admin -> volta para o painel do usuário
  if (user.systemRole !== "ADMIN") {
    redirect(BASE);
  }

  return (
    <main className="container-global-page">
      <div className="container-stage">
        <ManagePlatformSidebar />  
        {children}
      </div>
    </main>
  );
}