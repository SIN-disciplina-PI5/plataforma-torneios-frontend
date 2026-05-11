import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, Trash2, Pencil, Users } from "lucide-react";

import type { AdminDialogState, Tournament } from "../../app/(private)/admin/torneios/_types";

interface AdminTournamentDialogsProps {
  state: AdminDialogState;
  tournament: Tournament | null;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export function AdminTournamentDialogs({
  state,
  tournament,
  onClose,
  onConfirmDelete,
}: AdminTournamentDialogsProps) {
  const isOpen = state !== "idle";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl">

        {/* ── CONFIRM DELETE ──────────────────────────────────────── */}
        {state === "confirmDelete" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 size={18} className="text-red-600" />
                </div>
                <DialogTitle className="text-lg font-bold text-gray-900">
                  Deletar torneio
                </DialogTitle>
              </div>
              <DialogDescription className="text-sm text-gray-500 mt-2">
                Tem certeza que deseja deletar este torneio? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 my-2">
              <p className="font-semibold text-gray-900 text-sm">{tournament?.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Nível: {tournament?.level} · {tournament?.spots} vagas
              </p>
            </div>

            <DialogFooter className="flex gap-2 mt-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button
                onClick={onConfirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Deletar
              </Button>
            </DialogFooter>
          </>
        )}

        {/* ── LOADING DELETE ──────────────────────────────────────── */}
        {state === "loadingDelete" && (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <Loader2 className="animate-spin text-red-500" size={40} />
            <p className="text-sm text-gray-500">Deletando torneio...</p>
          </div>
        )}

        {/* ── SUCCESS DELETE ──────────────────────────────────────── */}
        {state === "successDelete" && (
          <>
            <div className="flex flex-col items-center justify-center py-6 gap-3">
              <CheckCircle2 className="text-green-600" size={48} />
              <DialogTitle className="text-lg font-bold text-gray-900">
                Torneio deletado!
              </DialogTitle>
              <p className="text-sm text-gray-500 text-center">
                O torneio{" "}
                <span className="font-medium text-gray-700">{tournament?.title}</span>{" "}
                foi removido com sucesso.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700 text-white">
                Fechar
              </Button>
            </DialogFooter>
          </>
        )}

        {/* ── ERROR DELETE ────────────────────────────────────────── */}
        {state === "errorDelete" && (
          <>
            <div className="flex flex-col items-center justify-center py-6 gap-3">
              <XCircle className="text-red-500" size={48} />
              <DialogTitle className="text-lg font-bold text-gray-900">
                Erro ao deletar
              </DialogTitle>
              <p className="text-sm text-gray-500 text-center">
                Não foi possível deletar o torneio. Tente novamente.
              </p>
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Fechar
              </Button>
              <Button
                onClick={onConfirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Tentar novamente
              </Button>
            </DialogFooter>
          </>
        )}

        {/* ── EDIT (placeholder) ──────────────────────────────────── */}
        {state === "edit" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <Pencil size={18} className="text-blue-600" />
                </div>
                <DialogTitle className="text-lg font-bold text-gray-900">
                  Editar torneio
                </DialogTitle>
              </div>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                Edição de: <span className="font-medium text-gray-700">{tournament?.title}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 text-sm text-gray-400 text-center">
              Formulário de edição será implementado aqui.
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} className="w-full">
                Fechar
              </Button>
            </DialogFooter>
          </>
        )}

        {/* ── CREATE (placeholder) ────────────────────────────────── */}
        {state === "create" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-gray-900">
                Criar novo torneio
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                Preencha os dados do novo torneio.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 text-sm text-gray-400 text-center">
              Formulário de criação será implementado aqui.
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} className="w-full">
                Fechar
              </Button>
            </DialogFooter>
          </>
        )}

        {/* ── REGISTRATIONS (placeholder) ─────────────────────────── */}
        {state === "registrations" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                  <Users size={18} className="text-green-600" />
                </div>
                <DialogTitle className="text-lg font-bold text-gray-900">
                  Inscrições
                </DialogTitle>
              </div>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                Torneio: <span className="font-medium text-gray-700">{tournament?.title}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 text-sm text-gray-400 text-center">
              Lista de inscrições será implementada aqui.
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} className="w-full">
                Fechar
              </Button>
            </DialogFooter>
          </>
        )}

      </DialogContent>
    </Dialog>
  );
}