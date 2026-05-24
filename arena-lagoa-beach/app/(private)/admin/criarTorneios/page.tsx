'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CriarTorneioPageDeprecated() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/torneios');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4" />
        <p className="text-gray-600 font-medium">Redirecionando...</p>
      </div>
    </div>
  );
}
