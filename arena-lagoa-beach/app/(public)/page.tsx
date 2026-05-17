import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F2E8] flex flex-col">


      <header className="flex items-center justify-between px-24 py-8">
        <div className="flex flex-col leading-none">
          <span className="text-3xl font-extrabold tracking-tight text-[#1B5E42]">ARENA</span>
          <span className="text-xs font-semibold tracking-[0.3em] text-[#1B5E42]">LAGOA BEACH</span>
        </div>

        <nav className="flex items-center gap-4">
          <Link
            href="/cadastro"
            className="px-10 py-4 rounded-full bg-[#2E7D55] text-white text-base font-semibold hover:bg-[#1B5E42] transition-colors"
          >
            Cadastro
          </Link>
          <Link
            href="/login"
            className="px-10 py-4 rounded-full border-2 border-[#333] text-[#333] text-base font-semibold hover:bg-[#333] hover:text-white transition-colors"
          >
            Login
          </Link>
        </nav>
      </header>


      <main className="flex flex-1 items-center justify-center gap-16 px-24 py-12">

        <div className="flex flex-col gap-5 max-w-2xl">
          <p className="text-[#555] text-2xl">Jogue com o pé na Areia!</p>
          <h1 className="text-7xl font-extrabold text-[#2D2D2D] leading-tight">
            Arena Lagoa Beach
          </h1>
          <p className="text-[#666] text-xl mt-2">
            Participe de Torneios e viva o futevôlei na Lagoa Beach.
          </p>
        </div>


        <div className="relative w-[600px] h-[500px] flex-shrink-0">
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