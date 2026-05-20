import Image from "next/image";
import { LoginForm } from "@/components/auth/LoginForm";

export default function Login() {
  return (
    
    <div className="flex flex-col lg:flex-row items-center justify-center bg-white min-h-screen gap-10 px-4 py-10 lg:py-0">
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
      <div className="flex flex-col items-center justify-center bg-[#F9F9F9] w-full max-w-md p-6 lg:p-12 border border-[#AEC3CB] rounded-lg mb-10 lg:mb-0 min-h-[600px]">
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
