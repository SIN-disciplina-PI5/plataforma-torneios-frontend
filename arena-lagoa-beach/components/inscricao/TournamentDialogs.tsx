import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

import type { TournamentUI } from "@/app/types/torneios";

type DialogState = "idle" | "confirm" | "loading" | "success" | "error";

interface TournamentDialogsProps {
  state: DialogState;
  tournament: TournamentUI | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function TournamentDialogs({ state, tournament, onClose, onConfirm }: TournamentDialogsProps) {
  const isOpen = state !== "idle";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-380px rounded-2xl">

        {/* CONFIRM */}
        {state === "confirm" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-gray-900">
                Confirmar inscrição
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                Você está se inscrevendo em:
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 my-2">
              <p className="font-semibold text-gray-900 text-sm">{tournament?.nome}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Categoria: {tournament?.categoria} · {tournament?.vagas} vagas
              </p>
            </div>

            <DialogFooter className="flex gap-2 mt-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={onConfirm} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                Confirmar
              </Button>
            </DialogFooter>
          </>
        )}

        {/* LOADING */}
        {state === "loading" && (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <Loader2 className="animate-spin text-green-600" size={40} />
            <p className="text-sm text-gray-500">Realizando inscrição...</p>
          </div>
        )}

        {/* SUCCESS */}
        {state === "success" && (
          <>
            <div className="flex flex-col items-center justify-center py-6 gap-3">
              <CheckCircle2 className="text-green-600" size={48} />
              <DialogTitle className="text-lg font-bold text-gray-900">
                Inscrição confirmada!
              </DialogTitle>
              <p className="text-sm text-gray-500 text-center">
                Você está inscrito em{" "}
                <span className="font-medium text-gray-700">{tournament?.nome}</span>. Boa sorte!
              </p>
            </div>
            <DialogFooter>
              <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700 text-white">
                Fechar
              </Button>
            </DialogFooter>
          </>
        )}

        {/* ERROR */}
        {state === "error" && (
          <>
            <div className="flex flex-col items-center justify-center py-6 gap-3">
              <XCircle className="text-red-500" size={48} />
              <DialogTitle className="text-lg font-bold text-gray-900">
                Erro na inscrição
              </DialogTitle>
              <p className="text-sm text-gray-500 text-center">
                Não foi possível realizar sua inscrição. Tente novamente.
              </p>
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Fechar
              </Button>
              <Button onClick={onConfirm} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                Tentar novamente
              </Button>
            </DialogFooter>
          </>
        )}

      </DialogContent>
    </Dialog>
  );
}