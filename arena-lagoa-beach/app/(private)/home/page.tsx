import { CardPartida } from "./components/CardPartida";

export default function Home() {
  const categorias = ["Todos", "Oitavas de Finais", "Quartas de Finais", "Semifinais", "Finais", "Eliminatórias"];

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      {/* Header com Saudação */}
      <div className="flex items-center gap-2">
        <span className="text-3xl">⚽</span>
        <h1 className="text-2xl font-bold text-gray-900">Olá, Márcio</h1>
      </div>

      {/* Abas de Navegação (Filtros Visuais) */}
      <div className="flex gap-6 border-b border-gray-200 overflow-x-auto pb-1">
        {categorias.map((cat, index) => (
          <button 
            key={cat} 
            className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
              index === 0 ? "border-green-600 text-green-700" : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grupos de Partidas por Data */}
      <div className="space-y-10">
        {/* Seção Hoje */}
        <section>
          <h2 className="text-sm font-bold text-gray-500 mb-4 px-1">Hoje</h2>
          <div className="flex flex-col gap-3">
            <CardPartida 
              player1="João" flag1="🇦🇷" score="1 - 2" player2="Rodrigo" flag2="🇮🇹" time="12:20" fase="Oitavas" isFavorite 
            />
            <CardPartida 
              player1="Marcelo" flag1="🇵🇹" score="2 - 3" player2="Carlos" flag2="🇩🇪" time="13:20" fase="Oitavas" 
            />
          </div>
        </section>

        {/* Seção Amanhã */}
        <section>
          <h2 className="text-sm font-bold text-gray-500 mb-4 px-1">Amanhã, 12/09</h2>
          <div className="flex flex-col gap-3">
            <CardPartida 
              player1="Vilma" flag1="🇦🇷" score="1 - 2" player2="Fabiana" flag2="🇮🇹" time="09:20" fase="Quartas" 
            />
          </div>
        </section>
      </div>
    </div>
  );
}