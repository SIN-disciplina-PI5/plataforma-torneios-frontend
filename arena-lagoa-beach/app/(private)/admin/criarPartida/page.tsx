'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const fases = [
  { label: 'Oitavas de Finais', value: 'OITAVAS_DE_FINAL' },
  { label: 'Quartas de Finais', value: 'QUARTAS_DE_FINAL' },
  { label: 'Semifinais', value: 'SEMI_FINAL' },
  { label: 'Finais', value: 'FINAL' },
];
const statusPadrao = 'PENDENTE';
// trocar dps para o do .env
const apiUrlPadrao = 'https://plataforma-torneios-backend-mocha.vercel.app';

const duplas = [
  {
    titulo: 'Dupla 1',
    jogadores: [
      { nome: 'Karen Den', avatar: 'https://i.pravatar.cc/100?img=12' },
      { nome: 'Julia Silva', avatar: 'https://i.pravatar.cc/100?img=32' },
    ],
  },
  {
    titulo: 'Dupla 2',
    jogadores: [
      { nome: 'Márcio lima', avatar: 'https://i.pravatar.cc/100?img=47' },
      { nome: 'Homer Cídio', avatar: 'https://i.pravatar.cc/100?img=20' },
    ],
  },
];

type Torneio = {
  id_torneio: string;
  nome: string;
  categoria?: string;
};

type ApiListResponse<T> = {
  data?: T[];
  error?: string;
};

type ApiCreateResponse = {
  data?: {
    id_partida: string;
  };
  error?: string;
  message?: string;
};

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || apiUrlPadrao;

export default function CriarPartidaPage() {
  const router = useRouter();

  const [idTorneio, setIdTorneio] = useState('');
  const [faseAtiva, setFaseAtiva] = useState(fases[0].value);
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTorneios, setLoadingTorneios] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTorneios() {
      try {
        const apiUrl = getApiUrl();
        const token = localStorage.getItem('token');

        if (!apiUrl) {
          throw new Error('NEXT_PUBLIC_API_URL não está configurada');
        }

        const res = await fetch(`${apiUrl}/api/torneio`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = (await res.json()) as ApiListResponse<Torneio>;

        if (!res.ok) {
          throw new Error(json.error || 'Erro ao carregar torneios');
        }

        const torneiosRecebidos = json.data || [];
        setIdTorneio(String(torneiosRecebidos[0]?.id_torneio || ''));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao carregar torneios';
        setError(message);
      } finally {
        setLoadingTorneios(false);
      }
    }

    fetchTorneios();
  }, []);

  async function handleCriar() {
    setError('');

    if (!idTorneio) {
      setError('Selecione um torneio para criar a partida.');
      return;
    }

    try {
      setLoading(true);

      const apiUrl = getApiUrl();
      const token = localStorage.getItem('token');

      if (!apiUrl) {
        throw new Error('NEXT_PUBLIC_API_URL não está configurada');
      }

      const res = await fetch(`${apiUrl}/api/partidas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_torneio: idTorneio,
          fase: faseAtiva,
          status: statusPadrao,
          horario: data && hora ? `${data}T${hora}:00` : null,
        }),
      });

      const json = (await res.json()) as ApiCreateResponse;

      if (!res.ok) {
        setError(json.error || 'Erro ao criar partida');
        return;
      }

      router.push('/admin/partidas');
      router.refresh();
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Erro na requisição';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <main className="w-full max-w-[610px] px-5 pt-6 pb-8">
        <div className="mb-6 flex items-center gap-2">
          <Image
            src="/variante-de-bola-de-futebol.png"
            alt="Bola de futebol"
            width={18}
            height={18}
          />
          <h1 className="text-[20px] font-bold leading-none">
            Criar Partida
          </h1>
        </div>

        <section className="mb-7">
          <div className="flex items-end gap-8 border-b border-[#dddddd] overflow-x-auto">
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

        <section className="space-y-7">
          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
              {error}
            </p>
          )}

          <FormField label="Data da Partida">
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="h-9 w-[272px] max-w-full rounded-md border border-transparent bg-[#f8f8f8] px-3 text-[12px] text-[#8b8b8b] outline-none focus:border-[#25a51f]"
            />
          </FormField>

          <FormField label="Horário">
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="h-9 w-[272px] max-w-full rounded-md border border-transparent bg-[#f8f8f8] px-3 text-[12px] text-[#8b8b8b] outline-none focus:border-[#25a51f]"
            />
          </FormField>

          <div>
            <p className="mb-4 text-[12px] font-medium">Duplas</p>

            <div className="space-y-2">
              {duplas.map((dupla) => (
                <div key={dupla.titulo}>
                  <p className="mb-2 text-[11px]">{dupla.titulo}</p>

                  <div className="flex h-8 w-[236px] max-w-full items-center rounded-md bg-[#f8f8f8] px-3">
                    <span className="flex items-center gap-8">
                      {dupla.jogadores.map((jogador) => (
                        <span key={jogador.nome} className="flex items-center gap-2">
                          <span
                            className="h-6 w-6 rounded-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${jogador.avatar})` }}
                            aria-hidden="true"
                          />
                          <span className="whitespace-nowrap text-[8px] font-bold">
                            {jogador.nome}
                          </span>
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCriar}
            disabled={loading || loadingTorneios}
            className="h-9 w-[282px] max-w-full rounded-[3px] bg-[#25a51f] text-[11px] font-bold text-white transition hover:bg-[#208d1b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Criando...' : 'Criar'}
          </button>
        </section>
      </main>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}
