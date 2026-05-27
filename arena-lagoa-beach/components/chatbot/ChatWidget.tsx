"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { UIMessage } from "ai";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

export function ChatWidget() {
  const [mounted, setMounted]     = useState(false);
  const [aberto, setAberto]       = useState(false);
  const [input, setInput]         = useState("");
  const [messages, setMessages]   = useState<UIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sessionId = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evita render no SSR (Next.js server component)
  if (!mounted) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const texto = input.trim();
    if (!texto || isLoading) return;

    setIsLoading(true);
    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        id:    crypto.randomUUID(),
        role:  "user",
        parts: [{ type: "text", text: texto }],
      },
    ]);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Sessão expirada. Faça login novamente.");

      // ✅ Chama a API Route interna do Next.js — nunca a FastAPI diretamente
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({
          pergunta:   texto,
          session_id: sessionId.current,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? `Erro ${response.status}`);
      }

      setMessages((prev) => [
        ...prev,
        {
          id:    crypto.randomUUID(),
          role:  "assistant",
          parts: [{ type: "text", text: data.resposta ?? "Sem resposta do servidor." }],
        },
      ]);
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Não foi possível conectar ao servidor.";
      console.error("[ChatWidget]", msg);
      setMessages((prev) => [
        ...prev,
        {
          id:    crypto.randomUUID(),
          role:  "assistant",
          parts: [{ type: "text", text: `⚠️ ${msg}` }],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {aberto && (
        <div className="fixed bottom-20 right-4 z-50 flex h-[520px] w-80 flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between bg-green-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Image
                src="/BolaChatBot.svg"
                alt="Assistente Arena"
                width={24}
                height={24}
                className="object-contain"
              />
              <div>
                <p className="text-sm font-semibold">Assistente Arena</p>
                <p className="text-xs opacity-75">Online agora</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAberto(false)}
              className="text-xl leading-none text-white/80 hover:text-white"
            >
              ×
            </button>
          </div>

          <ChatMessages messages={messages} isLoading={isLoading} />

          <ChatInput
            input={input}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Botão flutuante */}
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-green-800"
        aria-label="Abrir assistente"
      >
        {aberto ? (
          <span className="text-2xl leading-none">×</span>
        ) : (
          <Image
            src="/BolaChatBot.svg"
            alt="Abrir assistente"
            width={30}
            height={30}
            className="object-contain"
          />
        )}
      </button>
    </>
  );
}