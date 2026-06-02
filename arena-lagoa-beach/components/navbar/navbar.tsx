"use client";

import styles from "./navbar.module.css";
import { Search, Bell } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getMeuPerfil } from "@/app/services/perfilService";
import { AVATAR_PADRAO } from "@/app/utils/auth";

export default function Navbar() {
  const [hasNotification] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_PADRAO);

  const carregarFotoNavbar = useCallback(async () => {
    try {
      const perfil = await getMeuPerfil();
      if (perfil && perfil.foto_perfil) {
        setAvatarUrl(perfil.foto_perfil);
      } else {
        setAvatarUrl(AVATAR_PADRAO);
      }
    } catch (error) {
      console.error("Erro ao buscar foto para a Navbar:", error);
    }
  }, []);

  useEffect(() => {
    // Carrega a foto assim que a Navbar é montada na tela
    carregarFotoNavbar();

    window.addEventListener("avatarUpdated", carregarFotoNavbar);

    return () => {
      window.removeEventListener("avatarUpdated", carregarFotoNavbar);
    };
  }, [carregarFotoNavbar]);

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

        <Link href="/perfil" className={styles.iconButton}>
          {/* Perfil */}
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
