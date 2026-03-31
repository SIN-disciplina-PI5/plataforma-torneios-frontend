import Link from 'next/link';

import Image from "next/image";
import { RecuperarSenhaForm } from "@/components/auth/RecuperarSenhaForm";

export default function RecuperarSenha() {
  return (

  
    <div className="flex flex-col lg:flex-row items-center justify-center bg-white min-h-screen gap-10 px-4 py-10 lg:py-0">
      
      {/* FORM */}
      <div className="flex flex-col justify-center w-full max-w-md">
        <p className="text-black-500 mb-6 text-sm lg:text-base">
          <Link href="/login"> ↤ Voltar para o Login</Link>
    </p>
        <h1 className="text-3xl lg:text-4xl font-bold text-black mb-4">
          Recuperação de senha
        </h1>

        <p className="text-gray-500 mb-6 text-sm lg:text-base">
          Insira seu email abaixo para recuperar a sua senha
        </p>

        <RecuperarSenhaForm />
      </div>

      {/* IMAGEM */}
      <div className="flex flex-col items-center justify-center  w-full max-w-md p-6 lg:p-12  rounded-lg mb-10 lg:mb-0">
        <Image
          src="/RecuperarSenhaImage.png"
          alt="Imagem da tela de login"
          className="mb-6 lg:mb-12 w-64 lg:w-96 h-auto"
          width={400}
          height={400}
        />

      </div>
    </div>
  );
}
