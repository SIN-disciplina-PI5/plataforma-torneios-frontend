"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/app/utils/auth";

export default function ProtecaoRotaAdmin({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Se não houver token, redireciona para login
    if (!token) {
      router.push("/login");
      return;
    }

    // Se não for admin, redireciona para home
    if (!isAdmin()) {
      router.push("/torneios");
      return;
    }

    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return null;
  }

  return children;
}
