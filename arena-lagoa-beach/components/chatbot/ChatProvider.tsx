"use client";

import { ChatWidget } from "./ChatWidget";

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const isLogged = !!token;

  return (
    <>
      {children}
      {isLogged && <ChatWidget />}
    </>
  );
}