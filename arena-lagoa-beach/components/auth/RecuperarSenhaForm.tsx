export function RecuperarSenhaForm() {
  return (
    <div>
      <form>
        <div className="mb-2 relative"> 
          <label
            htmlFor="codigo"
            className="absolute -top-2 left-3 bg-white px-1 text-gray-700 text-sm font-poppins"
          >
            Insira o código
          </label>

          <input
            type="text"
            id="codigo"
            className="bg-white border border-gray-300 rounded w-full py-2 px-3 text-gray-700 font-poppins
focus:outline-none focus:border-[#C2E96A]"
          />
        </div>
        
        {/* Opção de reenviar código */}
        <div className="mb-6 -mt-1"> 
          <span className="text-gray-600 text-sm font-poppins">
            Não recebeu o código?{" "}
          </span>
          <button
            type="button"
            className="text-red-600 hover:underline text-sm font-poppins"
          >
            Reenviar
          </button>
        </div>
        
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-[#2FA026] hover:bg-[#25801E] text-white w-full py-2 px-4 rounded cursor-pointer
transition-all duration-300 ease-in-out
hover:scale-105 hover:shadow-lg
active:scale-95 active:bg-[#1f6b19]"
          >
            Verificar
          </button>
        </div>
      </form>
    </div>
  );
}