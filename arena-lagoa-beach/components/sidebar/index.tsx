"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./sidebar.module.css";
import { Home, Trophy, Volleyball, Bell, User } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // ler role do localStorage e determinar se é admin
  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "ADMIN");
    setIsMounted(true);
  }, []);

  // definição dinâmica dos itens de navegação baseado na role
  const navItems = [
    { 
      label: "Home", 
      href: isAdmin ? "/admin/torneios" : "/torneios", 
      icon: Home 
    },
    { 
      label: "Ranking", 
      href: "/ranking", 
      icon: Trophy 
    },
    { 
      label: "Partidas", 
      href: isAdmin ? "/admin/partidas" : "/home", 
      icon: Volleyball 
    },
    { 
      label: "Meu Perfil", 
      href: "/perfil", 
      icon: User 
    },
  ];

  // Aguardar montagem 
  if (!isMounted) {
    return (
      <aside className={styles.sidebar}>
        <h2 className={styles.title}>MENU</h2>
        <nav className={styles.nav} />
      </aside>
    );
  }

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
