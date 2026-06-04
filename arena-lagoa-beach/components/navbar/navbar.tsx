"use client";

import styles from "./navbar.module.css";
import { Search, Bell, Menu } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getMeuPerfil } from "@/app/services/perfilService";
import { useNotificacao } from "@/lib/NotificacaoContext";

const avatarPadrao =
  "https://wallpapers.com/images/hd/albert-einstein-pictures-1920-x-1080-66yf319tqmodnrvt.jpg";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const { unreadCount } = useNotificacao();

  const [avatarUrl, setAvatarUrl] = useState(avatarPadrao);

  const carregarFotoNavbar = useCallback(async () => {
    try {
      const perfil = await getMeuPerfil();
      if (perfil && perfil.foto_perfil) {
        setAvatarUrl(perfil.foto_perfil);
      } else {
        setAvatarUrl(avatarPadrao);
      }
    } catch (error) {
      console.error("Erro ao buscar foto para a Navbar:", error);
    }
  }, []);

  useEffect(() => {
    carregarFotoNavbar();
    window.addEventListener("avatarUpdated", carregarFotoNavbar);
    return () => {
      window.removeEventListener("avatarUpdated", carregarFotoNavbar);
    };
  }, [carregarFotoNavbar]);

  const toggleMobileMenu = () => {
    window.dispatchEvent(new Event("toggleMobileMenu"));
  };

  return (
    <header className={styles.navbar}>
      {/* Lado Esquerdo: Sanduíche + Pesquisa */}
      <div className={`${styles.searchContainer} flex items-center`}>
        {/* BOTÃO SANDUÍCHE (SÓ APARECE NO MOBILE) */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden mr-3 p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
          aria-label="Abrir menu"
        >
          <Menu size={24} />
        </button>

        <Search className={styles.searchIcon} size={18} />
        <input
          type="text"
          placeholder="Pesquisar"
          className={styles.searchInput}
        />
      </div>

      {/* Ações da direita */}
      <div className={styles.actions}>
        <Link href="/notificacoes" className={styles.iconButton}>
          <div className={styles.notificationWrapper}>
            <Bell size={20} className={styles.icon} />
            {unreadCount > 0 && (
              <span className={styles.notificationDot}></span>
            )}
          </div>
        </Link>

        <Link href="/perfil" className={styles.iconButton}>
          <button className={styles.profileButton}>
            <span
              role="img"
              aria-label="Foto de perfil"
              style={{ backgroundImage: `url("${avatarUrl}")` }}
              className={styles.avatar}
            />
          </button>
        </Link>
      </div>
    </header>
  );
}
