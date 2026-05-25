import Link from 'next/link';
import Image from "next/image";
import { EsqueceuSenhaForm } from "@/components/auth/EsqueceuSenhaForm";

export default function EsqueceuSenha() {
  return (
    <div className="flex flex-col lg:flex-row items-start justify-center bg-white h-screen overflow-hidden gap-10 px-4">

      {/* FORM */}
      <div className="font-inter flex flex-col w-full max-w-md mt-[204px]">
        <p className="text-[#313131] mb-6">
          <Link href="/login" className="hover:underline">
            <span className="mr-2 text-current">❮</span>
            Voltar para o Login
          </Link>
        </p>

        <h1 className="text-3xl lg:text-4xl text-[#313131] font-bold mb-4">
          Esqueceu a senha?
        </h1>

        <p className="text-[#666666] mb-10 text-[11px] lg:text-[14.3px] font-poppins whitespace-nowrap">
  Insira seu email abaixo para recuperar a sua senha
</p>

        <EsqueceuSenhaForm />

        {/* LINHAS ABAIXO DO BOTÃO */}
        <div className="flex items-center w-full mt-10 gap-2">
          <div className="h-[1px] flex-1 bg-[#E5E5E5]"></div>
          <div className="h-[1px] flex-1 bg-[#E5E5E5]"></div>
        </div>
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