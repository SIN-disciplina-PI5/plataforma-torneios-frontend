export function RecuperarSenhaForm() {
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
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-[#2FA026] hover:bg-[#25801E] text-white w-full py-2 px-4 rounded w-96 cursor-pointer
transition-all duration-300 ease-in-out
hover:scale-105 hover:shadow-lg
active:scale-95 active:bg-[#1f6b19]"
          >
            Recuperar minha senha
          </button>
        </div>
      </form>
    </div>
  );
}
