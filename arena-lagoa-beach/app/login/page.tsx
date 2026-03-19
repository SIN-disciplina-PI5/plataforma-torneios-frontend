import Image from "next/image";

import { LoginForm } from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <div className="flex flex-row items-center justify-center bg-white h-screen gap-20">
      <div className="flex flex-col justify-center w-96 h-auto">
        <h1 className="text-4xl font-bold text-black mb-4">Login</h1>
        <p className="text-gray-500 mb-4">Login para acessar sua conta</p>
        <LoginForm />
      </div>
      <div className="flex flex-col items-center justify-center bg-[#F9F9F9] w-auto h-auto p-12 border border-[#AEC3CB] rounded-lg">
        <Image
          src="/LoginImage.png"
          alt="Imagem da tela de login"
          className="mb-12"
          width={400}
          height={400}
        />
        <h1 className="text font-bold text-[#316F27] mb-2">Suba no ranking</h1>
        <p className="text-gray-500 mb-4 text-center">
          Cada vitória conta! Acompanhe sua evolução, conquiste <br /> medalhas
          e veja sua posição entre os melhores jogadores.
        </p>
      </div>
    </div>
  );
}
