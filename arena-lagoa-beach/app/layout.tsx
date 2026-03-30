import "./globals.css";

export const metadata = {
  title: "Arena Lagoa Beach",
  description: "Dashboard...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
