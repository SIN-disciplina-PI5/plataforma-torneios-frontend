"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  Loader2,
  CheckCircle2,
  XCircle,
  Trash2,
  Pencil,
  Users,
  Plus,
  AlertCircle,
} from "lucide-react";

import type {
  AdminDialogState,
  Tournament,
} from "@/app/types/torneios";

import { createTorneio } from "@/app/services/torneioService";

interface AdminTournamentDialogsProps {
  state: AdminDialogState;
  tournament: Tournament | null;
  onClose: () => void;
  onConfirmDelete: () => void;
  onTournamentCreated?: (newTournament: Tournament) => void;
}

type FormErrors = {
  [key: string]: string;
};

export function AdminTournamentDialogs({
  state,
  tournament,
  onClose,
  onConfirmDelete,
  onTournamentCreated,
}: AdminTournamentDialogsProps) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [numVagas, setNumVagas] = useState<number | "">(4);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  const [duplicateNameError, setDuplicateNameError] = useState(false);

  const isOpen = state !== "idle";

  const handleClose = () => {
    setNome("");
    setCategoria("");
    setDataInicio("");
    setDataFim("");
    setNumVagas(4);

    setErrors({});

    setDuplicateNameError(false);

    onClose();
  };

  const validarFormulario = (): boolean => {
    const novoErros: FormErrors = {};

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (!nome.trim()) {
      novoErros.nome = "Nome do torneio é obrigatório";
    }

    if (!categoria) {
      novoErros.categoria = "Categoria é obrigatória";
    }

    if (!dataInicio) {
      novoErros.dataInicio = "Data de início é obrigatória";
    }

    if (!dataFim) {
      novoErros.dataFim = "Data de término é obrigatória";
    }

    if (!numVagas) {
      novoErros.numVagas = "Número de vagas é obrigatório";
    }

    if (dataInicio) {
      const inicio = new Date(dataInicio);

      if (inicio < hoje) {
        novoErros.dataInicio =
          "Data de início não pode ser anterior a hoje";
      }
    }

    if (dataFim) {
      const fim = new Date(dataFim);

      if (fim < hoje) {
        novoErros.dataFim =
          "Data de término não pode ser anterior a hoje";
      }
    }

    if (dataInicio && dataFim) {
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);

      if (fim <= inicio) {
        novoErros.dataFim =
          "Data de término deve ser posterior à data de início";
      }
    }

    setErrors(novoErros);

    return Object.keys(novoErros).length === 0;
  };

  const handleCriar = async () => {
    if (!validarFormulario()) {
      toast.error("Verifique os campos do formulário");
      return;
    }

    try {
      setLoading(true);

      setDuplicateNameError(false);

      const dataInicioIso = new Date(dataInicio).toISOString();

      const dataFimIso = new Date(dataFim).toISOString();

      const torneioData = {
        nome: nome
          .trim()
          .toLowerCase()
          .replace(/\b\w/g, (l) => l.toUpperCase()),

        categoria,

        vagas: Number(numVagas),

        data_inicio: dataInicioIso,

        data_fim: dataFimIso,
      };

      const resultado = await createTorneio(torneioData);

      toast.success("Torneio criado com sucesso!");

      if (onTournamentCreated) {
        onTournamentCreated({
          id_torneio: resultado.id_torneio || "",
          nome: resultado.nome,
          categoria: resultado.categoria,
          vagas: resultado.vagas,
          status: resultado.status,
        });
      }

      setTimeout(() => {
        handleClose();
      }, 800);
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err.response?.status === 409
      ) {
        setDuplicateNameError(true);
        return;
      }

      console.error(err);

      toast.error("Erro na requisição. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogContent className="sm:max-w-md rounded-2xl">

        {/* CONFIRM DELETE */}
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
                Tem certeza que deseja deletar este torneio?
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 my-2">
              <p className="font-semibold text-gray-900 text-sm">
                {tournament?.nome}
              </p>

              <p className="text-xs text-gray-500 mt-0.5">
                Categoria: {tournament?.categoria} ·{" "}
                {tournament?.vagas} vagas
              </p>
            </div>

            <DialogFooter className="flex gap-2 mt-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
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

        {/* LOADING DELETE */}
        {state === "loadingDelete" && (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <Loader2
              className="animate-spin text-red-500"
              size={40}
            />

            <p className="text-sm text-gray-500">
              Deletando torneio...
            </p>
          </div>
        )}

        {/* SUCCESS DELETE */}
        {state === "successDelete" && (
          <>
            <div className="flex flex-col items-center justify-center py-6 gap-3">
              <CheckCircle2
                className="text-green-600"
                size={48}
              />

              <DialogTitle className="text-lg font-bold text-gray-900">
                Torneio deletado!
              </DialogTitle>

              <p className="text-sm text-gray-500 text-center">
                O torneio{" "}
                <span className="font-medium text-gray-700">
                  {tournament?.nome}
                </span>{" "}
                foi removido com sucesso.
              </p>
            </div>

            <DialogFooter>
              <Button
                onClick={onClose}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Fechar
              </Button>
            </DialogFooter>
          </>
        )}

        {/* ERROR DELETE */}
        {state === "errorDelete" && (
          <>
            <div className="flex flex-col items-center justify-center py-6 gap-3">
              <XCircle
                className="text-red-500"
                size={48}
              />

              <DialogTitle className="text-lg font-bold text-gray-900">
                Erro ao deletar
              </DialogTitle>

              <p className="text-sm text-gray-500 text-center">
                Não foi possível deletar o torneio.
                Tente novamente.
              </p>
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
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

        {/* EDIT */}
        {state === "edit" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <Pencil
                    size={18}
                    className="text-blue-600"
                  />
                </div>

                <DialogTitle className="text-lg font-bold text-gray-900">
                  Editar torneio
                </DialogTitle>
              </div>

              <DialogDescription className="text-sm text-gray-500 mt-1">
                Edição de:{" "}
                <span className="font-medium text-gray-700">
                  {tournament?.nome}
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 text-sm text-gray-400 text-center">
              Formulário de edição será implementado aqui.
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full"
              >
                Fechar
              </Button>
            </DialogFooter>
          </>
        )}

        {/* CREATE */}
        {state === "create" && !duplicateNameError && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="bg-green-50 p-2 rounded-full text-green-600">
                  <Plus size={18} />
                </div>

                <DialogTitle className="text-xl font-bold text-black">
                  Criar torneio
                </DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-4">

              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Torneio
                </label>

                <input
                  type="text"
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value);

                    if (errors.nome) {
                      setErrors({
                        ...errors,
                        nome: "",
                      });
                    }
                  }}
                  placeholder="Ex: Copa Westeros"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
                />

                {errors.nome && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.nome}
                  </p>
                )}
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível / Categoria
                </label>

                <div className="relative">
                  <select
                    value={categoria}
                    onChange={(e) => {
                      setCategoria(e.target.value);

                      if (errors.categoria) {
                        setErrors({
                          ...errors,
                          categoria: "",
                        });
                      }
                    }}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
                  >
                    <option value="">
                      Selecione uma categoria
                    </option>

                    <option value="Iniciante">
                      Iniciante
                    </option>

                    <option value="Intermediário">
                      Intermediário
                    </option>

                    <option value="Avançado">
                      Avançado
                    </option>
                  </select>

                  <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                </div>

                {errors.categoria && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.categoria}
                  </p>
                )}
              </div>

              {/* Data Inicio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Início
                </label>

                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={dataInicio}
                  onChange={(e) => {
                    setDataInicio(e.target.value);

                    if (errors.dataInicio) {
                      setErrors({
                        ...errors,
                        dataInicio: "",
                      });
                    }
                  }}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
                />

                {errors.dataInicio && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.dataInicio}
                  </p>
                )}
              </div>

              {/* Data Fim */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Término
                </label>

                <input
                  type="date"
                  min={
                    dataInicio ||
                    new Date().toISOString().split("T")[0]
                  }
                  value={dataFim}
                  onChange={(e) => {
                    setDataFim(e.target.value);

                    if (errors.dataFim) {
                      setErrors({
                        ...errors,
                        dataFim: "",
                      });
                    }
                  }}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
                />

                {errors.dataFim && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.dataFim}
                  </p>
                )}
              </div>

              {/* Vagas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Vagas
                </label>

                <div className="relative">
                  <select
                    value={numVagas}
                    onChange={(e) => {
                      setNumVagas(
                        e.target.value
                          ? Number(e.target.value)
                          : ""
                      );

                      if (errors.numVagas) {
                        setErrors({
                          ...errors,
                          numVagas: "",
                        });
                      }
                    }}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
                  >
                    <option value={4}>4 vagas</option>
                    <option value={8}>8 vagas</option>
                    <option value={16}>16 vagas</option>
                    <option value={32}>32 vagas</option>
                  </select>

                  <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                </div>

                {errors.numVagas && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.numVagas}
                  </p>
                )}
              </div>

              {Object.keys(errors).length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                  <ul className="space-y-1">
                    {Object.values(errors).map((erro, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-red-700"
                      >
                        • {erro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <DialogFooter className="flex gap-2 mt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                Cancelar
              </Button>

              <Button
                onClick={handleCriar}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar"
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {/* DUPLICATE NAME ERROR */}
        {state === "create" && duplicateNameError && (
          <>
            <div className="flex flex-col items-center justify-center py-6 gap-3">
              <AlertCircle
                className="text-orange-500"
                size={48}
              />

              <DialogTitle className="text-lg font-bold text-gray-900">
                Torneio já existente
              </DialogTitle>

              <p className="text-sm text-gray-500 text-center">
                Já existe um torneio com esse nome.
                Escolha outro nome para continuar.
              </p>
            </div>

            <DialogFooter>
              <Button
                onClick={() => setDuplicateNameError(false)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                Entendi
              </Button>
            </DialogFooter>
          </>
        )}

        {/* REGISTRATIONS */}
        {state === "registrations" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                  <Users
                    size={18}
                    className="text-green-600"
                  />
                </div>

                <DialogTitle className="text-lg font-bold text-gray-900">
                  Inscrições
                </DialogTitle>
              </div>

              <DialogDescription className="text-sm text-gray-500 mt-1">
                Torneio:{" "}
                <span className="font-medium text-gray-700">
                  {tournament?.nome}
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 text-sm text-gray-400 text-center">
              Lista de inscrições será implementada aqui.
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full"
              >
                Fechar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}