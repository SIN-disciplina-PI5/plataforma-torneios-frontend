"use client";

import { useState, useEffect } from "react";
import { Trophy, AlertCircle, Plus, X, Pencil } from "lucide-react";

import type { Tournament, AdminDialogState } from "@/app/types/torneios";
import {
  getTorneios,
  deleteTorneio,
  gerarChaveTorneio,
} from "@/app/services/torneioService";
import { AdminTournamentCard } from "@/components/admin/AdminTournamentCard";
import { AdminTournamentDialogs } from "@/components/admin/AdminTournamentDialogs";
import { EditTournamentForm } from "@/components/admin/adminEditarTorneio";
import { AdminDuplasModal } from "@/components/admin/adminDuplasModal";

export default function AdminTorneiosPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogState, setDialogState] = useState<AdminDialogState>("idle");
  const [selected, setSelected] = useState<Tournament | null>(null);
  const [generateMatchesMessage, setGenerateMatchesMessage] = useState("");

  useEffect(() => {
    const fetchTorneios = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getTorneios();

        if (!data) {
          setError("Falha ao carregar os torneios");
          setTournaments([]);
          return;
        }

        setTournaments(data);
      } catch (err) {
        console.error("Erro ao buscar torneios:", err);
        setError("Erro ao carregar os torneios");
        setTournaments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTorneios();
  }, []);

  function handleEditClick(tournament: Tournament) {
    setSelected(tournament);
    setDialogState("edit");
  }

  function handleDeleteClick(tournament: Tournament) {
    setSelected(tournament);
    setDialogState("confirmDelete");
  }

  function handleViewRegistrations(tournament: Tournament) {
    setSelected(tournament);
    setDialogState("registrations");
  }

  async function handleGenerateMatches(tournament: Tournament) {
    setSelected(tournament);
    setGenerateMatchesMessage("");
    setDialogState("generatingMatches");

    const result = await gerarChaveTorneio(tournament.id_torneio);

    if (!result.sucesso) {
      setGenerateMatchesMessage(result.mensagem || "Erro ao gerar partidas.");
      setDialogState("errorGenerateMatches");
      return;
    }

    const totalText =
      typeof result.totalPartidas === "number"
        ? `${result.totalPartidas} partida(s) gerada(s). `
        : "";

    setGenerateMatchesMessage(
      `${totalText}${result.mensagem || "Chave do torneio gerada."}`,
    );
    setDialogState("generateMatches");
  }

  async function handleConfirmDelete() {
    if (!selected) return;
    setDialogState("loadingDelete");

    const success = await deleteTorneio(selected.id_torneio);

    if (!success) {
      setDialogState("errorDelete");
      return;
    }

    setTournaments((prev) =>
      prev.filter((t) => t.id_torneio !== selected.id_torneio),
    );
    setDialogState("successDelete");
  }

  function handleClose() {
    setDialogState("idle");
    setSelected(null);
    setGenerateMatchesMessage("");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4" />
          <p className="text-gray-600 font-medium">Carregando torneios...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen px-4 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2 text-black">
              ⚽ Gerenciamento de Torneios
            </h1>
          </div>
          <button
            onClick={() => setDialogState("create")}
            className="flex items-center justify-center w-full sm:w-auto gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 sm:py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Novo torneio
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-600" size={20} />
            <p className="text-red-700 font-medium text-sm">{error}</p>
          </div>
        )}

        {tournaments.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-600">
            <Trophy size={48} className="mb-4 opacity-30" />
            <p className="text-lg font-medium">Nenhum torneio cadastrado</p>
          </div>
        )}

        {tournaments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournaments.map((t) => (
              <AdminTournamentCard
                key={t.id_torneio}
                tournament={t}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onViewRegistrations={handleViewRegistrations}
                onGenerateMatches={handleGenerateMatches}
              />
            ))}
          </div>
        )}
      </main>

      <AdminTournamentDialogs
        state={
          dialogState === "edit" || dialogState === "registrations"
            ? "idle"
            : dialogState
        }
        tournament={selected}
        onClose={handleClose}
        onConfirmDelete={handleConfirmDelete}
        generateMatchesMessage={generateMatchesMessage}
        onTournamentCreated={(newTournament) => {
          setTournaments((prev) => [...prev, newTournament]);
        }}
      />

      {dialogState === "edit" && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-[480px] p-6 relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-full text-blue-500">
                  <Pencil size={18} />
                </div>
                <h2 className="text-xl font-bold text-black">Editar torneio</h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5 ml-11">
              <p className="text-[14px] text-gray-500">
                Edição de:{" "}
                <span className="font-semibold text-black">
                  {selected.nome}
                </span>
              </p>
            </div>

            <EditTournamentForm tournament={selected} onClose={handleClose} />
          </div>
        </div>
      )}

      {dialogState === "registrations" && selected && (
        <AdminDuplasModal onClose={handleClose} tournament={selected} />
      )}
    </>
  );
}
