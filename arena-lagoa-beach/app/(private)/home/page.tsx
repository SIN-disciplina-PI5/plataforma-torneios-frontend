"use client";

import React, { useState, useEffect } from "react";
import { Info, Star, X } from "lucide-react";
import { api } from "@/app/services/api";
import { Partida } from "@/app/types/partida";
import { AVATAR_PADRAO } from "@/app/utils/auth";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function grupoDe(iso: string | null | undefined) {
  if (!iso) return { ordem: Infinity, label: "Sem data definida" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime()))
    return { ordem: Infinity, label: "Sem data definida" };

  const dia = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const hoje = new Date();
  const base = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const diff = Math.round((+dia - +base) / 864e5);
  const dm = dia.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });

  const label =
    diff === 0
      ? "Hoje"
      : diff === 1
        ? `Amanhã, ${dm}`
        : diff === -1
          ? `Ontem, ${dm}`
          : `${cap(dia.toLocaleDateString("pt-BR", { weekday: "long" }))}, ${dm}`;

  return { ordem: +dia, label };
}

function horaDe(iso: string | null | undefined) {
  if (!iso) return "--:--";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "--:--"
    : d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

const fasesMap: Record<string, string> = {
  OITAVAS_DE_FINAL: "Oitavas de Finais",
  QUARTAS_DE_FINAL: "Quartas de Finais",
  SEMI_FINAL: "Semifinais",
  FINAL: "Finais",
};

const labelFase = (fase: string) => fasesMap[fase?.toUpperCase()] || fase || "";

function AvatarUser({
  src,
  nome,
  size = 32,
}: {
  src?: string | null;
  nome: string;
  size?: number;
}) {
  const finalSrc = src || AVATAR_PADRAO;
  return (
    <span
      role="img"
      aria-label={nome}
      className="shrink-0 rounded-full bg-gray-200 bg-cover bg-center border border-white"
      style={{
        width: size,
        height: size,
        borderWidth: "1.5px",
        backgroundImage: `url("${finalSrc}")`,
      }}
    />
  );
}

function TimeUser({
  equipe,
  rightAlign = false,
}: {
  equipe: any;
  rightAlign?: boolean;
}) {
  if (!equipe) {
    return (
      <div
        className={`flex items-center gap-2 w-full min-w-0 ${rightAlign ? "flex-row-reverse" : "flex-row"}`}
      >
        <span className="text-[11px] sm:text-xs text-gray-400 truncate w-full text-center sm:text-left">
          A definir
        </span>
      </div>
    );
  }

  const membros = equipe.membros || equipe.usuarios || [];
  const membroA = membros[0];
  const membroB = membros[1];

  const avatares =
    membroA || membroB ? (
      <div
        className={`flex shrink-0 items-center -space-x-2 ${rightAlign ? "flex-row-reverse space-x-reverse" : ""}`}
      >
        {membroA && (
          <AvatarUser src={membroA.foto_perfil} nome={membroA.nome} size={28} />
        )}
        {membroB && (
          <AvatarUser src={membroB.foto_perfil} nome={membroB.nome} size={28} />
        )}
      </div>
    ) : (
      <div className="shrink-0 flex items-center justify-center">
        <AvatarUser
          src={equipe.foto_perfil}
          nome={equipe.nome || "Time"}
          size={28}
        />
      </div>
    );

  return (
    <div
      className={`flex items-center gap-1.5 sm:gap-2.5 w-full min-w-0 ${rightAlign ? "flex-row-reverse" : "flex-row"}`}
    >
      {avatares}
      <span
        className={`text-[11px] sm:text-[13px] font-semibold text-gray-800 truncate w-full ${rightAlign ? "text-right" : "text-left"}`}
      >
        {equipe.nome || "Time"}
      </span>
    </div>
  );
}

function PlacarUser({ partida }: { partida: any }) {
  const isFinalizada =
    partida.status?.toUpperCase() === "FINALIZADA" ||
    !!partida.vencedor_id ||
    !!partida.vencedorId;

  let valA = partida.placarA;
  let valB = partida.placarB;

  if (partida.placar && typeof partida.placar === "string") {
    const parts = partida.placar.split("-");
    if (parts.length === 2) {
      valA = parseInt(parts[0].trim(), 10);
      valB = parseInt(parts[1].trim(), 10);
    }
  }

  const hasScore = valA != null && !isNaN(valA) && valB != null && !isNaN(valB);

  if (!hasScore) {
    return (
      <div className="flex flex-col items-center justify-center">
        <span className="shrink-0 rounded-full bg-gray-100 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-gray-400 whitespace-nowrap">
          vs
        </span>
        {isFinalizada && (
          <span className="text-[10px] sm:text-[11px] text-red-500 font-bold mt-1.5 whitespace-nowrap">
            Partida encerrada
          </span>
        )}
      </div>
    );
  }

  if (isFinalizada) {
    const aWon = valA > valB;
    const bWon = valB > valA;

    return (
      <div className="flex flex-col items-center justify-center mt-2">
        <div className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-[12px] sm:text-sm font-black whitespace-nowrap flex items-center gap-1.5 shadow-sm">
          <span
            className={
              aWon ? "text-green-600" : bWon ? "text-gray-400" : "text-gray-600"
            }
          >
            {valA}
          </span>
          <span className="text-gray-300">-</span>
          <span
            className={
              bWon ? "text-green-600" : aWon ? "text-gray-400" : "text-gray-600"
            }
          >
            {valB}
          </span>
        </div>
        <span className="text-[10px] sm:text-[11px] text-red-500 font-bold mt-1.5 whitespace-nowrap">
          Partida Encerrada
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <span className="shrink-0 rounded-full bg-violet-100 px-2 sm:px-3 py-1 text-[11px] sm:text-sm font-bold text-violet-700 whitespace-nowrap">
        {valA} - {valB}
      </span>
    </div>
  );
}

function ColunaDupla({ equipe }: { equipe: any }) {
  const membros = equipe.membros || equipe.usuarios || [];
  return (
    <div className="flex-1 rounded-lg bg-gray-50 p-3">
      <p className="mb-3 text-center text-sm font-semibold text-gray-800">
        {equipe.nome}
      </p>
      <ul className="space-y-2">
        {membros.map((m: any) => (
          <li key={m.id_usuario || m.id} className="flex items-center gap-2">
            <AvatarUser src={m.foto_perfil} nome={m.nome} size={24} />
            <span className="truncate text-xs text-gray-700">{m.nome}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DetalhesPartida({ partida }: { partida: any }) {
  const equipeA =
    partida.equipe1 || (partida.equipes && partida.equipes[0]) || null;
  const equipeB =
    partida.equipe2 || (partida.equipes && partida.equipes[1]) || null;

  const placarFinal =
    partida.placar ||
    (partida.placarA != null && partida.placarB != null
      ? `${partida.placarA} - ${partida.placarB}`
      : null);

  return (
    <>
      <p className="mb-1 text-sm font-medium text-gray-700">
        {partida.torneio || "Torneio não informado"}
      </p>
      <p className="mb-5 text-xs text-gray-400">
        {labelFase(partida.fase)} · {partida.status || "PENDENTE"}
      </p>

      <div className="flex items-stretch gap-3">
        {equipeA ? (
          <ColunaDupla equipe={equipeA} />
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-lg bg-gray-50 p-3 text-xs text-gray-400">
            A definir
          </div>
        )}
        <div className="flex flex-col items-center justify-center px-1">
          <span className="text-2xl font-bold text-gray-800">
            {placarFinal || "—"}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-wide text-gray-400">
            Placar
          </span>
        </div>
        {equipeB ? (
          <ColunaDupla equipe={equipeB} />
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-lg bg-gray-50 p-3 text-xs text-gray-400">
            A definir
          </div>
        )}
      </div>

      {partida.resultado && (
        <p className="mt-5 rounded-md bg-green-50 px-3 py-2 text-center text-xs font-medium text-green-700">
          {partida.resultado}
        </p>
      )}
    </>
  );
}

function Modal({
  titulo,
  onClose,
  children,
}: {
  titulo: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      role="presentation"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl sm:p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">{titulo}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function ConteudoPartidas() {
  const [userName, setUserName] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [todasAsPartidas, setTodasAsPartidas] = useState<Partida[]>([]);
  const [abaAtiva, setAbaAtiva] = useState<string>("Todos");
  const [loading, setLoading] = useState(true);

  const [infoId, setInfoId] = useState<string | null>(null);

  const abas = [
    "Todos",
    "Minhas Partidas",
    "Oitavas de Finais",
    "Quartas de Finais",
    "Semifinais",
    "Finais",
    "Favoritos",
  ];

  useEffect(() => {
    const buscarDadosDoBackEnd = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        setCurrentUserId(userId);

        if (!token) {
          setUserName("Visitante");
          setLoading(false);
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        if (userId) {
          const respostaUsuario = await api.get(`/users/${userId}`, config);
          if (respostaUsuario.data && respostaUsuario.data.data) {
            const nomeDoBanco = respostaUsuario.data.data.nome;
            const nomeFormatado =
              nomeDoBanco.charAt(0).toUpperCase() + nomeDoBanco.slice(1);
            setUserName(nomeFormatado);
          }
        }

        const respostaPartidas = await api.get("/partidas", config);

        let partidasDoBanco = [];
        if (
          respostaPartidas.data &&
          Array.isArray(respostaPartidas.data.data)
        ) {
          partidasDoBanco = respostaPartidas.data.data;
        } else if (Array.isArray(respostaPartidas.data)) {
          partidasDoBanco = respostaPartidas.data;
        }

        setTodasAsPartidas(partidasDoBanco);
      } catch (error) {
        console.error("Erro ao buscar dados na API com Axios:", error);
        setUserName("Visitante");
      } finally {
        setLoading(false);
      }
    };

    buscarDadosDoBackEnd();
  }, []);

  const handleToggleFavorite = async (id: string) => {
    setTodasAsPartidas((prev) =>
      prev.map((p: any) => {
        const partidaId = p.id_partida || p.id;
        if (partidaId === id) {
          return { ...p, favorita: !p.favorita };
        }
        return p;
      }),
    );
  };

  const obterPartidasAgrupadas = () => {
    let partidasFiltradas = [...todasAsPartidas];
    const userId = currentUserId;

    if (abaAtiva === "Minhas Partidas") {
      partidasFiltradas = todasAsPartidas.filter((p: any) => {
        const e1 = p.equipe1 || (p.equipes && p.equipes[0]) || null;
        const e2 = p.equipe2 || (p.equipes && p.equipes[1]) || null;

        const verificaEquipe = (equipe: any) => {
          if (!equipe) return false;

          if (
            String(equipe.id_usuario) === String(userId) ||
            String(equipe.id) === String(userId)
          )
            return true;

          const membros = equipe.membros || equipe.usuarios || [];
          if (Array.isArray(membros)) {
            return membros.some(
              (m: any) =>
                String(m.id_usuario) === String(userId) ||
                String(m.id) === String(userId),
            );
          }
          return false;
        };

        return verificaEquipe(e1) || verificaEquipe(e2);
      });
    } else if (abaAtiva === "Favoritos") {
      partidasFiltradas = todasAsPartidas.filter((p: any) => p.favorita);
    } else if (abaAtiva !== "Todos") {
      partidasFiltradas = todasAsPartidas.filter((p: any) => {
        const faseDoBanco = p.fase ? String(p.fase).toUpperCase() : "";
        const faseTraduzida = fasesMap[faseDoBanco] || p.fase || "";

        return (
          faseTraduzida.trim().toLowerCase() === abaAtiva.trim().toLowerCase()
        );
      });
    }

    const mapa = new Map<string, { ordem: number; itens: Partida[] }>();
    for (const p of partidasFiltradas) {
      const g = grupoDe(p.horario);
      const atual = mapa.get(g.label) ?? { ordem: g.ordem, itens: [] };
      atual.itens.push(p);
      mapa.set(g.label, atual);
    }

    return [...mapa.entries()]
      .sort((a, b) => a[1].ordem - b[1].ordem)
      .map(([label, v]) => ({ label, itens: v.itens }));
  };

  const gruposDePartidas = obterPartidasAgrupadas();

  const partidaInfo =
    todasAsPartidas.find((p: any) => (p.id_partida || p.id) === infoId) || null;

  return (
    <div className="w-full bg-white font-sans p-4 sm:p-8 min-h-screen overflow-x-hidden relative">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2 mb-1 text-black">
          ⚽ Olá, {userName}
        </h1>
        <p className="text-[#a1a1aa] text-sm font-medium">
          Essas são as partidas dos torneios em andamento
        </p>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {abas.map((aba) => (
            <button
              key={aba}
              onClick={() => setAbaAtiva(aba)}
              className={`rounded-full px-4 py-2 text-[13px] sm:text-sm font-semibold transition-all cursor-pointer ${
                abaAtiva === aba
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {aba}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 py-10 text-center">
          Carregando partidas...
        </p>
      ) : gruposDePartidas.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 py-16 text-center text-sm text-gray-500 mt-6 mx-2">
          Nenhuma partida encontrada para "{abaAtiva}".
        </p>
      ) : (
        <div className="space-y-6 sm:space-y-7">
          {gruposDePartidas.map((grupo) => (
            <section key={grupo.label}>
              <h2 className="mb-3 text-sm text-gray-500 ml-1 font-medium">
                {grupo.label}
              </h2>
              <ul className="space-y-3 sm:space-y-4">
                {grupo.itens.map((partida: any) => {
                  const e1 =
                    partida.equipe1 ||
                    (partida.equipes && partida.equipes[0]) ||
                    null;
                  const e2 =
                    partida.equipe2 ||
                    (partida.equipes && partida.equipes[1]) ||
                    null;
                  const partidaId = partida.id_partida || partida.id;

                  return (
                    <li
                      key={partidaId}
                      className="flex flex-col rounded-xl border border-gray-100 bg-gray-50/70 p-3 sm:p-4 transition hover:bg-gray-50 shadow-sm"
                    >
                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 w-full min-w-0">
                        <div className="min-w-0 flex w-full">
                          <TimeUser equipe={e1} rightAlign={true} />
                        </div>

                        <div className="shrink-0 flex justify-center px-1 sm:px-2">
                          <PlacarUser partida={partida} />
                        </div>

                        <div className="min-w-0 flex w-full">
                          <TimeUser equipe={e2} rightAlign={false} />
                        </div>
                      </div>

                      <div className="flex w-full items-center justify-between pt-3 mt-3 border-t border-gray-200/60">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button
                            type="button"
                            onClick={() => setInfoId(partidaId)}
                            className="rounded-md p-1 sm:p-2 transition text-gray-400 hover:bg-gray-200 hover:text-gray-600 cursor-pointer"
                            title="Detalhes"
                          >
                            <Info size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleFavorite(partidaId)}
                            className={`rounded-md p-1 sm:p-2 transition cursor-pointer ${
                              partida.favorita
                                ? "text-[#0f172a] hover:bg-gray-200"
                                : "text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                            }`}
                            title={
                              partida.favorita
                                ? "Remover favorito"
                                : "Favoritar"
                            }
                          >
                            <Star
                              size={17}
                              className={
                                partida.favorita
                                  ? "fill-current text-[#0f172a]"
                                  : ""
                              }
                            />
                          </button>
                        </div>

                        <span className="shrink-0 rounded-md bg-green-50/80 px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-green-700">
                          {horaDe(partida.horario)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}

      {partidaInfo && (
        <Modal titulo="Detalhes da Partida" onClose={() => setInfoId(null)}>
          <DetalhesPartida partida={partidaInfo} />
        </Modal>
      )}
    </div>
  );
}
