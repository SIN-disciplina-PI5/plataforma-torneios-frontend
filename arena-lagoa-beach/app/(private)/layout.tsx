import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar/navbar";
import ProtecaoRota from "@/components/auth/ProtecaoRota";
import { ChatWidget } from "@/components/chatbot/ChatWidget";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtecaoRota>
      <div className="flex min-h-screen w-full overflow-x-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />

          <main className="flex-1 min-w-0 p-0 sm:p-6">{children}</main>

          <ChatWidget />
        </div>
      </div>
    </ProtecaoRota>
  );
}
