'use client';

import { useState } from 'react';
import {
  ShieldCheck,
  CircleDot,
} from 'lucide-react';

const fases = ['Eliminatórias', 'Oitavas', 'Quartas', 'Semifinal', 'Final'];


// DADOS MOCKADOS - SUBSTITUIR PELO RETORNO DA API!!!
const duplas = [
  {
    titulo: 'Dupla 1',
    scoreA: '3',
    scoreB: '3',
    vencedor: true,
    jogadores: [
      {
        nome: 'Kawe Doe',
        avatar: 'https://i.pravatar.cc/100?img=12',
      },
      {
        nome: 'Julia Silva',
        avatar: 'https://i.pravatar.cc/100?img=32',
      },
    ],
  },
  {
    titulo: 'Dupla 2',
    scoreA: '3',
    scoreB: '3',
    vencedor: false,
    jogadores: [
      {
        nome: 'Karen Doe',
        avatar: 'https://i.pravatar.cc/100?img=47',
      },
      {
        nome: 'Alda Silva',
        avatar: 'https://i.pravatar.cc/100?img=20',
      },
    ],
  },
];

export default function EditarPartidaPage() {
  const [faseAtiva, setFaseAtiva] = useState('Eliminatórias');

  return (
    <div className="min-h-screen bg-[#f6f6f4] text-[#2d2d2d] flex width-full">
    
      {/* CONTEÚDO */}
      <div className="flex-1 flex flex-col">
      
        {/* MAIN */}
        <main >
          {/* TÍTULO */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-6 h-6 rounded-full border border-[#cfcfcf] flex items-center justify-center">
              <CircleDot size={13} className="text-[#7f7f7f]" />
            </div>
            <h1 className="text-[28px] font-semibold text-[#2b2b2b]">
              Editar Partida
            </h1>
          </div>

          {/* FASE */}
          <section className="mb-10">
            <h2 className="text-[32px] font-semibold text-[#2f2f2f] mb-6">Fase</h2>

            <div className="border-b border-[#d8d8d8] flex items-end gap-10 overflow-x-auto">
              {fases.map((fase) => {
                const ativa = faseAtiva === fase;

                return (
                  <button
                    key={fase}
                    onClick={() => setFaseAtiva(fase)}
                    className={`relative pb-3 text-[14px] whitespace-nowrap transition ${
                      ativa
                        ? 'text-[#2b2b2b] font-medium'
                        : 'text-[#a1a1a1] hover:text-[#6f6f6f]'
                    }`}
                  >
                    {fase}
                    {ativa && (
                      <span className="absolute left-0 bottom-[-1px] h-[3px] w-full rounded-full bg-[#2faa2f]" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* FORM */}
          <section className="max-w-[920px]">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* COLUNA ESQUERDA */}
              <div className="space-y-6">
                <FormField label="Data da Partida">
                  <input
                    type="date"
                    defaultValue="2025-09-12"
                    className="w-full h-12 rounded-xl border border-[#dddddd] bg-white px-4 text-sm outline-none focus:border-[#316f27]"
                  />
                </FormField>

                <FormField label="Horário">
                  <input
                    type="time"
                    defaultValue="13:30"
                    className="w-full h-12 rounded-xl border border-[#dddddd] bg-white px-4 text-sm outline-none focus:border-[#316f27]"
                  />
                </FormField>

                <div>
                  <p className="text-[15px] font-semibold text-[#3a3a3a] mb-3">
                    Resultado Final da Partida
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {duplas.map((dupla) => (
                      <div
                        key={dupla.titulo}
                        className="bg-white border border-[#e3e3e3] rounded-2xl p-4"
                      >
                        <p className="text-sm font-medium text-[#6a6a6a] mb-3">
                          {dupla.titulo}
                        </p>

                        <div className="flex gap-3">
                          <input
                            type="number"
                            defaultValue={dupla.scoreA}
                            className="w-full h-12 rounded-xl border border-[#dddddd] bg-[#fafafa] px-4 text-center text-lg outline-none focus:border-[#316f27]"
                          />
                          <input
                            type="number"
                            defaultValue={dupla.scoreB}
                            className="w-full h-12 rounded-xl border border-[#dddddd] bg-[#fafafa] px-4 text-center text-lg outline-none focus:border-[#316f27]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* COLUNA DIREITA */}
              <div className="margin-top-6 xl:margin-top-0">
                <p className="text-[15px] font-semibold text-[#3a3a3a] mb-4">
                  Dupla Vencedora
                </p>

                <div className="space-y-4">
                  {duplas.map((dupla) => (
                    <div
                      key={dupla.titulo}
                      className="bg-white border border-[#e3e3e3] rounded-2xl px-5 py-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#525252] mb-3">
                          {dupla.titulo}
                        </p>

                        <div className="flex items-center gap-5">
                          {dupla.jogadores.map((jogador) => (
                            <div
                              key={jogador.nome}
                              className="flex items-center gap-3"
                            >
                              <img  
                                src={jogador.avatar}
                                alt={jogador.nome}
                                className="w-10 h-10 rounded-full object-cover border border-[#d9d9d9]"
                              />
                              <span className="text-sm text-[#4b4b4b]">
                                {jogador.nome}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        className={`w-7 h-7 rounded-md border flex items-center justify-center transition ${
                          dupla.vencedor
                            ? 'bg-[#2faa2f] border-[#2faa2f] text-white'
                            : 'bg-white border-[#d9d9d9] text-transparent hover:border-[#316f27]'
                        }`}
                      >
                        <ShieldCheck size={15} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <button className="h-12 px-8 rounded-xl bg-[#2faa2f] text-white font-medium hover:bg-[#289828] transition shadow-sm">
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[15px] font-semibold text-[#3a3a3a] mb-3">
        {label}
      </label>
      {children}
    </div>
  );
}

