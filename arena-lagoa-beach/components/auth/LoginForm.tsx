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
        <div className="flex flex-row items-center mb-4">
          <input
            type="checkbox"
            id="remember"
            className="mr-2 h-4 w-4 text-[#C2E96A] border-gray-300 rounded focus:ring-[#C2E96A]"
          />
          <label htmlFor="remember" className="text-sm text-gray-700 mr-27">
            Lembre-se de mim
          </label>
          <a>
            <span className="text-sm text-red-500 hover:text-red-700 ml-auto cursor-pointer">
              Esqueci minha senha
            </span>
          </a>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-[#2FA026] hover:bg-[#25801E] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-96"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
