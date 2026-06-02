import Link from 'next/link';
import Image from "next/image";
import { RecuperarSenhaForm } from "@/components/auth/RecuperarSenhaForm";

export default function RecuperarSenha() {
    return (
        <div className="flex min-h-screen flex-col items-stretch justify-start gap-0 overflow-x-hidden bg-white px-4 pb-6 pt-24 sm:items-center sm:justify-center sm:gap-8 sm:px-6 sm:py-8 lg:flex-row lg:items-start lg:gap-10 lg:py-0">

            {/* FORM */}
            <div className="font-inter flex w-full max-w-md flex-col lg:mt-[204px]">
                <p className="mb-4 text-[#313131] sm:mb-6">
                    <Link href="/esqueceu-senha" className="hover:underline">
                        <span className="mr-2 text-current">❮</span>
                        Voltar
                    </Link>
                </p>

                <h1 className="mb-3 text-2xl font-bold text-[#313131] sm:mb-4 sm:text-3xl lg:text-4xl">
                    Verifique o código
                </h1>

                <p className="mb-6 text-[11px] font-poppins text-[#666666] sm:mb-10 lg:text-[14.3px] lg:whitespace-nowrap">
                    Um código de autenticaçõo foi enviado para o seu email
                </p>

                <RecuperarSenhaForm />

    
            </div>

            {/* IMAGEM */}
            <div className="hidden w-full max-w-[700px] flex-col items-center sm:flex lg:mt-[104px]">
                <Image
                    src="/RecuperacaoSenhaImage.png"
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
