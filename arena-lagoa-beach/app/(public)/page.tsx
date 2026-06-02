import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F2E8] flex flex-col">


      <header className="flex flex-col gap-6 px-6 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-24 lg:py-8">
        <div className="flex flex-col leading-none">
        
        </div>

        <nav className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
          <Link
            href="/cadastro"
            className="rounded-full bg-[#2E7D55] px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#1B5E42] sm:px-10 sm:py-4 sm:text-base"
          >
            Cadastro
          </Link>
          <Link
            href="/login"
            className="rounded-full border-2 border-[#333] px-6 py-3 text-center text-sm font-semibold text-[#333] transition-colors hover:bg-[#333] hover:text-white sm:px-10 sm:py-4 sm:text-base"
          >
            Login
          </Link>
        </nav>
      </header>


      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-10 lg:flex-row lg:gap-16 lg:px-24 lg:py-12">

        <div className="flex max-w-2xl flex-col gap-4 text-center lg:gap-5 lg:text-left">
          <p className="text-lg text-[#555] sm:text-2xl">Jogue com o pé na Areia!</p>
          <h1 className="text-4xl font-extrabold leading-tight text-[#2D2D2D] sm:text-5xl lg:text-7xl">
            Arena Lagoa Beach
          </h1>
          <p className="mt-2 text-base text-[#666] sm:text-xl">
            Participe de Torneios e viva o futevôlei na Lagoa Beach.
          </p>
        </div>


        <div className="relative h-[260px] w-full max-w-[600px] flex-shrink-0 sm:h-[380px] lg:h-[500px]">
          <Image
            src="/basico.png"
            alt="Rede de futevôlei na areia"
            fill
            className="object-contain"
            priority
          />
        </div>
      </main>

    </div>
  );
}
