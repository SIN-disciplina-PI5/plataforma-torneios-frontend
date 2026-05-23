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
