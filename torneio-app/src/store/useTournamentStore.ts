import { create } from 'zustand'

type Tournament = {
  id?: string
  name: string
  level: string
  startDate: string
  endDate: string
}

type TournamentStore = {
  currentTournament: Tournament | null
  setTournament: (data: Tournament) => void
  clearTournament: () => void
}

export const useTournamentStore = create<TournamentStore>((set) => ({
  currentTournament: null,
  setTournament: (data) => set({ currentTournament: data }),
  clearTournament: () => set({ currentTournament: null })
}))
