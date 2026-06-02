import Link from 'next/link';
import Image from "next/image";
import { RecuperarSenhaForm } from "@/components/auth/RecuperarSenhaForm";

export default function RecuperarSenha() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 overflow-x-hidden bg-white px-4 py-8 sm:px-6 lg:flex-row lg:items-start lg:gap-10 lg:py-0">

            {/* FORM */}
            <div className="font-inter flex w-full max-w-md flex-col lg:mt-[204px]">
                <p className="text-[#313131] mb-6">
                    <Link href="/esqueceu-senha" className="hover:underline">
                        <span className="mr-2 text-current">❮</span>
                        Voltar
                    </Link>
                </p>

                <h1 className="text-3xl lg:text-4xl text-[#313131] font-bold mb-4">
                    Verifique o código
                </h1>

                <p className="text-[#666666] mb-10 text-[11px] lg:text-[14.3px] font-poppins lg:whitespace-nowrap">
                    Um código de autenticaçõo foi enviado para o seu email
                </p>

                <RecuperarSenhaForm />

    
            </div>

            {/* IMAGEM */}
            <div className="flex w-full max-w-[700px] flex-col items-center lg:mt-[104px]">
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
