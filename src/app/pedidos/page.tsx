'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Pedido {
  id: string;
  itens: Array<{
    id: string;
    nome: string;
    preco: number;
    quantidade: number;
    imagem: string;
  }>;
  total: number;
   string;
  status: string;
}

export default function MeusPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPedidos = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const q = query(
          collection(db, 'pedidos'),
          where('userId', '==', user.uid),
          orderBy('data', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const lista = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Pedido[];
        setPedidos(lista);
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [router]);

  if (loading) {
    return <div className="p-6 text-center">Carregando seus pedidos...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold dark:text-white mb-6">Meus Pedidos</h1>

        {pedidos.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">Você ainda não fez nenhum pedido.</p>
        ) : (
          <div className="space-y-6">
            {pedidos.map(pedido => (
              <div key={pedido.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p><strong>Pedido:</strong> #{pedido.id.slice(-6).toUpperCase()}</p>
                    <p><strong>Data:</strong> {new Date(pedido.data).toLocaleDateString('pt-BR')}</p>
                    <p>
                      <strong>Status:</strong>{' '}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        pedido.status === 'confirmado'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {pedido.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                      </span>
                    </p>
                  </div>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    R$ {pedido.total.toFixed(2)}
                  </p>
                </div>

                <div>
                  <strong>Itens:</strong>
                  <div className="mt-2 space-y-2">
                    {pedido.itens.map(item => (
                      <div key={item.id} className="flex gap-3">
                        <img src={item.imagem} alt={item.nome} className="w-12 h-12 object-cover rounded" />
                        <div className="flex-1">
                          <p className="text-sm dark:text-white">{item.nome}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {item.quantidade}x R$ {item.preco} = R$ {(item.preco * item.quantidade).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}