"use client";

import { useState } from "react";

export function TabsFase() {
  const categorias = [
    "Todos",
    "Oitavas de Finais",
    "Quartas de Finais",
    "Semifinais",
    "Finais",
    "Eliminatórias",
  ];

  // Estado para controlar qual aba está selecionada visualmente
  const [activeTab, setActiveTab] = useState("Todos");

  return (
    <div className="flex gap-6 border-b border-gray-200 overflow-x-auto pb-1 scrollbar-hide">
      {categorias.map((cat) => (
        <button
          key={cat}
          onClick={() => setActiveTab(cat)}
          className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${
            activeTab === cat
              ? "border-green-600 text-green-700"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
