"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import type { UIMessage } from "ai";

import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

export function ChatWidget() {
  const [mounted, setMounted]           = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [aberto, setAberto]             = useState(false);
  const [input, setInput]               = useState("");
  const [messages, setMessages]         = useState<UIMessage[]>([]);
  const [isLoading, setIsLoading]       = useState(false);

  // session_id fixo por aba — gerado uma vez e mantido na ref
  const sessionId = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    setAuthenticated(!!token);
  }, []);

  if (!mounted)       return null;
  if (!authenticated) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const currentInput = input;
    setInput("");

    const userMessage: UIMessage = {
      id:    crypto.randomUUID(),
      role:  "user",
      parts: [{ type: "text", text: currentInput }],
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Pega o token salvo pelo login
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado");

      const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          pergunta:   currentInput,
          session_id: sessionId.current,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }

      const data       = await response.json();
      const respostaIA = data?.resposta ?? "Sem resposta do servidor.";

      const assistantMessage: UIMessage = {
        id:    crypto.randomUUID(),
        role:  "assistant",
        parts: [{ type: "text", text: respostaIA }],
      };
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);

      const errorMessage: UIMessage = {
        id:    crypto.randomUUID(),
        role:  "assistant",
        parts: [{ type: "text", text: "Não foi possível conectar ao servidor." }],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {aberto && (
        <div
          className="
            fixed bottom-20 right-4 z-50
            flex h-[520px] w-80 flex-col
            overflow-hidden rounded-2xl
            border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-900
            shadow-2xl sm:w-96
          "
        >
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
        className="
          fixed bottom-4 right-4 z-50
          flex h-14 w-14 items-center justify-center
          rounded-full bg-green-600 text-white shadow-lg
          transition-transform hover:scale-105 hover:bg-green-800
        "
        aria-label=""
      >
        {aberto ? (
          "×"
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