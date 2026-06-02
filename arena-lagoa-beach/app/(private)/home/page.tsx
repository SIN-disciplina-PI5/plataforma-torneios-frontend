"use client";

import React, { useState, useEffect } from "react";
import { Info, Star } from "lucide-react";
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
      className="shrink-0 rounded-full bg-gray-200 bg-cover bg-center border border-gray-100"
      style={{
        width: size,
        height: size,
        backgroundImage: `url("${finalSrc}")`,
      }}
    />
  );
}

function TimeUser({ equipe }: { equipe: any }) {
  if (!equipe) {
    return (
      <div className="flex min-w-0 flex-1 items-center justify-center gap-1">
        <span className="text-xs text-gray-400">A definir</span>
      </div>
    );
  }

  const foto =
    equipe.foto_perfil ||
    (equipe.membros && equipe.membros[0]?.foto_perfil) ||
    (equipe.usuarios && equipe.usuarios[0]?.foto_perfil) ||
    null;

  return (
    <div className="flex min-w-0 flex-1 items-center justify-center gap-2.5">
      <AvatarUser src={foto} nome={equipe.nome || "Time"} />
      <span className="max-w-[150px] text-xs font-medium leading-tight text-gray-800 line-clamp-2">
        {equipe.nome || "Time"}
      </span>
    </div>
  );
}

function PlacarUser({ partida }: { partida: any }) {
  const placarFinal =
    partida.placar ||
    (partida.placarA != null && partida.placarB != null
      ? `${partida.placarA} - ${partida.placarB}`
      : null);

  if (!placarFinal || placarFinal.trim() === "" || placarFinal === "-") {
    return (
      <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400">
        vs
      </span>
    );
  }
  return (
    <span className="shrink-0 rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">
      {placarFinal}
    </span>
  );
}

export default function ConteudoPartidas() {
  const [userName, setUserName] = useState<string>("");
  const [todasAsPartidas, setTodasAsPartidas] = useState<Partida[]>([]);
  const [abaAtiva, setAbaAtiva] = useState<string>("Todos");
  const [loading, setLoading] = useState(true);

  const abas = [
    "Todos",
    "Minhas Partidas",
    "Oitavas de Finais",
    "Quartas de Finais",
    "Semifinais",
    "Finais",
  ];

  useEffect(() => {
    const buscarDadosDoBackEnd = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

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

  const obterPartidasAgrupadas = () => {
    let partidasFiltradas = [...todasAsPartidas];
    const userId = localStorage.getItem("userId");

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
    } else if (abaAtiva !== "Todos") {
      const fasesMap: Record<string, string> = {
        OITAVAS_DE_FINAL: "Oitavas de Finais",
        QUARTAS_DE_FINAL: "Quartas de Finais",
        SEMI_FINAL: "Semifinais",
        FINAL: "Finais",
      };

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

  return (
    <div className="w-full bg-white font-sans p-8 min-h-screen">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2 mb-1 text-black">
          ⚽ Olá, {userName}
        </h1>
        <p className="text-[#a1a1aa] text-sm font-medium">
          Essas são as partidas dos torneios em andamento
        </p>
      </div>

      {/* Navegação de Abas Dinâmica */}
      <div className="flex gap-8 border-b border-gray-100 mb-6 text-sm font-medium text-[#a1a1aa] overflow-x-auto whitespace-nowrap">
        {abas.map((aba) => (
          <button
            key={aba}
            onClick={() => setAbaAtiva(aba)}
            className={`pb-3 transition-colors cursor-pointer ${
              abaAtiva === aba
                ? "border-b-2 border-green-600 text-black font-semibold"
                : "hover:text-gray-700"
            }`}
          >
            {aba}
          </button>
        ))}
      </div>

      {/* Lista de Partidas */}
      {loading ? (
        <p className="text-gray-500 py-10">Carregando partidas...</p>
      ) : gruposDePartidas.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 py-16 text-center text-sm text-gray-500 mt-6">
          Nenhuma partida encontrada para "{abaAtiva}".
        </p>
      ) : (
        <div className="space-y-7">
          {gruposDePartidas.map((grupo) => (
            <section key={grupo.label}>
              <h2 className="mb-3 text-sm text-gray-500">{grupo.label}</h2>
              <ul className="space-y-2">
                {grupo.itens.map((partida: any) => {
                  const e1 =
                    partida.equipe1 ||
                    (partida.equipes && partida.equipes[0]) ||
                    null;
                  const e2 =
                    partida.equipe2 ||
                    (partida.equipes && partida.equipes[1]) ||
                    null;

                  return (
                    <li
                      key={partida.id_partida || partida.id}
                      className="flex flex-wrap items-center gap-x-3 gap-y-3 rounded-xl border border-gray-100 bg-gray-50/70 px-3 py-3 transition hover:bg-gray-50 sm:px-4"
                    >
                      {/* Área da Partida (Times e Placar) */}
                      <div className="flex min-w-[230px] flex-1 items-center justify-center gap-2 sm:gap-4">
                        <TimeUser equipe={e1} />
                        <PlacarUser partida={partida} />
                        <TimeUser equipe={e2} />
                      </div>

                      {/* Tag de Horário */}
                      <span className="shrink-0 rounded-md bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                        {horaDe(partida.horario)}
                      </span>

                      {/* Ações (Info e Favorito) */}
                      <div className="flex shrink-0 items-center gap-0.5">
                        <button
                          type="button"
                          className="rounded-md p-2 transition text-gray-400 hover:bg-gray-200 hover:text-gray-600 cursor-pointer"
                          title="Detalhes"
                        >
                          <Info size={17} />
                        </button>
                        <button
                          type="button"
                          className={`rounded-md p-2 transition cursor-pointer ${
                            partida.favorita
                              ? "text-[#0f172a]"
                              : "text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                          }`}
                          title="Favoritar"
                        >
                          <Star
                            size={17}
                            className={partida.favorita ? "fill-current" : ""}
                          />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
