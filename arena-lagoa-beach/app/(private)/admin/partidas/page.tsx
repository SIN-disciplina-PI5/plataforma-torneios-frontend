'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Partida = {
  id_partida: number;
  torneio: string;
  fase: string;
  status: string;
  horario: string;
  placar: { a: number; b: number } | null;
};

export default function PartidasPage() {
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPartidas() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/partidas`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        const json = await res.json();
        console.log('PARTIDAS:', json);

        setPartidas(json.data || []);
      } catch (err) {
        console.error('Erro ao buscar partidas:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPartidas();
  }, []);

  if (loading) return <p className="p-8">Carregando partidas...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Partidas</h1>

      {partidas.length === 0 ? (
        <p>Nenhuma partida encontrada.</p>
      ) : (
        <div className="space-y-4">
          {partidas.map((p) => (
            <div
              key={p.id_partida}
              className="border rounded-xl p-4 flex justify-between items-center shadow-sm"
            >
              <div>
                <p className="font-semibold">{p.torneio}</p>
                <p className="text-sm text-gray-500">{p.fase}</p>
                <p className="text-sm">{p.status}</p>

                {p.horario && (
                  <p className="text-sm text-gray-400">
                    {new Date(p.horario).toLocaleString()}
                  </p>
                )}

                {p.placar && (
                  <p className="mt-1 font-medium">
                    {p.placar.a} x {p.placar.b}
                  </p>
                )}
              </div>

              <Link
                href={`/admin/editarPartida/${p.id_partida}`}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Editar
              </Link>
            </div>
            
          ))}
        </div>
      )}
      <div>
        <Link
                href={`/admin/criarPartida/`}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Criar
              </Link>
      </div>
    </div>
    
  );
}