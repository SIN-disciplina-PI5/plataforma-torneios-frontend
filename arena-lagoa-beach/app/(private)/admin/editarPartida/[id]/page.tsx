'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from "next/image";
import { ShieldCheck } from 'lucide-react';

const fases = ['Eliminatórias', 'Oitavas', 'Quartas', 'Semifinal', 'Final'];

export default function EditarPartida() {
  const { id } = useParams();

  const [faseAtiva, setFaseAtiva] = useState('Eliminatórias');
  const [partida, setPartida] = useState<any>(null);
 
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [placar, setPlacar] = useState({ a: 0, b: 0 });
  const [vencedor, setVencedor] = useState<number | null>(null);

  // 🔹 BUSCAR PARTIDA
  useEffect(() => {
    async function fetchPartida() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/partidas/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const json = await res.json();
      console.log('PARTIDA BACK:', json);

      const p = json.data;
      setPartida(p);

      if (p.horario) {
        const date = new Date(p.horario);
        setData(date.toISOString().split('T')[0]);
        setHora(date.toTimeString().slice(0, 5));
      }

      if (p.placar) setPlacar(p.placar);
      if (p.vencedor_id) setVencedor(p.vencedor_id);
    }

    if (id) fetchPartida();
  }, [id]);

  //  SALVAR
  async function handleSalvar() {
    try {
      // AGENDAR
      if (data && hora) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/partidas/agendar/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            horario: `${data}T${hora}:00`,
          }),
        });
      } //  FECHADO CORRETAMENTE

      // FINALIZAR (sempre executa)
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/partidas/finalizar/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          placar,
          vencedor_id: vencedor,
        }),
      });

      alert('Partida atualizada!');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar');
    }
  }

  if (!partida) return <p className="p-8">Carregando...</p>;

  return (
    <div className="min-h-screen bg-[#ffff] text-[#2d2d2d] flex width-full">
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
              Editar Partida
            </h1>
          </div>

          {/* FASE */}
          <section className="mb-10">
            <h2 className="text-[32px] font-semibold mb-6">Fase</h2>

            <div className="border-b flex gap-10 overflow-x-auto">
              {fases.map((fase) => (
                <button
                  key={fase}
                  onClick={() => setFaseAtiva(fase)}
                  className={`pb-3 ${
                    faseAtiva === fase ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {fase}
                </button>
              ))}
            </div>
          </section>

          {/* FORM */}
          <section>
            <div className="grid xl:grid-cols-2 gap-8">

              {/* ESQUERDA */}
              <div className="space-y-6">
                <FormField label="Data da Partida">
                  <input
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="input"
                  />
                </FormField>

                <FormField label="Horário">
                  <input
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    className="input"
                  />
                </FormField>

                <div>
                  <p className="font-semibold mb-3">
                    Resultado Final
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      value={placar.a}
                      onChange={(e) =>
                        setPlacar({ ...placar, a: Number(e.target.value) })
                      }
                      className="input text-center"
                    />
                    <input
                      type="number"
                      value={placar.b}
                      onChange={(e) =>
                        setPlacar({ ...placar, b: Number(e.target.value) })
                      }
                      className="input text-center"
                    />
                  </div>
                </div>
              </div>

              {/* DIREITA */}
              <div>
                <p className="font-semibold mb-4">
                  Dupla Vencedora
                </p>

                <div className="space-y-4">
                  {[1, 2].map((num) => (
                    <button
                      key={num}
                      onClick={() => setVencedor(num)}
                      className={`w-full flex justify-between p-4 border rounded-xl ${
                        vencedor === num ? 'bg-green-500 text-white' : ''
                      }`}
                    >
                      Dupla {num}
                      {vencedor === num && <ShieldCheck size={16} />}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSalvar}
                  className="mt-8 h-12 px-8 rounded-xl bg-green-600 text-white"
                >
                  Salvar Alterações
                </button>
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
      <label className="block font-semibold mb-2">{label}</label>
      {children}
    </div>
  );
}