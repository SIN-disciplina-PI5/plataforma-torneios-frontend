import ProtecaoRotaAdmin from "@/components/auth/ProtecaoRotaAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtecaoRotaAdmin>
      {children}
    </ProtecaoRotaAdmin>
  );
}
