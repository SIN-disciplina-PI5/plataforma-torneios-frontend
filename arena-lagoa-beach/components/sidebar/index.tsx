"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./sidebar.module.css";
import { Home, Trophy, Volleyball, Bell, User } from "lucide-react";

// Definição dos itens de navegação
const navItems = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Ranking", href: "/ranking", icon: Trophy },
  { label: "Torneios", href: "/torneios", icon: Volleyball },
  { label: "Notificações", href: "/notificacoes", icon: Bell },
  { label: "Meu Perfil", href: "/perfil", icon: User },
  { label: "Admin", href: "/admin/editarPartida", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>MENU</h2>

      <nav className={styles.nav}>
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            >
              <Icon className={styles.icon} />
              <span className={styles.label}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
