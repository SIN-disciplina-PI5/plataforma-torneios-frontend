import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar/navbar";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ flex: 1, padding: "24px" }}>{children}</main>
      </div>
    </div>
  );
}
