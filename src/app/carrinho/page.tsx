'use client';

import { useCartStore } from '@/lib/useCartStore';
import { auth } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { toast } from 'react-toastify';

export default function CarrinhoPage() {
  const carrinho = useCartStore(state => state.items);
  const clearCart = useCartStore(state => state.clearCart);
  const router = useRouter();

  const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  const handleFinalizarCompra = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
const pedido = {
  userId: user.uid,
  itens: carrinho,
  total,
  data: new Date().toISOString(), 
  status: 'confirmado',
};

      await setDoc(doc(db, 'pedidos', Date.now().toString()), pedido);

      // Limpar carrinho
      clearCart();

      // Mostrar sucesso e redirecionar
      toast.success('Compra finalizada com sucesso!');
      router.push('/sucesso');
    } catch (error) {
      toast.error('Erro ao finalizar compra');
      console.error(error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">Seu Carrinho</h1>

        {carrinho.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">Seu carrinho está vazio.</p>
        ) : (
          <div>
            <ul className="space-y-4 mb-6">
              {carrinho.map(item => (
                <li key={item.id} className="flex items-center gap-4 p-4 border rounded-lg bg-white dark:bg-gray-800">
                  <img src={item.imagem} alt={item.nome} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold dark:text-white">{item.nome}</h3>
                    <p className="text-blue-600 dark:text-blue-400">R$ {item.preco} x {item.quantidade}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t pt-4 flex justify-between items-center text-xl font-bold dark:text-white">
              <span>Total: R$ {total.toFixed(2)}</span>
              <button
                onClick={handleFinalizarCompra}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}