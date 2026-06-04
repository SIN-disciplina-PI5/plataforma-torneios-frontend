export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("token");
  return !!token;
};

/**
 * Retorna a role do usuário armazenada no localStorage
 * @returns "ADMIN" | "USER" | null
 */
export const getUserRole = (): string | null => {
  if (typeof window === "undefined") return null;

  const role = localStorage.getItem("role");
  return role;
};

/**
 * Verifica se o usuário é administrador
 * @returns boolean
 */
export const isAdmin = (): boolean => {
  const role = getUserRole();
  return role === "ADMIN";
};

/**
 * Remove dados de autenticação do localStorage
 * Usado para logout
 */
export const clearAuthData = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
};

/**
 * Avatar padrão estilo WhatsApp
 */
export const AVATAR_PADRAO =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%23dcfce7'/%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' fill='%23b8c2cc'/%3E%3C/svg%3E";
