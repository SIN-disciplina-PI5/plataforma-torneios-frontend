'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

type Placar = {
  a: number;
  b: number;
};

type Partida = {
  id_partida: number;
  id_torneio: number | string;
  torneio: string | null;
  fase: string;
  status: string;
  horario: string | null;
  placar: Placar | null;
  vencedor_id: number | null;
  resultado: string | null;
};

type ApiPartidaResponse = {
  data?: Partida;
  error?: string;
};

type ApiErrorResponse = {
  error?: string;
};

const fases = ['Oitavas de Finais', 'Quartas de Finais', 'Semifinais', 'Finais', 'Eliminatórias'];

const duplas = [
  {
    id: 1,
    titulo: 'Dupla 1',
    jogadores: [
      { nome: 'Karen Den', avatar: 'https://i.pravatar.cc/100?img=12' },
      { nome: 'Julia Silva', avatar: 'https://i.pravatar.cc/100?img=32' },
    ],
  },
  {
    id: 2,
    titulo: 'Dupla 2',
    jogadores: [
      { nome: 'Marcio lima', avatar: 'https://i.pravatar.cc/100?img=47' },
      { nome: 'Homer Cidio', avatar: 'https://i.pravatar.cc/100?img=20' },
    ],
  },
];

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL;

function getParamId(id: string | string[] | undefined) {
  return Array.isArray(id) ? id[0] : id;
}

function parsePlacar(placar: Partida['placar']): Placar {
  if (!placar) return { a: 0, b: 0 };
  return {
    a: Number(placar.a || 0),
    b: Number(placar.b || 0),
  };
}

function getDateTimeParts(horario: string | null) {
  if (!horario) return { data: '', hora: '' };

  const date = new Date(horario);

  if (Number.isNaN(date.getTime())) {
    return { data: '', hora: '' };
  }

  return {
    data: date.toISOString().split('T')[0],
    hora: date.toTimeString().slice(0, 5),
  };
}

export default function EditarPartida() {
  const router = useRouter();
  const { id } = useParams();
  const partidaId = getParamId(id);

  const [faseAtiva, setFaseAtiva] = useState(fases[0]);
  const [partida, setPartida] = useState<Partida | null>(null);
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [placar, setPlacar] = useState<Placar>({ a: 0, b: 0 });
  const [vencedor, setVencedor] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPartida() {
      try {
        const apiUrl = getApiUrl();
        const token = localStorage.getItem('token');

        if (!apiUrl) {
          throw new Error('NEXT_PUBLIC_API_URL não está configurada');
        }

        const res = await fetch(`${apiUrl}/api/partidas/${partidaId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = (await res.json()) as ApiPartidaResponse;

        if (!res.ok || !json.data) {
          throw new Error(json.error || 'Erro ao buscar partida');
        }

        const dadosPartida = json.data;
        const horario = getDateTimeParts(dadosPartida.horario);

        setPartida(dadosPartida);
        setFaseAtiva(dadosPartida.fase || fases[0]);
        setData(horario.data);
        setHora(horario.hora);
        setPlacar(parsePlacar(dadosPartida.placar));
        setVencedor(dadosPartida.vencedor_id);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao buscar partida';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    if (partidaId) fetchPartida();
  }, [partidaId]);

  async function handleSalvar() {
    if (!partida || !partidaId) return;

    try {
      setSaving(true);
      setError('');

      const apiUrl = getApiUrl();
      const token = localStorage.getItem('token');

      if (!apiUrl) {
          throw new Error('NEXT_PUBLIC_API_URL não está configurada');
      }

      const horario = data && hora ? `${data}T${hora}:00` : null;
      const res = await fetch(`${apiUrl}/api/partidas/${partidaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fase: faseAtiva,
          horario,
          placar,
          vencedor_id: vencedor,
          resultado: vencedor ? `${duplas.find((dupla) => dupla.id === vencedor)?.titulo} vencedora` : partida.resultado,
          status: vencedor ? 'FINALIZADA' : partida.status,
        }),
      });

      const json = (await res.json()) as ApiPartidaResponse & ApiErrorResponse;

      if (!res.ok) {
        throw new Error(json.error || 'Erro ao salvar partida');
      }

      router.push('/admin/partidas');
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar partida';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-8">Carregando...</p>;

  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <main className="w-full max-w-[610px] px-6 pt-1 pb-8">
        <div className="mb-7 flex items-center gap-2">
          <Image
            src="/variante-de-bola-de-futebol.png"
            alt="Bola de futebol"
            width={18}
            height={18}
          />
          <h1 className="text-[20px] font-bold leading-none">
            Editar Partida
          </h1>
        </div>

        <section className="mb-5">
          <div className="flex items-end gap-8 border-b border-[#dddddd] overflow-x-auto">
            {fases.map((fase) => {
              const ativa = faseAtiva === fase;

              return (
                <button
                  key={fase}
                  type="button"
                  onClick={() => setFaseAtiva(fase)}
                  className={`relative pb-3 text-[11px] whitespace-nowrap transition ${
                    ativa ? 'text-black' : 'text-[#a8a8a8]'
                  }`}
                >
                  {fase}
                  {ativa && (
                    <span className="absolute bottom-[-1px] left-0 h-[3px] w-full bg-[#25a51f]" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-6">
          <p className="text-[12px] font-semibold">Hoje</p>

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
              {error}
            </p>
          )}

          <div className="w-[272px] max-w-full space-y-6">
            <FormField label="Data da Partida">
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="h-9 w-full rounded-md border border-transparent bg-[#f8f8f8] px-3 text-[12px] text-[#8b8b8b] outline-none focus:border-[#25a51f]"
              />
            </FormField>

            <FormField label="Horário">
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="h-9 w-full rounded-md border border-transparent bg-[#f8f8f8] px-3 text-[12px] text-[#8b8b8b] outline-none focus:border-[#25a51f]"
              />
            </FormField>
          </div>

          <div>
            <p className="mb-3 text-[12px] font-medium">
              Resultado Final da Partida
            </p>

            <div className="mb-2 grid w-[120px] grid-cols-2 gap-5 text-[11px]">
              <span>Dupla 1</span>
              <span>Dupla 2</span>
            </div>

            <div className="flex items-center gap-5">
              <input
                type="number"
                value={placar.a}
                onChange={(e) => setPlacar((prev) => ({ ...prev, a: Number(e.target.value) }))}
                className="h-10 w-10 rounded-md border-0 bg-[#f8f8f8] text-center text-[18px] outline-none focus:ring-1 focus:ring-[#25a51f]"
              />
              <span className="text-[18px] font-semibold">-</span>
              <input
                type="number"
                value={placar.b}
                onChange={(e) => setPlacar((prev) => ({ ...prev, b: Number(e.target.value) }))}
                className="h-10 w-10 rounded-md border-0 bg-[#f8f8f8] text-center text-[18px] outline-none focus:ring-1 focus:ring-[#25a51f]"
              />
            </div>
          </div>

          <div>
            <p className="mb-4 text-[12px] font-medium">Dupla Vencedora</p>

            <div className="space-y-2">
              {duplas.map((dupla) => (
                <div key={dupla.id}>
                    <p className="mb-2 text-[11px]">{dupla.titulo}</p>

                  <button
                    type="button"
                    onClick={() => setVencedor(dupla.id)}
                    className="flex h-8 w-[236px] items-center justify-between rounded-md bg-[#f8f8f8] px-3 text-left"
                  >
                    <span className="flex items-center gap-4">
                      {dupla.jogadores.map((jogador) => (
                        <span key={jogador.nome} className="flex items-center gap-2">
                          <span
                            className="h-6 w-6 rounded-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${jogador.avatar})` }}
                            aria-hidden="true"
                          />
                          <span className="text-[8px] font-bold">{jogador.nome}</span>
                        </span>
                      ))}
                    </span>

                    <CheckCircle2
                      size={11}
                      className={vencedor === dupla.id ? 'text-[#25a51f]' : 'text-transparent'}
                      fill={vencedor === dupla.id ? '#25a51f' : 'transparent'}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSalvar}
            disabled={saving}
            className="h-9 w-[282px] max-w-full rounded-[3px] bg-[#25a51f] text-[11px] font-bold text-white transition hover:bg-[#208d1b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </section>
      </main>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-medium">{label}</label>
      {children}
    </div>
  );
}
