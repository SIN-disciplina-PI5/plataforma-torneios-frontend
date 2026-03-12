"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import Button from "./Button";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.content}>
          
          <Logo />

          <Button toggle={() => setOpen(!open)} />

        </div>

        {open && (
          <ul className={styles.menu}>
            <li>
              <Link href="/myPerfil">My Profile</Link>
            </li>
            <li>
              <Link href="/ranking">Ranking</Link>
            </li>
            <li>
              <Link href="/home">Home</Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navbar;