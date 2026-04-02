import Link from 'next/link';
import Image from "next/image";
import { NovaSenhaForm } from "@/components/auth/NovaSenhaForm";

export default function NovaSenha() {
  return (
    <div className="flex flex-col lg:flex-row items-start justify-center bg-white h-screen overflow-hidden gap-10 px-4">

      {/* FORM */}
      <div className="font-inter flex flex-col w-full max-w-md mt-[204px]">
        <h1 className="text-3xl lg:text-4xl text-[#313131] font-bold mb-4">
          Insira uma nova senha
        </h1>

        <p className="text-[#666666] mb-8 text-[11px] lg:text-[14.3px] font-poppins">
          Sua senha anterior foi resetada. Por favor escolha uma nova senha 
          para a sua conta.
        </p>

        <NovaSenhaForm />
      </div>

      {/* IMAGEM */}
      <div className="flex flex-col items-center w-full max-w-[700px] mt-[104px]">
        <Image
          src="/RecuperarSenhaImage.png"
          alt="Imagem da tela de login"
          className="w-full max-h-[calc(100vh-200px)] object-contain rounded-[30px]"
          width={700}
          height={900}
          priority
        />
      </div>
    </div>
  );
}