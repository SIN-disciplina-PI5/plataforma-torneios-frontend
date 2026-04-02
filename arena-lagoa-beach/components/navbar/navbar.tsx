'use client';

import styles from './navbar.module.css';
import { Search, Bell, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [hasNotification] = useState(true);

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
        <button className={styles.iconButton}>
          <div className={styles.notificationWrapper}>
            <Bell size={20} className={styles.icon} />
            {hasNotification && <span className={styles.notificationDot}></span>}
          </div>
        </button>

        {/* Tema */}
        <button
          className={styles.iconButton}
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Alternar tema"
        >
          {darkMode ? (
            <Moon size={20} className={styles.icon} />
          ) : (
            <Sun size={20} className={styles.icon} />
          )}
        </button>

        {/* Perfil */}
        <button className={styles.profileButton}>
          <img
            src="https://wallpapers.com/images/hd/albert-einstein-pictures-1920-x-1080-66yf319tqmodnrvt.jpg"
            alt="Foto de perfil"
            className={styles.avatar}
          />
        </button>
      </div>
    </header>
  );
}