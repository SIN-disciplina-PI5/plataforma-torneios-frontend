'use client';

import { useEffect, useRef } from 'react';
import type { UIMessage } from 'ai';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

interface ChatMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
}

export function ChatMessages({
  messages,
  isLoading,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages, isLoading]);

  // Mensagem inicial
  const todasMensagens: UIMessage[] =
    messages.length === 0
      ? [
          {
            id: 'welcome',
            role: 'assistant',
            parts: [
              {
                type: 'text',
                text:
                  'Olá! 👋 Posso te ajudar com torneios, rankings, quadras disponíveis e dúvidas da Arena Lagoa Beach.',
              },
            ],
          } as UIMessage,
        ]
      : messages;

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 p-4 space-y-4 custom-scrollbar">
      {todasMensagens.map((message, index) => {
        const isUser = message.role === 'user';

        return (
          <div
            key={message.id}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Avatar do assistente */}
            {!isUser && (
              <div className="flex-shrink-0 mr-2 mt-1">
                <div className="h-6 w-6 rounded-full flex items-center justify-center">
                  <Image
                    src="/BolaChatBot.svg"
                    alt="Assistente Arena"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
              </div>
            )}
            
            <div
              className={`
                max-w-[85%]
                rounded-2xl
                px-4
                py-3
                text-sm
                shadow-sm
                whitespace-pre-wrap
                break-words
                transition-all
                duration-200
                hover:shadow-md
                ${
                  isUser
                    ? 'bg-green-600 text-white rounded-br-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm'
                }
              `}
            >
              {message.parts?.map((part, partIndex) => {
                // TEXTO
                if (part.type === 'text') {
                  return (
                    <div
                      key={partIndex}
                      className="prose prose-sm dark:prose-invert max-w-none"
                    >
                      <ReactMarkdown>
                        {part.text}
                      </ReactMarkdown>
                    </div>
                  );
                }

                // TOOL com animação (sem ícone)
                if (part.type.startsWith('tool-')) {
                  const toolName = part.type.replace('tool-', '');
                  
                  const toolConfig: Record<string, string> = {
                    consultarBancoDeDados: 'Consultando banco de dados',
                    buscarTorneios: 'Buscando torneios',
                    buscarRankings: 'Buscando rankings',
                  };
                  
                  const label = toolConfig[toolName] || toolName;

                  return (
                    <div key={partIndex} className="mt-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900 dark:text-amber-300 animate-pulse">
                        {label}
                      </span>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        );
      })}

      {/* Loading com animação de digitação */}
      {isLoading && (
        <div className="flex justify-start animate-in fade-in duration-200">
          <div className="flex-shrink-0 mr-2 mt-1">
            <div className="h-6 w-6 rounded-full flex items-center justify-center">
              <Image
                src="/BolaChatBot.svg"
                alt="Assistente Arena"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
          </div>
          <div className="rounded-2xl rounded-bl-sm bg-gray-100 dark:bg-gray-800 px-4 py-3">
            <div className="flex items-center gap-1.5">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}