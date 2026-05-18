"use client";

import React, { useState, useEffect } from "react";
import { Info, Star } from "lucide-react";
import { api } from "@/app/services/api";
import { Partida, GrupoDePartidas } from "@/app/types/partida";

const formatarHorario = (dataIso: string) => {
  if (!dataIso) return "-";
  try {
    const data = new Date(dataIso);
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return dataIso;
  }
};

export default function ConteudoPartidas() {
  const [userName, setUserName] = useState<string>("");
  const [todasAsPartidas, setTodasAsPartidas] = useState<Partida[]>([]);
  const [abaAtiva, setAbaAtiva] = useState<string>("Todos");
  const [loading, setLoading] = useState(true);

  const abas = [
    "Todos",
    "Minhas Partidas",
    "Oitavas de Finais",
    "Quartas de Finais",
    "Semifinais",
    "Finais",
  ];

  useEffect(() => {
    const buscarDadosDoBackEnd = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!token) {
          setUserName("Visitante");
          setLoading(false);
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        if (userId) {
          const respostaUsuario = await api.get(`/users/${userId}`, config);
          if (respostaUsuario.data && respostaUsuario.data.data) {
            const nomeDoBanco = respostaUsuario.data.data.nome;
            const nomeFormatado =
              nomeDoBanco.charAt(0).toUpperCase() + nomeDoBanco.slice(1);
            setUserName(nomeFormatado);
          }
        }

        const respostaPartidas = await api.get("/partidas", config);

        let partidasDoBanco = [];
        if (
          respostaPartidas.data &&
          Array.isArray(respostaPartidas.data.data)
        ) {
          partidasDoBanco = respostaPartidas.data.data;
        } else if (Array.isArray(respostaPartidas.data)) {
          partidasDoBanco = respostaPartidas.data;
        }

        setTodasAsPartidas(partidasDoBanco);
      } catch (error) {
        console.error("Erro ao buscar dados na API com Axios:", error);
        setUserName("Visitante");
      } finally {
        setLoading(false);
      }
    };

    buscarDadosDoBackEnd();
  }, []);

  // LÓGICA DE FILTRAGEM: Filtra as partidas dinamicamente com base na aba clicada
  const obterPartidasFiltradas = (): GrupoDePartidas[] => {
    let partidasFiltradas = [...todasAsPartidas];

    if (abaAtiva === "Minhas Partidas") {
      const userId = localStorage.getItem("userId");
      // Filtra as partidas onde o usuário logado está jogando (seja na equipe 1 ou na equipe 2)
      partidasFiltradas = todasAsPartidas.filter(
        (p) =>
          p.equipe1?.id_usuario === userId || p.equipe2?.id_usuario === userId,
      );
    } else if (abaAtiva !== "Todos") {
      // Filtra pelo campo 'fase' que veio da sua model do banco de dados (ex: "Oitavas de Finais", "Semifinais")
      // O map abaixo garante a comparação sem problemas de espaços ou maiúsculas
      partidasFiltradas = todasAsPartidas.filter(
        (p) => p.fase?.trim().toLowerCase() === abaAtiva.trim().toLowerCase(),
      );
    }

    // Retorna empacotado na estrutura que o HTML espera para renderizar
    return [
      {
        dataLabel: abaAtiva,
        partidas: partidasFiltradas,
      },
    ];
  };

  const gruposPartidasFiltradas = obterPartidasFiltradas();

  return (
    <div className="w-full bg-white font-sans p-8">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2 mb-1 text-black">
          ⚽ Olá, {userName}
        </h1>
        <p className="text-[#a1a1aa] text-sm font-medium">
          Essas são as partidas dos torneios em andamento
        </p>
      </div>

      {/* Navegação de Abas Dinâmica */}
      <div className="flex gap-8 border-b border-gray-100 mb-6 text-sm font-medium text-[#a1a1aa] overflow-x-auto whitespace-nowrap">
        {abas.map((aba) => (
          <button
            key={aba}
            onClick={() => setAbaAtiva(aba)}
            className={`pb-3 transition-colors ${
              abaAtiva === aba
                ? "border-b-2 border-green-600 text-black font-semibold"
                : "hover:text-gray-700"
            }`}
          >
            {aba}
          </button>
        ))}
      </div>

      {/* Lista de Partidas */}
      {loading ? (
        <p className="text-gray-500">Carregando partidas...</p>
      ) : gruposPartidasFiltradas[0].partidas.length === 0 ? (
        <p className="text-gray-500">
          Nenhuma partida encontrada para a categoria "{abaAtiva}".
        </p>
      ) : (
        <div className="space-y-8">
          {gruposPartidasFiltradas.map((grupo, indexGrupo) => (
            <div key={indexGrupo}>
              <h3 className="font-semibold text-sm text-black mb-3">
                {grupo.dataLabel}
              </h3>
              <div className="space-y-2">
                {grupo.partidas.map((partida) => (
                  <div
                    key={partida.id_partida}
                    className="flex items-center justify-between bg-[#fafafa] rounded-lg px-6 py-3"
                  >
                    {/* Equipe 1 */}
                    <div className="flex items-center justify-end gap-3 w-[30%]">
                      <span className="text-xl leading-none">
                        {partida.equipe1?.bandeira}
                      </span>
                      <span className="font-medium text-sm text-black w-20 truncate">
                        {partida.equipe1?.nome || "Time 1"}
                      </span>
                    </div>

                    {/* Placar */}
                    <div className="bg-[#f3e8ff] text-[#7e22ce] font-semibold px-4 py-1.5 rounded-full text-xs min-w-[60px] text-center">
                      {partida.placar || "-"}
                    </div>

                    {/* Equipe 2 */}
                    <div className="flex items-center justify-start gap-3 w-[30%]">
                      <span className="font-medium text-sm text-black w-20 text-right truncate">
                        {partida.equipe2?.nome || "Time 2"}
                      </span>
                      <span className="text-xl leading-none">
                        {partida.equipe2?.bandeira}
                      </span>
                    </div>

                    {/* Horário */}
                    <div className="flex items-center justify-end gap-6 w-[20%]">
                      <div className="bg-[#dcfce7] text-[#166534] font-semibold px-4 py-1.5 rounded-full text-xs min-w-[70px] text-center">
                        {formatarHorario(partida.horario)}
                      </div>
                      <div className="flex items-center gap-3 text-[#a1a1aa]">
                        <button className="hover:text-gray-600 transition-colors">
                          <Info size={18} strokeWidth={2} />
                        </button>
                        <button
                          className={`transition-colors ${
                            partida.favorita
                              ? "text-[#0f172a]"
                              : "hover:text-gray-600"
                          }`}
                        >
                          <Star
                            size={18}
                            strokeWidth={2}
                            className={partida.favorita ? "fill-current" : ""}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
