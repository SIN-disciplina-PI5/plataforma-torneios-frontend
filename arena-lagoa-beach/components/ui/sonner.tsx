"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, toast, type ToasterProps, } from "sonner";

import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon, BellIcon, } from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl border shadow-md font-inter",
          title: "text-sm font-semibold",
          description: "text-xs text-gray-500",
          success: "!border-green-500",
          error: "!border-red-500",
          warning: "!border-yellow-500",
          info: "!border-blue-500",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

export const notificacaoToast = ({
  titulo,
  mensagem,
  tipo = "info",
}: {
  titulo: string;
  mensagem: string;
  tipo?: "success" | "error" | "warning" | "info";
}) => {
  const options = {
    description: mensagem,
    icon: <BellIcon className="size-4" />,
  };

  switch (tipo) {
    case "success":
      return toast.success(titulo, options);

    case "error":
      return toast.error(titulo, options);

    case "warning":
      return toast.warning(titulo, options);

    default:
      return toast.info(titulo, options);
  }
};