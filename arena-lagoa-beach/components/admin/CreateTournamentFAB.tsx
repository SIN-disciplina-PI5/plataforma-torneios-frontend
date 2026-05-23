"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/app/utils/auth";

export function CreateTournamentFAB() {
  const router = useRouter();
  
  // Apenas renderiza se for admin
  if (!isAdmin()) {
    return null;
  }

  const handleClick = () => {
    router.push("/admin/criarTorneios");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-8 right-8 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25a51f] hover:bg-[#208d1b] text-white shadow-lg transition-all hover:shadow-xl active:scale-95"
      aria-label="Criar novo torneio"
      title="Criar novo torneio"
    >
      <Plus size={24} strokeWidth={2.5} />
    </button>
  );
}
