"use client";

import { useState } from "react";

type Player = {
  id: number;
  name: string;
  avatar?: string;
};

type Dupla = {
  id: number;
  players: [Player | null, Player | null];
};

const MOCK_PLAYERS: Player[] = [
  { id: 1, name: "Kaiki Bezerra" },
  { id: 2, name: "Beatriz Martins" },
  { id: 3, name: "Mel Lopes" },
  { id: 4, name: "Márcio bueno" },
  { id: 5, name: "Iago Richard" },
  { id: 6, name: "Gabriel Santos" },
  { id: 7, name: "Mel Lopes" },
];

const MOCK_DUPLAS: Dupla[] = [
  {
    id: 1,
    players: [
      { id: 1, name: "Kaiki Bezerra" },
      { id: 2, name: "Beatriz Martins" },
    ],
  },
  {
    id: 2,
    players: [
      { id: 3, name: "Mel Lopes" },
      { id: 4, name: "Márcio bueno" },
    ],
  },
  {
    id: 3,
    players: [
      { id: 5, name: "Iago Richard" },
      { id: 6, name: "Gabriel Santos" },
    ],
  },
  { id: 4, players: [{ id: 7, name: "Mel Lopes" }, null] },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: "#e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.33,
        fontWeight: 500,
        color: "#6b7280",
        flexShrink: 0,
      }}
    >
      {getInitials(name)}
    </div>
  );
}

function EmptySlot({ onAdd }: { onAdd: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onAdd();
      }}
      aria-label="Adicionar jogador à dupla"
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        border: "1.5px dashed #d1d5db",
        background: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#9ca3af",
        fontSize: 20,
        flexShrink: 0,
        transition: "border-color 0.15s, color 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "#6b7280";
        (e.currentTarget as HTMLButtonElement).style.color = "#374151";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "#d1d5db";
        (e.currentTarget as HTMLButtonElement).style.color = "#9ca3af";
      }}
    >
      +
    </button>
  );
}

type DuplasModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectDupla?: (dupla: Dupla) => void;
  onAddPlayerToDupla?: (duplaId: number) => void;
  onCreateDupla?: (searchQuery: string) => void;
  onLeave?: () => void;
  currentDuplaId?: number | null;
};

export function DuplasModal({
  isOpen = true,
  onClose,
  onSelectDupla,
  onAddPlayerToDupla,
  onCreateDupla,
  onLeave,
  currentDuplaId = null,
}: DuplasModalProps) {
  const [search, setSearch] = useState("");
  const [selectedDuplaId, setSelectedDuplaId] = useState<number | null>(
    currentDuplaId,
  );

  const filtered = MOCK_DUPLAS.filter((d) =>
    d.players.some(
      (p) => p && p.name.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  // Só marca visualmente, não avança o fluxo
  const handleSelect = (dupla: Dupla) => {
    setSelectedDuplaId(dupla.id);
  };

  const handleCreate = () => {
    onCreateDupla?.(search);
  };

  // Botão "Entrar na dupla" — só aqui avança para confirmação
  const handleEnter = () => {
    const dupla = MOCK_DUPLAS.find((d) => d.id === selectedDuplaId);
    if (!dupla) return;
    onSelectDupla?.(dupla);
  };

  const handleLeave = () => {
    setSelectedDuplaId(null);
    onLeave?.();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.25)",
        zIndex: 50,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Duplas"
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          width: 360,
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px 12px",
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 16, color: "#111827" }}>
            Duplas
          </span>
          <button
            onClick={onClose}
            aria-label="Fechar modal"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9ca3af",
              fontSize: 20,
              lineHeight: 1,
              padding: 4,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "#374151")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "#9ca3af")
            }
          >
            ✕
          </button>
        </div>

        {/* Search + Create */}
        <div style={{ display: "flex", gap: 8, padding: "12px 16px" }}>
          <input
            type="text"
            placeholder="Buscar jogador"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              height: 38,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              padding: "0 12px",
              fontSize: 14,
              color: "#111827",
              outline: "none",
              backgroundColor: "#fafafa",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) =>
              ((e.currentTarget as HTMLInputElement).style.borderColor =
                "#6b7280")
            }
            onBlur={(e) =>
              ((e.currentTarget as HTMLInputElement).style.borderColor =
                "#e5e7eb")
            }
          />
          <button
            onClick={handleCreate}
            style={{
              height: 38,
              padding: "0 14px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              backgroundColor: "#f9fafb",
              fontSize: 13,
              fontWeight: 500,
              color: "#374151",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#f3f4f6")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#f9fafb")
            }
          >
            Criar Dupla
          </button>
        </div>

        {/* List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 16px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {filtered.length === 0 && (
            <p
              style={{
                textAlign: "center",
                color: "#9ca3af",
                fontSize: 14,
                padding: "24px 0",
              }}
            >
              Nenhuma dupla encontrada
            </p>
          )}

          {filtered.map((dupla) => {
            const isSelected = selectedDuplaId === dupla.id;
            const [p1, p2] = dupla.players;
            const isIncomplete = !p1 || !p2;
            const isComplete = p1 !== null && p2 !== null;
            const isDisabled = isComplete && !isSelected;

            return (
              <button
                key={dupla.id}
                onClick={() => !isDisabled && handleSelect(dupla)}
                aria-pressed={isSelected}
                disabled={isDisabled}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: isSelected
                    ? "1.5px solid #374151"
                    : "1.5px solid #e5e7eb",
                  backgroundColor: isSelected
                    ? "#f9fafb"
                    : isDisabled
                      ? "#fafafa"
                      : "#fff",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  opacity: isDisabled ? 0.45 : 1,
                  textAlign: "left",
                  transition: "border-color 0.15s, background-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected && !isDisabled) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "#9ca3af";
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "#f9fafb";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected && !isDisabled) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "#e5e7eb";
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "#fff";
                  }
                }}
              >
                {/* Player 1 */}
                {p1 ? (
                  <Avatar name={p1.name} />
                ) : (
                  <EmptySlot onAdd={() => onAddPlayerToDupla?.(dupla.id)} />
                )}
                <span
                  style={{
                    fontSize: 14,
                    color: "#374151",
                    fontWeight: 400,
                    minWidth: 90,
                  }}
                >
                  {p1?.name ?? (
                    <span style={{ color: "#d1d5db", fontStyle: "italic" }}>
                      vazio
                    </span>
                  )}
                </span>

                {/* Divider */}
                <div style={{ flex: 1 }} />

                {/* Player 2 or Add button */}
                {isIncomplete && !p2 ? (
                  <EmptySlot onAdd={() => onAddPlayerToDupla?.(dupla.id)} />
                ) : p2 ? (
                  <>
                    <Avatar name={p2.name} />
                    <span style={{ fontSize: 14, color: "#374151" }}>
                      {p2.name}
                    </span>
                  </>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 16px 16px",
            borderTop: "1px solid #f3f4f6",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {/* Botão principal — avança para confirmação */}
          <button
            onClick={handleEnter}
            disabled={selectedDuplaId === null}
            style={{
              width: "100%",
              height: 42,
              borderRadius: 10,
              border: "none",
              backgroundColor: selectedDuplaId !== null ? "#16a34a" : "#f3f4f6",
              fontSize: 14,
              fontWeight: 500,
              color: selectedDuplaId !== null ? "#fff" : "#9ca3af",
              cursor: selectedDuplaId !== null ? "pointer" : "not-allowed",
              transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) => {
              if (selectedDuplaId !== null)
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#15803d";
            }}
            onMouseLeave={(e) => {
              if (selectedDuplaId !== null)
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#16a34a";
            }}
          >
            Entrar na dupla
          </button>

          {/* Botão secundário — sair da dupla atual */}
          <button
            onClick={handleLeave}
            style={{
              width: "100%",
              height: 38,
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              backgroundColor: "transparent",
              fontSize: 13,
              fontWeight: 400,
              color: "#9ca3af",
              cursor: "pointer",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#374151";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#9ca3af";
            }}
          >
            Sair da dupla
          </button>
        </div>
      </div>
    </div>
  );
}
