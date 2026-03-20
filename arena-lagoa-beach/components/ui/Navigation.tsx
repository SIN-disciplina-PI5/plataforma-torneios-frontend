'use client';

import { navItems, NavItemName  
 } from "@/lib/constants";
import Link from "next/link";
import "./navigation.module.css";
import { Home, BarChart, Trophy, Bell, User } from "lucide-react";
import { useState } from "react";

import { LucideIcon } from "lucide-react";

const iconMap: Record<NavItemName, LucideIcon> = {
  Home: Home,
  Ranking: BarChart,
  Torneios: Trophy,
  Notificações: Bell,
  "Meu Perfil": User
};

export default function Navigation() {
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* Botão fora da sidebar */}
      <button className="menu-button" onClick={() => setOpen(!open)}>
        ☰
      </button>

      <nav className={`sidebar ${open ? "open" : "closed"}`}>
        <h2 className="sidebar-title">MENU</h2>

        <ul className="sidebar-menu">
          {navItems.map((item, index) => {
            const Icon = iconMap[item.name];

            return (
              <li key={item.name} className="sidebar-item">
                <Link
                  href={item.href}
                  className={`sidebar-link ${index === 0 ? "active" : ""}`}
                >
                  <span className="sidebar-icon">
                    <Icon size={18} />
                  </span>

                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}