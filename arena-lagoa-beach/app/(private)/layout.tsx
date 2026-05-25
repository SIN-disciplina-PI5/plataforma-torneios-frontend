import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar/navbar";
import { Toaster } from "@/components/ui/sonner";
import ProtecaoRota from "@/components/auth/ProtecaoRota";
import { ChatWidget } from "@/components/chatbot/ChatWidget";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtecaoRota>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Navbar />

          <main className="flex-1 p-6">
            {children}
            <Toaster position="bottom-right" richColors />
          </main>

          <ChatWidget />
        </div>
      </div>
    </ProtecaoRota>
  );
}