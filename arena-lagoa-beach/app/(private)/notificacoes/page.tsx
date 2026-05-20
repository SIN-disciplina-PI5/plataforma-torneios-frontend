import { ListaNotificacoes } from "@/lib/ListaNotificacoes";

export default function NotificationsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Suas notificações</h1>
      <ListaNotificacoes />
    </div>
  );
}