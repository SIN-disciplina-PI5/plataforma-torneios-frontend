'use client';

import type {
  ChangeEvent,
  FormEvent,
  RefObject,
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
  inputRef?: RefObject<HTMLInputElement | null>;
}

const sugestoes = [
  'Minha próxima partida',
  'Próximos torneios',
  'Torneios que estou inscrito',
];

export function ChatInput({
  input,
  onChange,
  onSubmit,
  isLoading,
  inputRef,
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
      {/* Sugestões com animação cascata */}
      <div className="mb-3 flex flex-wrap gap-2">
        {sugestoes.map((sugestao, idx) => (
          <button
            key={sugestao}
            type="button"
            onClick={() =>
              selecionarSugestao(sugestao)
            }
            disabled={isLoading}
            className="
              rounded-full
              border border-gray-200 dark:border-gray-700
              px-3 py-1.5
              text-xs
              text-gray-600 dark:text-gray-300
              transition-all
              duration-200
              hover:bg-gray-100 dark:hover:bg-gray-800
              hover:scale-105
              active:scale-95
              disabled:opacity-50 disabled:hover:scale-100
              animate-in fade-in slide-in-from-bottom-2
            "
            style={{ animationDelay: `${idx * 50}ms` }}
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
          ref={inputRef}
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
            transition-all
            duration-200
            focus:outline-none
            focus:ring-1
            focus:ring-gray-500/50
            focus:border-green-500
            hover:border-gray-300 dark:hover:border-gray-600
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
            relative
            overflow-hidden
            flex h-11 w-11
            items-center justify-center
            rounded-xl
            bg-green-600
            text-white
            transition-all
            duration-200
            hover:bg-green-700
            hover:scale-105
            active:scale-95
            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:hover:scale-100
            group
          "
          aria-label="Enviar mensagem"
        >
          <SendHorizontal 
            size={18} 
            className="relative z-10 transition-transform duration-200 group-hover:rotate-12" 
          />
          {/* Efeito ripple */}
          <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
        </button>
      </form>
    </div>
  );
}