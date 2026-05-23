'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ChevronDown } from 'lucide-react';
import { createTorneio } from '@/app/services/torneioService';

const categorias = [
  { label: 'Amador', value: 'Amador' },
  { label: 'Intermediário', value: 'Intermediário' },
  { label: 'Profissional', value: 'Profissional' },
];

const vagas = [4, 8, 16, 32];

type FormError = {
  [key: string]: string;
};

export default function CriarTorneioPage() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState(categorias[0].value);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [numVagas, setNumVagas] = useState<number | ''>(vagas[0]);
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormError>({});

  // Converter data DD/MM/YYYY para YYYY-MM-DD para o input
  const formatDataParaInput = (dataIso: string) => {
    if (!dataIso) return '';
    try {
      const [ano, mes, dia] = dataIso.split('-');
      return `${ano}-${mes}-${dia}`;
    } catch {
      return '';
    }
  };

  // Converter data YYYY-MM-DD (input) para ISO para o backend
  const formatDataParaBackend = (dataInput: string) => {
    if (!dataInput) return '';
    try {
      const date = new Date(dataInput);
      return date.toISOString();
    } catch {
      return '';
    }
  };

  const validarFormulario = (): boolean => {
    const novoErros: FormError = {};

    if (!nome.trim()) {
      novoErros.nome = 'Nome do torneio é obrigatório';
    }

    if (!categoria) {
      novoErros.categoria = 'Categoria é obrigatória';
    }

    if (!dataInicio) {
      novoErros.dataInicio = 'Data de início é obrigatória';
    }

    if (!dataFim) {
      novoErros.dataFim = 'Data de término é obrigatória';
    }

    if (!numVagas) {
      novoErros.numVagas = 'Número de vagas é obrigatório';
    }

    if (dataInicio && dataFim) {
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);
      if (fim <= inicio) {
        novoErros.dataFim = 'Data de término deve ser posterior à data de início';
      }
    }

    setErrors(novoErros);
    return Object.keys(novoErros).length === 0;
  };

  async function handleCriar() {
    if (!validarFormulario()) {
      toast.error('Verifique os campos do formulário');
      return;
    }

    try {
      setLoading(true);

      const dataInicioIso = formatDataParaBackend(dataInicio);
      const dataFimIso = formatDataParaBackend(dataFim);

      if (!dataInicioIso || !dataFimIso) {
        toast.error('Erro ao processar as datas');
        return;
      }

      const torneioData = {
        nome: nome.trim(),
        categoria,
        vagas: Number(numVagas),
        data_inicio: dataInicioIso,
        data_fim: dataFimIso,
      };

      const resultado = await createTorneio(torneioData);

      if (!resultado) {
        toast.error('Erro ao criar torneio. Tente novamente.');
        return;
      }

      toast.success('Torneio criado com sucesso!');
      
      // Aguardar um pouco para o usuário ver a mensagem
      setTimeout(() => {
        router.push('/admin/torneios');
        router.refresh();
      }, 800);
    } catch (err) {
      console.error(err);
      toast.error('Erro na requisição. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  const isFormularioValido = nome.trim() && categoria && dataInicio && dataFim && numVagas;

  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <main className="w-full max-w-[610px] px-5 pt-6 pb-8">
        <div className="mb-6 flex items-center gap-2">
          <Image
            src="/variante-de-bola-de-futebol.png"
            alt="Bola de futebol"
            width={18}
            height={18}
          />
          <h1 className="text-[20px] font-bold leading-none">
            Criar Torneio
          </h1>
        </div>

        <section className="space-y-7">
          <FormField label="Nome do Torneio" error={errors.nome}>
            <input
              type="text"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                if (errors.nome) {
                  setErrors({ ...errors, nome: '' });
                }
              }}
              placeholder="Ex: Torneio Open"
              className="h-9 w-[272px] max-w-full rounded-md border border-transparent bg-[#f8f8f8] px-3 text-[12px] text-[#8b8b8b] outline-none focus:border-[#25a51f]"
            />
          </FormField>

          <FormField label="Nível" error={errors.categoria}>
            <div className="relative">
              <select
                value={categoria}
                onChange={(e) => {
                  setCategoria(e.target.value);
                  if (errors.categoria) {
                    setErrors({ ...errors, categoria: '' });
                  }
                }}
                className="h-9 w-[272px] max-w-full appearance-none rounded-md border border-transparent bg-[#f8f8f8] px-3 pr-8 text-[12px] text-[#8b8b8b] outline-none focus:border-[#25a51f]"
              >
                {categorias.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#a1a1aa]"
                size={14}
              />
            </div>
          </FormField>

          <div className="flex gap-4">
            <FormField label="Data Início" error={errors.dataInicio} className="flex-1">
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => {
                  setDataInicio(e.target.value);
                  if (errors.dataInicio) {
                    setErrors({ ...errors, dataInicio: '' });
                  }
                }}
                className="h-9 w-full rounded-md border border-transparent bg-[#f8f8f8] px-3 text-[12px] text-[#8b8b8b] outline-none focus:border-[#25a51f]"
              />
            </FormField>

            <FormField label="Data Fim" error={errors.dataFim} className="flex-1">
              <input
                type="date"
                value={dataFim}
                onChange={(e) => {
                  setDataFim(e.target.value);
                  if (errors.dataFim) {
                    setErrors({ ...errors, dataFim: '' });
                  }
                }}
                className="h-9 w-full rounded-md border border-transparent bg-[#f8f8f8] px-3 text-[12px] text-[#8b8b8b] outline-none focus:border-[#25a51f]"
              />
            </FormField>
          </div>

          <FormField label="Número de Vagas" error={errors.numVagas}>
            <div className="relative">
              <select
                value={numVagas}
                onChange={(e) => {
                  setNumVagas(e.target.value ? Number(e.target.value) : '');
                  if (errors.numVagas) {
                    setErrors({ ...errors, numVagas: '' });
                  }
                }}
                className="h-9 w-[272px] max-w-full appearance-none rounded-md border border-transparent bg-[#f8f8f8] px-3 pr-8 text-[12px] text-[#8b8b8b] outline-none focus:border-[#25a51f]"
              >
                {vagas.map((vaga) => (
                  <option key={vaga} value={vaga}>
                    {vaga} vagas
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#a1a1aa]"
                size={14}
              />
            </div>
          </FormField>

          {Object.keys(errors).length > 0 && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2">
              {Object.values(errors).map((erro, idx) => (
                <p key={idx} className="text-[12px] text-red-700">
                  • {erro}
                </p>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleCriar}
            disabled={loading || !isFormularioValido}
            className="h-9 w-[282px] max-w-full rounded-[3px] bg-[#25a51f] text-[11px] font-bold text-white transition hover:bg-[#208d1b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Criando...' : 'Criar'}
          </button>
        </section>
      </main>
    </div>
  );
}

function FormField({ 
  label, 
  children, 
  error,
  className = '',
}: { 
  label: string; 
  children: ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-[11px] font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-[10px] text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
