import { Geist, Inter, Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { ClientProvider } from "@/components/ui/ClientProvider";
import "./globals.css";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-poppins' });

export const metadata = {
  title: "Arena Lagoa Beach",
  description: "Dashboard...",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={cn(geist.variable, inter.variable, poppins.variable)}>
      <body className="font-sans">
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}