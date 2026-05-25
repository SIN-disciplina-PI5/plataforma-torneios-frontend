'use client';

import type {
  ChangeEvent,
  FormEvent,
} from 'react';

import { SendHorizontal } from 'lucide-react';

interface ChatInputProps {
  input: string;
  onChange: (
    e: ChangeEvent<HTMLInputElement>
  ) => void;

  onSubmit: (
    e: FormEvent<HTMLFormElement>
  ) => void;

  isLoading: boolean;
}

const sugestoes = [
  'Ranking atual',
  'Quadras livres hoje',
  'Próximos torneios',
];

export function ChatInput({
  input,
  onChange,
  onSubmit,
  isLoading,
}: ChatInputProps) {
  const selecionarSugestao = (
    texto: string
  ) => {
    const evento = {
      target: {
        value: texto,
      },
    } as ChangeEvent<HTMLInputElement>;

    onChange(evento);
  };

  return (
    <div
      className="
        border-t border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-900
        p-3
      "
    >
      {/* Sugestões */}
      <div className="mb-3 flex flex-wrap gap-2">
        {sugestoes.map((sugestao) => (
          <button
            key={sugestao}
            type="button"
            onClick={() =>
              selecionarSugestao(
                sugestao
              )
            }
            disabled={isLoading}
            className="
              rounded-full
              border border-gray-200 dark:border-gray-700
              px-3 py-1.5
              text-xs
              text-gray-600 dark:text-gray-300
              transition-colors
              hover:bg-gray-100 dark:hover:bg-gray-800
              disabled:opacity-50
            "
          >
            {sugestao}
          </button>
        ))}
      </div>

      {/* Form */}
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={onChange}
          placeholder="Digite sua pergunta..."
          disabled={isLoading}
          className="
            flex-1
            rounded-xl
            border border-gray-200 dark:border-gray-700
            bg-transparent
            px-4 py-3
            text-sm
            text-gray-900 dark:text-white
            placeholder:text-gray-400
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            disabled:opacity-50
          "
        />

        <button
          type="submit"
          disabled={
            isLoading ||
            !input.trim()
          }
          className="
            flex h-11 w-11
            items-center justify-center
            rounded-xl
            bg-green-600
            text-white
            transition-all
            hover:bg-green-700
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
          aria-label="Enviar mensagem"
        >
          <SendHorizontal size={18} />
        </button>
      </form>
    </div>
  );
}