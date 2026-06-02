"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CheckCircle2, Info, Pencil, X } from "lucide-react";
import { AVATAR_PADRAO } from "@/app/utils/auth";

/* ------------------------------------------------------------------ */
/* CONFIG                                                            */
/* ------------------------------------------------------------------ */

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://plataforma-torneios-backend-mocha.vercel.app";
const FINALIZADA = "FINALIZADA";

const fases: [string, string][] = [
  ["OITAVAS_DE_FINAL", "Oitavas de Finais"],
  ["QUARTAS_DE_FINAL", "Quartas de Finais"],
  ["SEMI_FINAL", "Semifinais"],
  ["FINAL", "Finais"],
];
const labelFase = (v: string) => fases.find((f) => f[0] === v)?.[1] ?? v;

type Membro = {
  id_usuario: string;
  nome: string;
  foto_perfil: string | null;
};

type Equipe = {
  id_equipe: string;
  nome: string;
  membros: Membro[];
};

type Partida = {
  id: string;
  torneio: string | null;
  fase: string;
  status: string;
  horario: string | null;
  placarA: number | null;
  placarB: number | null;
  vencedorId: string | null;
  resultado: string | null;
  equipes: Equipe[];
};

/* ------------------------------------------------------------------ */
/* HELPERS                                                           */
/* ------------------------------------------------------------------ */

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const auth = (json = false): HeadersInit => {
  const t = getToken();
  return {
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
    ...(json ? { "Content-Type": "application/json" } : {}),
  };
};

function parsePlacar(p: unknown): [number | null, number | null] {
  if (p == null || p === "") return [null, null];
  if (typeof p === "string") {
    const parts = p.split(/[xX\-]/);
    const a = parts[0];
    const b = parts[1];
    if (a === undefined || b === undefined) return [null, null];
    const na = Number(a);
    const nb = Number(b);
    if (Number.isNaN(na) || Number.isNaN(nb)) return [null, null];
    return [na, nb];
  }
  const o = p as { a?: number; b?: number };
  return [Number(o.a) || 0, Number(o.b) || 0];
}

function toPartida(r: Record<string, unknown>): Partida {
  const [a, b] = parsePlacar(r.placar);
  return {
    id: (r.id_partida ?? r.id) as string,
    torneio: (r.torneio as string) ?? null,
    fase: r.fase as string,
    status: (r.status as string) ?? "",
    horario: (r.horario as string) ?? null,
    placarA: a,
    placarB: b,
    vencedorId: (r.vencedor_id as string) ?? null,
    resultado: (r.resultado as string) ?? null,
    equipes: (r.equipes as Equipe[]) ?? [],
  };
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const isFinalizada = (p: Partida) => p.status.toUpperCase() === FINALIZADA;

function grupoDe(iso: string | null) {
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

function horaDe(iso: string | null) {
  if (!iso) return "--:--";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "--:--"
    : d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function decodeJwt(t: string): Record<string, unknown> | null {
  try {
    const b = atob(t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"));
    const json = new TextDecoder().decode(
      Uint8Array.from(b, (c) => c.charCodeAt(0)),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function useAdminNome() {
  const [nome, setNome] = useState("Administrador");

  useEffect(() => {
    const t = getToken();
    if (!t) return;
    const p = decodeJwt(t) || {};
    const id = (p.id_usuario || p.id || p.sub || p.userId) as
      | string
      | undefined;

    (async () => {
      const urls = [
        id && `${API}/api/users/${id}`,
        `${API}/api/users/me`,
      ].filter(Boolean) as string[];

      for (const url of urls) {
        try {
          const r = await fetch(url, { headers: auth() });
          if (!r.ok) continue;
          const j = await r.json();
          const n = j?.data?.nome ?? j?.nome;
          if (n) return setNome(n);
        } catch {}
      }
      const tokenNome = (p.nome || p.name) as string | undefined;
      if (tokenNome) setNome(tokenNome);
    })();
  }, []);

  return nome;
}

export default function PartidasPage() {
  const nome = useAdminNome();
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [aba, setAba] = useState<string>("TODOS");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [infoId, setInfoId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
<<<<<<< HEAD
  const [finalizandoId, setFinalizandoId] = useState<string | null>(null);
=======
>>>>>>> b8f2af0c1aa0d28132468196d1fa8efff1a342a0

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const r = await fetch(`${API}/api/partidas`, { headers: auth() });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Erro ao buscar partidas");
      setPartidas((j.data || []).map(toPartida));
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao buscar partidas");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void carregar(); }, 0);
    const id = setInterval(carregar, 30_000);
    return () => { window.clearTimeout(timeoutId); clearInterval(id); };
  }, [carregar]);

<<<<<<< HEAD
  const finalizarPartida = useCallback(async (id: string) => {
    setFinalizandoId(id);
    setErro("");
    try {
      const r = await fetch(`${API}/api/partidas/finalizar/${id}`, {
        method: "PATCH",
        headers: auth(),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "Erro ao finalizar partida");

      await carregar();
      setInfoId(null);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao finalizar partida");
    } finally {
      setFinalizandoId(null);
    }
  }, [carregar]);

=======
>>>>>>> b8f2af0c1aa0d28132468196d1fa8efff1a342a0
  const torneiosAtivos = useMemo(() => {
    const seen = new Set<string>();
    const lista: string[] = [];
    for (const p of partidas) {
      const t = p.torneio;
      if (!t || seen.has(t)) continue;
      seen.add(t);
      const temAtivas = partidas.some((x) => x.torneio === t && !isFinalizada(x));
      if (temAtivas) lista.push(t);
    }
    return lista;
  }, [partidas]);

  const abas: [string, string][] = useMemo(
    () => [
      ["TODOS", "Todos"],
      ...torneiosAtivos.map((t): [string, string] => [t, t]),
      ["FINALIZADAS", "Finalizadas"],
    ],
    [torneiosAtivos],
  );

  const abaAtual = useMemo(
    () => (abas.some(([v]) => v === aba) ? aba : "TODOS"),
    [abas, aba],
  );

  const grupos = useMemo(() => {
    const lista = partidas.filter((p) => {
      if (abaAtual === "FINALIZADAS") return isFinalizada(p);
      if (isFinalizada(p)) return false;
      return abaAtual === "TODOS" || p.torneio === abaAtual;
    });

    const mapa = new Map<string, { ordem: number; itens: Partida[] }>();
    for (const p of lista) {
      const g = grupoDe(p.horario);
      const atual = mapa.get(g.label) ?? { ordem: g.ordem, itens: [] };
      atual.itens.push(p);
      mapa.set(g.label, atual);
    }

    return [...mapa.entries()]
      .sort((a, b) =>
        abaAtual === "FINALIZADAS"
          ? b[1].ordem - a[1].ordem
          : a[1].ordem - b[1].ordem,
      )
      .map(([label, v]) => ({ label, itens: v.itens }));
  }, [partidas, abaAtual]);

  const partidaInfo = partidas.find((p) => p.id === infoId) || null;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8">
        <header className="mb-6 flex flex-wrap items-center gap-3">
          <h1 className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-lg">⚽</span>
            Olá, {nome}
          </h1>
        </header>

        <nav className="mb-6 flex gap-6 overflow-x-auto border-b border-gray-200">
          {abas.map(([v, label]) => (
            <button
              key={v}
              type="button"
              onClick={() => setAba(v)}
              className={`relative whitespace-nowrap pb-3 text-sm transition ${
                abaAtual === v ? "font-semibold text-black" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {label}
              {abaAtual === v && (
                <span className="absolute -bottom-px left-0 h-[3px] w-full rounded-full bg-[#25a51f]" />
              )}
            </button>
          ))}
        </nav>

        {erro && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{erro}</span>
            <button type="button" onClick={carregar} className="shrink-0 font-semibold underline">
              Tentar novamente
            </button>
          </div>
        )}

        {editId && (
          <EditarPartida
            id={editId}
            onClose={() => setEditId(null)}
            onSalvo={() => { setEditId(null); carregar(); }}
          />
        )}

        {carregando ? (
          <p className="py-16 text-center text-sm text-gray-500">Carregando partidas...</p>
        ) : grupos.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 py-16 text-center text-sm text-gray-500">
            Nenhuma partida encontrada.
          </p>
        ) : (
          <div className="space-y-7">
            {grupos.map((g) => (
              <section key={g.label}>
                <h2 className="mb-2 text-sm text-gray-500">{g.label}</h2>
                <ul className="space-y-2">
                  {g.itens.map((p) => (
                    <Linha
                      key={p.id}
                      partida={p}
                      onInfo={() => setInfoId(p.id)}
                      onEditar={() => setEditId(p.id)}
                    />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>

      {partidaInfo && (
        <Modal titulo="Detalhes da Partida" onClose={() => setInfoId(null)}>
<<<<<<< HEAD
          <DetalhesPartida
            partida={partidaInfo}
            finalizando={finalizandoId === partidaInfo.id}
            onFinalizar={() => finalizarPartida(partidaInfo.id)}
          />
=======
          <DetalhesPartida partida={partidaInfo} />
>>>>>>> b8f2af0c1aa0d28132468196d1fa8efff1a342a0
        </Modal>
      )}
    </div>
  );
}

function Linha({
  partida,
  onInfo,
  onEditar,
}: {
  partida: Partida;
  onInfo: () => void;
  onEditar: () => void;
}) {
  const equipeA = partida.equipes[0];
  const equipeB = partida.equipes[1];

  return (
    <li className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50/70 px-3 py-3 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:px-4">
      <div className="flex flex-1 items-center justify-between gap-2 sm:justify-center sm:gap-4">
        <Time equipe={equipeA} align="left" />
        <Placar a={partida.placarA} b={partida.placarB} />
        <Time equipe={equipeB} align="right" />
      </div>

      <div className="flex items-center justify-between sm:justify-end sm:gap-2">
        <span className="shrink-0 rounded-md bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          {horaDe(partida.horario)}
        </span>
        <div className="flex shrink-0 items-center gap-0.5">
          <BotaoIcone titulo="Detalhes" onClick={onInfo} cor="text-gray-400 hover:bg-gray-200 hover:text-gray-600">
            <Info size={17} />
          </BotaoIcone>
          <BotaoIcone titulo="Editar" onClick={onEditar} cor="text-gray-500 hover:bg-gray-200 hover:text-gray-700">
            <Pencil size={16} />
          </BotaoIcone>
        </div>
      </div>
    </li>
  );
}

function Time({
  equipe,
  align = "left",
}: {
  equipe: Equipe | undefined;
  align?: "left" | "right";
}) {
  if (!equipe) {
    return (
      <div className="flex min-w-0 flex-1 items-center justify-center">
        <span className="text-xs text-gray-400">A definir</span>
      </div>
    );
  }

  const [membroA, membroB] = equipe.membros;

  const avatares = (
    <div className="flex shrink-0 items-center -space-x-2">
      {membroA && <Avatar src={membroA.foto_perfil} nome={membroA.nome} size={36} />}
      {membroB && <Avatar src={membroB.foto_perfil} nome={membroB.nome} size={36} />}
    </div>
  );

  return (
    <div
      className={`flex min-w-0 flex-1 items-center gap-2 ${
        align === "right"
          ? "flex-row-reverse justify-start sm:justify-center"
          : "justify-start sm:justify-center"
      }`}
    >
      {avatares}
      <span
        className={`max-w-[80px] text-xs font-semibold leading-tight text-gray-800 line-clamp-2 sm:max-w-[110px] sm:text-sm ${
          align === "right" ? "text-right sm:text-left" : "text-left"
        }`}
      >
        {equipe.nome}
      </span>
    </div>
  );
}

function Placar({ a, b }: { a: number | null; b: number | null }) {
  if (a == null || b == null) {
    return (
      <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400">
        vs
      </span>
    );
  }
  return (
    <span className="shrink-0 rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">
      {a} – {b}
    </span>
  );
}

function BotaoIcone({
  titulo,
  onClick,
  cor,
  children,
}: {
  titulo: string;
  onClick: () => void;
  cor: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={titulo}
      title={titulo}
      className={`rounded-md p-2 transition ${cor}`}
    >
      {children}
    </button>
  );
}

function Avatar({
  src,
  nome,
  size = 30,
}: {
  src: string | null;
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

function DetalhesPartida({
  partida,
  finalizando,
  onFinalizar,
}: {
  partida: Partida;
  finalizando: boolean;
  onFinalizar: () => void;
}) {
  const equipeA = partida.equipes[0];
  const equipeB = partida.equipes[1];
  const partidaFinalizada = isFinalizada(partida);

  return (
    <>
      <p className="mb-1 text-sm font-medium text-gray-700">
        {partida.torneio || "Torneio não informado"}
      </p>
      <p className="mb-5 text-xs text-gray-400">
        {labelFase(partida.fase)} · {partida.status}
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
            {partida.placarA != null
              ? `${partida.placarA} – ${partida.placarB}`
              : "—"}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-wide text-green-400">
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
      <div className="flex items-center justify-center"> 
        <button
        type="button"
        onClick={onFinalizar}
        disabled={finalizando || partidaFinalizada}
        className="mt-5 h-10 w-50  rounded-lg bg-red-600 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {finalizando ? "Finalizando..." : "Finalizar partida"}
      </button>
      </div>
      
    </>
  );
}

function ColunaDupla({ equipe }: { equipe: Equipe }) {
  return (
    <div className="flex-1 rounded-lg bg-gray-50 p-3">
      <p className="mb-3 text-center text-sm font-semibold text-gray-800">
        {equipe.nome}
      </p>
      <ul className="space-y-2">
        {equipe.membros.map((m) => (
          <li key={m.id_usuario} className="flex items-center gap-2">
            <Avatar src={m.foto_perfil} nome={m.nome} size={24} />
            <span className="truncate text-xs text-gray-700">{m.nome}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Modal({
  titulo,
  onClose,
  children,
}: {
  titulo: string;
  onClose: () => void;
  children: ReactNode;
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

function EditarPartida({
  id,
  onClose,
  onSalvo,
}: {
  id: string;
  onClose: () => void;
  onSalvo: () => void;
}) {
  const [partida, setPartida] = useState<Partida | null>(null);
  const [fase, setFase] = useState(fases[0][0]);
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [vencedorId, setVencedorId] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const r = await fetch(`${API}/api/partidas/${id}`, {
          headers: auth(),
        });
        const j = await r.json();
        if (!r.ok || !j.data)
          throw new Error(j.error || "Erro ao buscar partida");
        if (!ativo) return;

        const p = toPartida(j.data);
        setPartida(p);
        setFase(p.fase);
        setA(p.placarA ?? 0);
        setB(p.placarB ?? 0);
        setVencedorId(p.vencedorId);
        if (p.horario) {
          const d = new Date(p.horario);
          const z = (n: number) => String(n).padStart(2, "0");
          setData(
            `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`,
          );
          setHora(`${z(d.getHours())}:${z(d.getMinutes())}`);
        }
      } catch (e) {
        if (ativo)
          setErro(e instanceof Error ? e.message : "Erro ao buscar partida");
      } finally {
        if (ativo) setCarregando(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, [id]);

  async function salvar() {
    if (!partida) return;
    setSalvando(true);
    setErro("");
    try {
      const requestJson = async (url: string, init: RequestInit) => {
        const r = await fetch(url, init);
        const j = await r.json().catch(() => ({}));
        if (!r.ok)
          throw new Error(j.error || `Falha ao salvar (HTTP ${r.status})`);
        return j;
      };
      const equipeVencedora = partida.equipes.find(
        (e) => e.id_equipe === vencedorId,
      );
      const horario =
        data && hora ? new Date(`${data}T${hora}`).toISOString() : null;
      const placar = `${a}-${b}`;

      await requestJson(`${API}/api/partidas/${id}`, {
        method: "PATCH",
        headers: auth(true),
        body: JSON.stringify({
          ...(fase === partida.fase ? { fase } : {}),
          horario,
          placar,
        }),
      });

      if (vencedorId) {
        if (partida.status !== "EM_ANDAMENTO") {
          await requestJson(`${API}/api/partidas/iniciar/${id}`, {
            method: "PATCH",
            headers: auth(true),
          });
        }

        await requestJson(`${API}/api/partidas/finalizar/${id}`, {
          method: "PATCH",
          headers: auth(true),
          body: JSON.stringify({
            placar,
            vencedor_id: vencedorId,
            resultado: equipeVencedora
              ? `${equipeVencedora.nome} vencedora`
              : partida.resultado,
          }),
        });
      }

      onSalvo();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao salvar partida");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <article className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <header className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          ⚽ Editar Partida
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar edição"
          className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X size={18} />
        </button>
      </header>

      {carregando ? (
        <p className="py-6 text-sm text-gray-500">Carregando partida...</p>
      ) : !partida ? (
        <p className="py-4 text-sm text-red-600">
          {erro || "Não foi possível carregar a partida."}
        </p>
      ) : (
        <>
          <div className="mb-6 flex gap-6 overflow-x-auto border-b border-gray-200">
            {fases.map(([v, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => setFase(v)}
                className={`relative whitespace-nowrap pb-3 text-xs transition ${
                  fase === v ? "font-semibold text-black" : "text-gray-400"
                }`}
              >
                {label}
                {fase === v && (
                  <span className="absolute -bottom-px left-0 h-[3px] w-full bg-[#25a51f]" />
                )}
              </button>
            ))}
          </div>

          {erro && (
            <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {erro}
            </p>
          )}

          <div className="mb-6 grid gap-4 sm:max-w-md sm:grid-cols-2">
            <Campo label="Data da Partida">
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="h-10 w-full rounded-md bg-gray-50 px-3 text-sm text-gray-600 outline-none focus:ring-1 focus:ring-[#25a51f]"
              />
            </Campo>
            <Campo label="Horário">
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="h-10 w-full rounded-md bg-gray-50 px-3 text-sm text-gray-600 outline-none focus:ring-1 focus:ring-[#25a51f]"
              />
            </Campo>
          </div>

          <p className="mb-3 text-sm font-medium text-gray-700">
            Resultado Final da Partida
          </p>
          <div className="mb-6 flex items-end gap-4">
            <NumeroPlacar
              label={partida.equipes[0]?.nome ?? "Equipe A"}
              valor={a}
              onChange={setA}
            />
            <span className="pb-3 text-lg font-semibold text-gray-400">-</span>
            <NumeroPlacar
              label={partida.equipes[1]?.nome ?? "Equipe B"}
              valor={b}
              onChange={setB}
            />
          </div>

          {partida.equipes.length > 0 && (
            <>
              <p className="mb-3 text-sm font-medium text-gray-700">
                Equipe Vencedora
              </p>
              <div className="mb-7 space-y-2">
                {partida.equipes.map((equipe) => {
                  const sel = vencedorId === equipe.id_equipe;
                  return (
                    <button
                      key={equipe.id_equipe}
                      type="button"
                      onClick={() => setVencedorId(equipe.id_equipe)}
                      className={`flex w-full max-w-sm items-center justify-between rounded-md border px-3 py-2.5 transition ${
                        sel
                          ? "border-[#25a51f] bg-green-50"
                          : "border-transparent bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        {equipe.membros.map((m) => (
                          <span
                            key={m.id_usuario}
                            className="flex items-center gap-2"
                          >
                            <Avatar
                              src={m.foto_perfil}
                              nome={m.nome}
                              size={24}
                            />
                            <span className="text-xs font-medium text-gray-700">
                              {m.nome}
                            </span>
                          </span>
                        ))}
                      </span>
                      <CheckCircle2
                        size={16}
                        className={sel ? "text-[#25a51f]" : "text-gray-300"}
                        fill={sel ? "#25a51f" : "transparent"}
                      />
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <button
            type="button"
            onClick={salvar}
            disabled={salvando}
            className="h-11 w-full max-w-sm rounded-lg bg-[#25a51f] text-sm font-bold text-white transition hover:bg-[#208d1b] disabled:opacity-60"
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </>
      )}
    </article>
  );
}

function Campo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-600">
        {label}
      </label>
      {children}
    </div>
  );
}

function NumeroPlacar({
  label,
  valor,
  onChange,
}: {
  label: string;
  valor: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="text-center">
      <p className="mb-1 text-xs text-gray-500">{label}</p>
      <input
        type="number"
        min={0}
        value={valor}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="h-12 w-14 rounded-md bg-gray-50 text-center text-lg outline-none focus:ring-1 focus:ring-[#25a51f]"
      />
    </div>
  );
}
