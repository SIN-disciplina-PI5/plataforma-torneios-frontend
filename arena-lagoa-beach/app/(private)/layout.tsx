import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar/navbar";
import { Toaster } from "@/components/ui/sonner";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">
          {children}
          <Toaster position="bottom-right" richColors />
        </main>
      </div>
    </div>
  );
}