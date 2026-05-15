'use client';

import { useState } from 'react';
import Image from "next/image";
import { ShieldCheck } from 'lucide-react';

const fases = ['Eliminatórias', 'Oitavas', 'Quartas', 'Semifinal', 'Final'];

const duplas = [
  {
    titulo: 'Dupla 1',
    scoreA: '3',
    scoreB: '3',
    vencedor: true,
    jogadores: [
      { nome: 'Kawe Doe', avatar: 'https://i.pravatar.cc/100?img=12' },
      { nome: 'Julia Silva', avatar: 'https://i.pravatar.cc/100?img=32' },
    ],
  },
  {
    titulo: 'Dupla 2',
    scoreA: '3',
    scoreB: '3',
    vencedor: false,
    jogadores: [
      { nome: 'Karen Doe', avatar: 'https://i.pravatar.cc/100?img=47' },
      { nome: 'Alda Silva', avatar: 'https://i.pravatar.cc/100?img=20' },
    ],
  },
];

export default function CriarPartidaPage() {
  const [faseAtiva, setFaseAtiva] = useState('Eliminatórias');

  //  NOVOS ESTADOS (SEM ALTERAR UI)
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [loading, setLoading] = useState(false);


  //  FUNÇÃO DE CRIAR
  async function handleCriar() {
    try {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/partidas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          id_torneio: 1, // ⚠️ ajustar depois
          fase: faseAtiva,
          status: 'PENDENTE',
          horario: data && hora ? `${data}T${hora}:00` : null,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || 'Erro ao criar partida');
        return;
      }

      alert('Partida criada com sucesso!');

    } catch (err) {
      console.error(err);
      alert('Erro na requisição');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fffff] text-[#2d2d2d] flex width-full">
      <div className="flex-1 flex flex-col">
        <main>

          {/* TÍTULO */}
          <div className="flex items-center gap-3 mb-10">
            <Image
              src="/variante-de-bola-de-futebol.png"
              alt="Bola de futebol"
              width={40}
              height={40}
            />
            <h1 className="text-[28px] font-semibold text-[#2b2b2b]">
              Criar Partida
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
                        ? 'text-[green] font-medium'
                        : 'text-[#a1a1a1] hover:text-[#6f6f6f]'
                    }`}
                  >
                    {fase}
                    {ativa && (
                      <span className="absolute left-0 bottom-1px h-3px w-full rounded-full bg-[#2faa2f]" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* FORM */}
          <section className="max-w-920px">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

              {/* ESQUERDA */}
              <div className="space-y-6">
                <FormField label="Data da Partida">
                  <input
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="w-full h-12 rounded-xl border border-[#dddddd] bg-white px-4 text-sm outline-none focus:border-[#316f27]"
                  />
                </FormField>

                <FormField label="Horário">
                  <input
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    className="w-full h-12 rounded-xl border border-[#dddddd] bg-white px-4 text-sm outline-none focus:border-[#316f27]"
                  />
                </FormField>

                {/* UI mantida intacta */}
                <div>
                  <p className="text-[15px] font-semibold text-[#3a3a3a] mb-3">
                    Resultado Final da Partida
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {duplas.map((dupla) => (
                      <div key={dupla.titulo} className="bg-white border rounded-2xl p-4">
                        <p className="text-sm font-medium mb-3">{dupla.titulo}</p>

                        <div className="flex gap-3">
                          <input type="number" defaultValue={dupla.scoreA} className="input text-center"/>
                          <input type="number" defaultValue={dupla.scoreB} className="input text-center"/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* DIREITA */}
              <div>
                <p className="text-[15px] font-semibold mb-4">
                  Dupla Vencedora
                </p>

                <div className="space-y-4">
                  {duplas.map((dupla) => (
                    <div key={dupla.titulo} className="bg-white border rounded-2xl px-5 py-4 flex justify-between">
                      <div>
                        <p className="text-sm font-semibold mb-3">{dupla.titulo}</p>

                        <div className="flex gap-5">
                          {dupla.jogadores.map((jogador) => (
                            <div key={jogador.nome} className="flex gap-3">
                              <img src={jogador.avatar} className="w-10 h-10 rounded-full"/>
                              <span>{jogador.nome}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button className="w-7 h-7 border flex items-center justify-center">
                        <ShieldCheck size={15} />
                      </button>
                    </div>
                  ))}
                </div>

                {/*  BOTÃO CONECTADO */}
                <div className="mt-8">
                  <button
                    onClick={handleCriar}
                    disabled={loading}
                    className="h-12 px-8 rounded-xl bg-[#2faa2f] text-white font-medium hover:bg-[#289828] transition shadow-sm"
                  >
                    {loading ? 'Criando...' : 'Criar'}
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

function FormField({ label, children }: any) {
  return (
    <div>
      <label className="block text-[15px] font-semibold mb-3">
        {label}
      </label>
      {children}
    </div>
  );
}