import Image from "next/image";
import { LoginForm } from "@/components/auth/LoginForm";

export default function Login() {
  return (
    
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 overflow-x-hidden bg-white px-4 py-8 sm:px-6 lg:flex-row lg:gap-10 lg:py-0">
      {/* FORM */}
      <div className="flex flex-col justify-center w-full max-w-md">
        <h1 className="text-3xl lg:text-4xl font-bold text-black mb-4">
          Login
        </h1>

        <p className="text-gray-500 mb-6 text-sm lg:text-base">
          Login para acessar sua conta
        </p>

        <LoginForm />
      </div>

      {/* IMAGEM */}
      <div className="flex w-full max-w-md flex-col items-center justify-center rounded-lg border border-[#AEC3CB] bg-[#F9F9F9] p-6 lg:mb-0 lg:min-h-[600px] lg:p-12">
        <Image
          src="/LoginImage.png"
          alt="Imagem da tela de login"
          className="mb-6 lg:mb-12 w-64 lg:w-96 h-auto"
          width={400}
          height={400}
        />

        <h1 className="font-bold text-[#316F27] mb-2 text-lg lg:text-xl">
          Suba no ranking
        </h1>

        <p className="text-gray-500 text-center text-sm lg:text-base">
          Cada vitória conta! Acompanhe sua evolução, conquiste medalhas e veja
          sua posição entre os melhores jogadores.
        </p>
      </div>
    </div>
  );
  
}