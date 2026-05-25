'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, X } from 'lucide-react';

type Placar = {
  a: number;
  b: number;
};

type PartidaListItem = {
  id_partida: string;
  torneio: string | null;
  fase: string;
  status: string;
  horario: string | null;
  placar: string | Placar | null;
};

type PartidaDetalhe = PartidaListItem & {
  id_torneio: string;
  vencedor_id: string | null;
  resultado: string | null;
};

type ApiListResponse = {
  data?: PartidaListItem[];
  error?: string;
};

type ApiPartidaResponse = {
  data?: PartidaDetalhe;
  error?: string;
};

const fases = [
  { label: 'Oitavas de Finais', value: 'OITAVAS_DE_FINAL' },
  { label: 'Quartas de Finais', value: 'QUARTAS_DE_FINAL' },
  { label: 'Semifinais', value: 'SEMI_FINAL' },
  { label: 'Finais', value: 'FINAL' },
];

const fasePorLabel = new Map([
  ...fases.map((fase) => [fase.label, fase.value] as const),
  ['Oitavas', 'OITAVAS_DE_FINAL'],
  ['Quartas', 'QUARTAS_DE_FINAL'],
  ['Semifinal', 'SEMI_FINAL'],
  ['Final', 'FINAL'],
]);

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

const apiUrlPadrao = 'https://plataforma-torneios-backend-mocha.vercel.app';

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || apiUrlPadrao;

function normalizeFase(fase: string | null | undefined) {
  if (!fase) return fases[0].value;
  if (fasePorLabel.has(fase)) return fasePorLabel.get(fase) as string;
  if (fases.some((item) => item.value === fase)) return fase;
  return fases[0].value;
}

function parsePlacar(placar: PartidaListItem['placar']): Placar {
  if (!placar) return { a: 0, b: 0 };

  if (typeof placar === 'string') {
    const [a = '0', b = '0'] = placar.split(/[xX-]/);
    return {
      a: Number(a.trim() || 0),
      b: Number(b.trim() || 0),
    };
  }

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

export default function PartidasPage() {
  const [partidas, setPartidas] = useState<PartidaListItem[]>([]);
  const [selected, setSelected] = useState<PartidaListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPartidas = useCallback(async () => {
    try {
      setError('');

      const res = await fetch(`${getApiUrl()}/api/partidas`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const json = (await res.json()) as ApiListResponse;

      if (!res.ok) {
        throw new Error(json.error || 'Erro ao buscar partidas');
      }

      setPartidas(json.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar partidas';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPartidas();
  }, [fetchPartidas]);

  function handleEditClick(partida: PartidaListItem) {
    setSelected(partida);
  }

  async function handleSaved() {
    setSelected(null);
    setLoading(true);
    await fetchPartidas();
  }

  if (loading) return <p className="p-8">Carregando partidas...</p>;

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Partidas</h1>

        <Link
          href="/admin/criarPartida"
          className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Criar
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {selected && (
        <EditPartidaCard
          partidaId={selected.id_partida}
          onClose={() => setSelected(null)}
          onSaved={handleSaved}
        />
      )}

      {partidas.length === 0 ? (
        <p>Nenhuma partida encontrada.</p>
      ) : (
        <div className="space-y-4">
          {partidas.map((partida) => (
            <div
              key={partida.id_partida}
              className="flex items-center justify-between rounded-xl border p-4 shadow-sm"
            >
              <div>
                <p className="font-semibold">{partida.torneio || 'Torneio não informado'}</p>
                <p className="text-sm text-gray-500">{partida.fase}</p>
                <p className="text-sm">{partida.status}</p>

                {partida.horario && (
                  <p className="text-sm text-gray-400">
                    {new Date(partida.horario).toLocaleString()}
                  </p>
                )}

                {partida.placar && (
                  <p className="mt-1 font-medium">
                    {parsePlacar(partida.placar).a} x {parsePlacar(partida.placar).b}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleEditClick(partida)}
                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EditPartidaCard({
  partidaId,
  onClose,
  onSaved,
}: {
  partidaId: string;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [partida, setPartida] = useState<PartidaDetalhe | null>(null);
  const [faseAtiva, setFaseAtiva] = useState(fases[0].value);
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
        setError('');
        setLoading(true);

        const res = await fetch(`${getApiUrl()}/api/partidas/${partidaId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const json = (await res.json()) as ApiPartidaResponse;

        if (!res.ok || !json.data) {
          throw new Error(json.error || 'Erro ao buscar partida');
        }

        const dadosPartida = json.data;
        const horario = getDateTimeParts(dadosPartida.horario);

        setPartida(dadosPartida);
        setFaseAtiva(normalizeFase(dadosPartida.fase));
        setData(horario.data);
        setHora(horario.hora);
        setPlacar(parsePlacar(dadosPartida.placar));
        setVencedor(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao buscar partida';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchPartida();
  }, [partidaId]);

  async function handleSalvar() {
    if (!partida) return;

    try {
      setSaving(true);
      setError('');

      const horario = data && hora ? `${data}T${hora}:00` : null;
      const res = await fetch(`${getApiUrl()}/api/partidas/${partidaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          fase: faseAtiva,
          horario,
          placar: `${placar.a}x${placar.b}`,
          vencedor_id: vencedor ? String(vencedor) : partida.vencedor_id,
          resultado: vencedor ? `${duplas.find((dupla) => dupla.id === vencedor)?.titulo} vencedora` : partida.resultado,
          status: vencedor ? 'FINALIZADA' : partida.status,
        }),
      });

      const json = (await res.json()) as ApiPartidaResponse;

      if (!res.ok) {
        throw new Error(json.error || 'Erro ao salvar partida');
      }

      await onSaved();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar partida';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-7 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Image
            src="/variante-de-bola-de-futebol.png"
            alt="Bola de futebol"
            width={18}
            height={18}
          />
          <h2 className="text-[20px] font-bold leading-none">Editar Partida</h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
          aria-label="Fechar edição"
        >
          <X size={18} />
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Carregando partida...</p>
      ) : (
        <>
          <section className="mb-5">
            <div className="flex items-end gap-8 overflow-x-auto border-b border-[#dddddd]">
              {fases.map((fase) => {
                const ativa = faseAtiva === fase.value;

                return (
                  <button
                    key={fase.value}
                    type="button"
                    onClick={() => setFaseAtiva(fase.value)}
                    className={`relative pb-3 text-[11px] whitespace-nowrap transition ${
                      ativa ? 'text-black' : 'text-[#a8a8a8]'
                    }`}
                  >
                    {fase.label}
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
              <p className="mb-3 text-[12px] font-medium">Resultado Final da Partida</p>

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
        </>
      )}
    </article>
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
