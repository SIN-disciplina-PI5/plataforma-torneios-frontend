'use client';

import { useEffect, useRef } from 'react';
import type { UIMessage } from 'ai';
import ReactMarkdown from 'react-markdown';

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
    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 p-4 space-y-4">
      {todasMensagens.map((message) => {
        const isUser = message.role === 'user';

        return (
          <div
            key={message.id}
            className={`flex ${
              isUser ? 'justify-end' : 'justify-start'
            }`}
          >
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
                ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm'
                }
              `}
            >
              {message.parts?.map((part, index) => {
                // TEXTO
                if (part.type === 'text') {
                  return (
                    <div
                      key={index}
                      className="prose prose-sm dark:prose-invert max-w-none"
                    >
                      <ReactMarkdown>
                        {part.text}
                      </ReactMarkdown>
                    </div>
                  );
                }

                // TOOL
                if (part.type.startsWith('tool-')) {
                  const toolName = part.type.replace(
                    'tool-',
                    ''
                  );

                  return (
                    <div
                      key={index}
                      className="mt-3"
                    >
                      <span
                        className="
                          inline-flex items-center
                          rounded-full
                          px-2 py-1
                          text-xs
                          font-medium
                          bg-amber-100
                          text-amber-700
                          dark:bg-amber-900
                          dark:text-amber-300
                        "
                      >
                        {toolName ===
                        'consultarBancoDeDados'
                          ? '🗄️ Banco de dados'
                          : '📚 Base de conhecimento'}
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

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-start">
          <div
            className="
              flex items-center gap-1
              rounded-2xl rounded-bl-sm
              bg-gray-100 dark:bg-gray-800
              px-4 py-3
            "
          >
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className="
                  h-2 w-2
                  rounded-full
                  bg-gray-400
                  animate-bounce
                "
                style={{
                  animationDelay: `${delay}ms`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}