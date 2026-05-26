"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { api } from "@/app/services/api";

interface EditTournamentFormProps {
  tournament: any;
  onClose: () => void;
}

export function EditTournamentForm({
  tournament,
  onClose,
}: EditTournamentFormProps) {
  const [nome, setNome] = useState(tournament?.nome || "");
  const [categoria, setCategoria] = useState(
    tournament?.categoria || "Intermediário",
  );

  const [dataInicio, setDataInicio] = useState(
    tournament?.data_inicio ? tournament.data_inicio.split("T")[0] : "",
  );
  const [dataFim, setDataFim] = useState(
    tournament?.data_fim ? tournament.data_fim.split("T")[0] : "",
  );

  const [loading, setLoading] = useState(false);

  // Calcula a data de hoje no formato YYYY-MM-DD para bloquear datas passadas
  const hoje = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trava de segurança: Garante que a Data de Fim não seja menor que a Data de Início
    if (dataInicio && dataFim && dataFim < dataInicio) {
      alert("A data de término não pode ser anterior à data de início.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Sua sessão expirou. Faça login novamente.");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const dadosAtualizados = {
        nome,
        categoria,
        data_inicio: dataInicio,
        data_fim: dataFim,
      };

      await api.patch(
        `/torneio/${tournament.id_torneio}`,
        dadosAtualizados,
        config,
      );

      onClose();
      window.location.reload();
    } catch (error: any) {
      console.error("Erro completo do Axios:", error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(`O servidor recusou a edição: ${error.response.data.error}`);
      } else {
        alert(
          "Erro ao atualizar. Verifique o console (F12) para mais detalhes.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com a mudança da Data de Início
  const handleDataInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novaDataInicio = e.target.value;
    setDataInicio(novaDataInicio);

    // Se a data de fim atual for menor que a nova data de início escolhida, limpa a data de fim
    if (dataFim && dataFim < novaDataInicio) {
      setDataFim("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 mt-2 font-sans"
    >
      <div>
        <label className="block text-[15px] font-semibold text-gray-800 mb-2">
          Nome
        </label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do torneio"
          required
          className="w-full bg-[#f9fafb] text-gray-500 border-none rounded-xl px-4 py-3 text-[15px] focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-[15px] font-semibold text-gray-800 mb-2">
          Nível
        </label>
        <div className="relative">
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full bg-[#f9fafb] text-gray-500 border-none rounded-xl px-4 py-3 text-[15px] appearance-none focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="Iniciante">Iniciante</option>
            <option value="Intermediário">Intermediário</option>
            <option value="Avançado">Avançado</option>
          </select>
          <ChevronDown
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-[15px] font-semibold text-gray-800 mb-2">
            Data Início
          </label>
          <input
            type="date"
            value={dataInicio}
            min={hoje} // Bloqueia datas anteriores a hoje
            onChange={handleDataInicioChange}
            required
            className="w-full bg-[#f9fafb] text-gray-500 border-none rounded-xl px-4 py-3 text-[15px] focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="block text-[15px] font-semibold text-gray-800 mb-2">
            Data Fim
          </label>
          <input
            type="date"
            value={dataFim}
            min={dataInicio || hoje} // O pulo do gato: o mínimo agora é a Data de Início!
            onChange={(e) => setDataFim(e.target.value)}
            required
            className="w-full bg-[#f9fafb] text-gray-500 border-none rounded-xl px-4 py-3 text-[15px] focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full font-semibold py-3 rounded-lg mt-4 transition-colors ${
          loading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-[#34a853] hover:bg-green-700 text-white"
        }`}
      >
        {loading ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
