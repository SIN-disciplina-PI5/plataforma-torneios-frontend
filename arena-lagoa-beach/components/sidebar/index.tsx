"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./sidebar.module.css";
import { Home, Trophy, Volleyball, Bell, User, X } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "ADMIN");
    setIsMounted(true);

    const toggleMenu = () => setIsMobileOpen((prev) => !prev);
    window.addEventListener("toggleMobileMenu", toggleMenu);

    return () => window.removeEventListener("toggleMobileMenu", toggleMenu);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const navItems = [
    {
      label: "Home",
      href: isAdmin ? "/admin/torneios" : "/torneios",
      icon: Home,
    },
    {
      label: "Ranking",
      href: "/ranking",
      icon: Trophy,
    },
    {
      label: "Partidas",
      href: isAdmin ? "/admin/partidas" : "/home",
      icon: Volleyball,
    },
    {
      label: "Meu Perfil",
      href: "/perfil",
      icon: User,
    },
  ];

  if (!isMounted) {
    return (
      <aside className={`${styles.sidebar} hidden md:flex`}>
        <h2 className={styles.title}>MENU</h2>
        <nav className={styles.nav} />
      </aside>
    );
  }

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`
          ${styles.sidebar} 
          fixed top-0 left-0 h-full z-50 md:relative md:translate-x-0 
          transition-transform duration-300 ease-in-out w-64 bg-[#fbfbfb] shadow-2xl md:shadow-none
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between mb-8 md:block">
          <h2 className={`${styles.title} !mb-0 md:!mb-8`}>MENU</h2>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-2 text-gray-500 hover:bg-gray-200 rounded-md cursor-pointer transition-colors"
          >
            <X size={20} />
          </button>
        </div>

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
    </>
  );
}
