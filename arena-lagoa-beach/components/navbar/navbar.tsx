"use client";

import styles from "./navbar.module.css";
import { Search, Bell, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getMeuPerfil } from "@/app/services/perfilService";

const avatarPadrao =
  "https://wallpapers.com/images/hd/albert-einstein-pictures-1920-x-1080-66yf319tqmodnrvt.jpg";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [hasNotification] = useState(true);

  const [avatarUrl, setAvatarUrl] = useState(avatarPadrao);

  useEffect(() => {
    async function carregarFotoNavbar() {
      try {
        const perfil = await getMeuPerfil();
        if (perfil && perfil.foto_perfil) {
          setAvatarUrl(perfil.foto_perfil);
        }
      } catch (error) {
        console.error("Erro ao buscar foto para a Navbar:", error);
      }
    }

    carregarFotoNavbar();
  }, []);

  return (
    <header className={styles.navbar}>
      {/* Pesquisa */}
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={18} />

        <input
          type="text"
          placeholder="Pesquisar"
          className={styles.searchInput}
        />
      </div>

      {/* Ações da direita */}
      <div className={styles.actions}>
        {/* Notificação */}
        <Link href="/notificacoes" className={styles.iconButton}>
          <div className={styles.notificationWrapper}>
            <Bell size={20} className={styles.icon} />

            {hasNotification && (
              <span className={styles.notificationDot}></span>
            )}
          </div>
        </Link>

        
        {/* Tema */}
        {/* remover na versãoo final */}
        {/* <button
          className={styles.iconButton}
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Alternar tema"
        >
          {darkMode ? (
            <Moon size={20} className={styles.icon} />
          ) : (
            <Sun size={20} className={styles.icon} />
          )}
        </button> */}

        <Link href="/perfil" className={styles.iconButton}>
          {/* Perfil */}
          <button className={styles.profileButton}>
            <span
              role="img"
              aria-label="Foto de perfil"
              style={{ backgroundImage: `url(${avatarUrl})` }}
              className={styles.avatar}
            />
          </button>
        </Link>
      </div>
    </header>
  );
}
