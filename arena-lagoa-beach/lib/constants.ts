export type NavItemName =
  | "Home"
  | "Ranking"
  | "Torneios"
  | "Notificações"
  | "Meu Perfil";

export const navItems: { name: NavItemName; href: string }[] = [
  { name: "Home", href: "/" },
  { name: "Ranking", href: "/ranking" },
  { name: "Torneios", href: "/torneios" },
  { name: "Notificações", href: "/notificacoes" },
  { name: "Meu Perfil", href: "/myPerfil" }
];

