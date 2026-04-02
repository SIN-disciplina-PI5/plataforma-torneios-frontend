export function NovaSenhaForm() {
  return (
    <div>
      <form>
        <div className="mb-4 relative">
          <label
            htmlFor="password"
            className="absolute -top-2 left-3 bg-white px-1 text-gray-700 text-sm font-poppins"
          >
            Crie a nova senha
          </label>

          <input
            type="password"
            id="password"
            className="bg-white border border-gray-300 mb-1 rounded w-full py-2 px-3 text-gray-700 font-poppins
focus:outline-none focus:border-[#C2E96A]"
            placeholder="Digite sua nova senha"
          />
        </div>

        <div className="mb-4 relative">
          <label
            htmlFor="confirmPassword"
            className="absolute -top-2 left-3 bg-white px-1 text-gray-700 text-sm font-poppins"
          >
            Confirme a nova senha
          </label>

          <input
            type="password"
            id="confirmPassword"
            className="bg-white border border-gray-300 mb-3 rounded w-full py-2 px-3 text-gray-700 font-poppins
focus:outline-none focus:border-[#C2E96A]"
        placeholder="Digite sua nova senha"
          />
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-[#2FA026] hover:bg-[#25801E] text-white w-full py-2 px-4 rounded cursor-pointer
transition-all duration-300 ease-in-out
hover:scale-105 hover:shadow-lg
active:scale-95 active:bg-[#1f6b19]"
          >
            Redefinir a senha
          </button>
        </div>
      </form>
    </div>
  );
}