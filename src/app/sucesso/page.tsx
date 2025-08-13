'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/lib/useCartStore';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const clearCart = useCartStore(state => state.clearCart);
  const router = useRouter();

  useEffect(() => {
    // Limpa o carrinho
    clearCart();

    // Redireciona após 5 segundos
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [clearCart, router]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">🎉 Compra realizada com sucesso!</h1>
      <p className="mt-4 text-gray-700 dark:text-gray-300">
        Obrigado pela sua compra. Em breve você receberá um e-mail de confirmação.
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Redirecionando para a home em 5 segundos...
      </p>
    </div>
  );
}