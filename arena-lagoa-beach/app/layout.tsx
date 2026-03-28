import './globals.css';
import Sidebar from '../components/sidebar/index';
import Navbar from '../components/navbar/navbar';

export const metadata = {
  title: 'Arena Lagoa Beach',
  description: 'Dashboard de análises e classificação dos torneios de vôlei de praia da Lagoa Beach',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <main style={{ flex: 1, padding: '24px' }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}