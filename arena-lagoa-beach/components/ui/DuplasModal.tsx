"use client";

import { useCallback, useEffect, useState } from "react";
import { useNotificacao } from "@/lib/NotificacaoContext";

type Jogador = {
  id_usuario: number;
  nome: string;
  patente?: string;
};

type Equipe = {
  id_equipe: number;
  nome: string;
  membros: Jogador[];
  completa: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  torneioId: string | number;
  token: string;
  usuarioId: number;
  onSuccess?: () => void;
};

function capitalizarPalavras(texto: string): string {
  return texto
    .split(" ")
    .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
    .join(" ");
}

export function DuplasModal({
  isOpen,
  onClose,
  torneioId,
  token,
  usuarioId,
  onSuccess,
}: Props) {
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [selectedEquipeId, setSelectedEquipeId] = useState<number | null>(null);
  const [nomeNovaEquipe, setNomeNovaEquipe] = useState("");
  const [modoCriacao, setModoCriacao] = useState(false);

  const { mostrarToast } = useNotificacao();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchEquipes = useCallback(async () => {
    if (!torneioId) return;
    setCarregando(true);
    setErro(null);

    try {
      // 🔥 URL corrigida: sem barra antes do ? e sem barra extra
      const res = await fetch(`${API_BASE_URL}/api/equipe?id_torneio=${torneioId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erro ${res.status}: ${text.substring(0, 100)}`);
      }

      const data = await res.json();
      setEquipes(data);

      const minhaEquipe = data.find((eq: Equipe) =>
        eq.membros.some((m: Jogador) => m.id_usuario === usuarioId)
      );

      setSelectedEquipeId(minhaEquipe?.id_equipe || null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setErro(msg);
      mostrarToast({
        id_notificacao: Date.now().toString(),
        titulo: "Erro",
        mensagem: msg,
        tipo: "error",
        lida: false,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setCarregando(false);
    }
  }, [API_BASE_URL, torneioId, token, usuarioId, mostrarToast]);

  useEffect(() => {
    if (isOpen && torneioId && token && usuarioId) {
      fetchEquipes();
    }
  }, [isOpen, torneioId, token, usuarioId, fetchEquipes]);

  const criarEquipe = async () => {
    if (!nomeNovaEquipe.trim()) {
      mostrarToast({
        id_notificacao: Date.now().toString(),
        titulo: "Erro",
        mensagem: "Nome da equipe é obrigatório",
        tipo: "error",
        lida: false,
        createdAt: new Date().toISOString(),
      });
      return;
    }

    setCarregando(true);
    setErro(null);

    const nomeFormatado = capitalizarPalavras(nomeNovaEquipe.trim());

    try {
      const res = await fetch(`${API_BASE_URL}/api/equipe/${torneioId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome: nomeFormatado }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao criar equipe");
      }

      await fetchEquipes();
      mostrarToast({
        id_notificacao: Date.now().toString(),
        titulo: "✅ Equipe criada!",
        mensagem: `Equipe "${nomeFormatado}" criada com sucesso.`,
        tipo: "success",
        lida: false,
        createdAt: new Date().toISOString(),
      });

      setModoCriacao(false);
      setNomeNovaEquipe("");
      onSuccess?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setErro(msg);
      mostrarToast({
        id_notificacao: Date.now().toString(),
        titulo: "❌ Erro",
        mensagem: msg,
        tipo: "error",
        lida: false,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setCarregando(false);
    }
  };

  const entrarEquipe = async (idEquipe: number) => {
    setCarregando(true);
    setErro(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/equipe/entrar/${torneioId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_equipe: idEquipe }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao entrar na equipe");
      }

      await fetchEquipes();
      const equipeNome = equipes.find((e) => e.id_equipe === idEquipe)?.nome || "dupla";
      mostrarToast({
        id_notificacao: Date.now().toString(),
        titulo: "🎮 Entrou na dupla!",
        mensagem: `Você agora faz parte da equipe "${equipeNome}".`,
        tipo: "success",
        lida: false,
        createdAt: new Date().toISOString(),
      });

      onSuccess?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setErro(msg);
      mostrarToast({
        id_notificacao: Date.now().toString(),
        titulo: "❌ Erro",
        mensagem: msg,
        tipo: "error",
        lida: false,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setCarregando(false);
    }
  };

  const sairEquipe = async () => {
    setCarregando(true);
    setErro(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/equipe/sair/${torneioId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok && res.status !== 400) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao sair da equipe");
      }

      setSelectedEquipeId(null);
      await fetchEquipes();

      mostrarToast({
        id_notificacao: Date.now().toString(),
        titulo: "👋 Saiu da dupla",
        mensagem: "Você saiu da sua dupla atual.",
        tipo: "info",
        lida: false,
        createdAt: new Date().toISOString(),
      });

      onSuccess?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setErro(msg);
      mostrarToast({
        id_notificacao: Date.now().toString(),
        titulo: "❌ Erro",
        mensagem: msg,
        tipo: "error",
        lida: false,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setCarregando(false);
    }
  };

  if (!isOpen) return null;

  const usuarioTemEquipe = equipes.some((eq) =>
    eq.membros.some((m) => m.id_usuario === usuarioId)
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          width: 400,
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong style={{ fontSize: 16 }}>Duplas do Torneio</strong>
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>
              ✕
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          {!usuarioTemEquipe && (
            <>
              {modoCriacao ? (
                <div style={{ marginBottom: 16 }}>
                  <input
                    type="text"
                    placeholder="Nome da nova dupla"
                    value={nomeNovaEquipe}
                    onChange={(e) => setNomeNovaEquipe(capitalizarPalavras(e.target.value))}
                    style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
                  />
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button
                      onClick={criarEquipe}
                      disabled={carregando}
                      style={{ background: "#16a34a", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 8 }}
                    >
                      {carregando ? "Criando..." : "Criar"}
                    </button>
                    <button
                      onClick={() => setModoCriacao(false)}
                      style={{ background: "transparent", border: "1px solid #ccc", padding: "6px 12px", borderRadius: 8 }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setModoCriacao(true)}
                  style={{ marginBottom: 16, padding: "8px 12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, width: "100%" }}
                >
                  + Criar nova dupla
                </button>
              )}
            </>
          )}

          {carregando && <p>Carregando...</p>}
          {erro && <p style={{ color: "red" }}>{erro}</p>}
          {!carregando && equipes.length === 0 && <p>Nenhuma dupla cadastrada ainda.</p>}

          {equipes.map((equipe) => {
            const estaNaEquipe = equipe.membros.some((m) => m.id_usuario === usuarioId);
            const equipeCheia = equipe.completa;
            const podeEntrar = !usuarioTemEquipe && !equipeCheia;

            return (
              <div
                key={equipe.id_equipe}
                style={{
                  border: estaNaEquipe ? "2px solid #16a34a" : "1px solid #e0e0e0",
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 12,
                  backgroundColor: estaNaEquipe ? "#f0fdf4" : "#fff",
                }}
              >
                <strong>{capitalizarPalavras(equipe.nome)}</strong>
                <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                  {equipe.membros.map((m) => capitalizarPalavras(m.nome)).join(" e ")}
                  {equipeCheia && " ✅ (cheia)"}
                  {estaNaEquipe && " (você está aqui)"}
                </div>
                {podeEntrar && (
                  <button
                    onClick={() => entrarEquipe(equipe.id_equipe)}
                    style={{ marginTop: 8, background: "#16a34a", color: "#fff", border: "none", padding: "4px 8px", borderRadius: 6 }}
                  >
                    Entrar nesta dupla
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {usuarioTemEquipe && (
          <div style={{ padding: 12, borderTop: "1px solid #f0f0f0" }}>
            <button
              onClick={sairEquipe}
              disabled={carregando}
              style={{ width: "100%", background: "#ef4444", color: "#fff", border: "none", padding: "10px", borderRadius: 8 }}
            >
              Sair da minha dupla
            </button>
          </div>
        )}
      </div>
    </div>
  );
}