export function LoginForm() {
  return (
    <div>
      <form>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="bg-white border border-gray-300 rounded w-full py-2 px-3 text-gray-700 
focus:outline-none focus:border-[#C2E96A]"
            placeholder="Digite seu email"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Senha
          </label>
          <input
            type="password"
            id="password"
            className="bg-white border border-gray-300 rounded w-full py-2 px-3 text-gray-700 
focus:outline-none focus:border-[#C2E96A]"
            placeholder="Digite sua senha"
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          {/* ESQUERDA */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="className=h-4 w-4 accent-[#C2E96A] cursor-pointer"
            />
            <label htmlFor="remember" className="text-sm text-gray-700">
              Lembre-se de mim
            </label>
          </div>

          {/* DIREITA */}
          <span className="text-sm text-red-500 hover:text-red-700 cursor-pointer">
            Esqueci minha senha
          </span>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-[#2FA026] hover:bg-[#25801E] text-white font-bold py-2 px-4 rounded w-96 cursor-pointer
transition-all duration-300 ease-in-out
hover:scale-105 hover:shadow-lg
active:scale-95 active:bg-[#1f6b19]"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
