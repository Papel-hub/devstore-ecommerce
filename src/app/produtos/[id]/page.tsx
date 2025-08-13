'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useCartStore } from '@/lib/useCartStore';
import { toast } from 'react-toastify';

// Ícones do Heroicons
import { 
  ArrowLeftIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon,
  StarIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

interface Avaliacao {
  id: string;
  usuario: string;
  estrelas: number;
  comentario: string;
   string;
}

interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  avaliacoes: Avaliacao[];
}

export default function ProdutoPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    if (!id) {
      toast.error('Produto não encontrado: ID ausente');
      router.push('/');
      return;
    }

    const loadProduct = async () => {
      try {
        const docRef = doc(db, 'produtos', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({
            id: docSnap.id,
            nome: data.nome,
            descricao: data.descricao,
            preco: data.preco,
            imagem: data.imagem,
            avaliacoes: data.avaliacoes || [],
          } as Product);
        } else {
          toast.error('Produto não encontrado.');
          router.push('/');
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
        toast.error('Erro ao carregar produto. Tente novamente.');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, router]);

  const handleBuyNow = () => {
    if (product) {
      setShowModal(true);
    }
  };

  const confirmarCompra = () => {
    addItem(product);
    toast.success(`${product.nome} adicionado ao carrinho!`);
    setShowModal(false);
    router.push('/carrinho');
  };

  const cancelarCompra = () => {
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Produto não encontrado</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">O produto que você procura não existe.</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Voltar para a loja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Botão Voltar */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Voltar
        </button>

        {/* Card do Produto */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Imagem */}
            <div className="md:w-1/2">
              <img
                src={product.imagem || 'https://via.placeholder.com/600x400?text=Sem+Imagem'}
                alt={product.nome}
                className="w-full h-64 md:h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Imagem+Indisponivel';
                }}
              />
            </div>

            {/* Informações */}
            <div className="p-6 md:w-1/2 flex flex-col">
              <h1 className="text-3xl font-bold dark:text-white">{product.nome}</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-3 flex-1">{product.descricao}</p>

              <div className="mt-4 flex items-center">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  R$ {product.preco?.toFixed(2).replace('.', ',')}
                </p>
              </div>

              {/* Botão Comprar */}
              <button
                onClick={handleBuyNow}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition"
              >
                <ShoppingBagIcon className="h-5 w-5 mr-2" />
                Comprar Agora
              </button>
            </div>
          </div>
        </div>

        {/* Seção de Avaliações */}
        <div className="mt-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold dark:text-white mb-4 flex items-center">
            <ChatBubbleLeftIcon className="h-5 w-5 mr-2 text-gray-500" />
            Avaliações dos Clientes
          </h2>

          {product.avaliacoes && product.avaliacoes.length > 0 ? (
            <div className="space-y-4">
              {product.avaliacoes.map((avaliacao) => (
                <div key={avaliacao.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center mb-1">
                    <strong className="text-gray-900 dark:text-white">{avaliacao.usuario}</strong>
                    <div className="flex ml-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < avaliacao.estrelas ? 'text-yellow-500' : 'text-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{avaliacao.comentario}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{avaliacao.data}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Ainda não há avaliações para este produto.</p>
          )}
        </div>

        {/* Dica */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Após a compra, você será redirecionado para o carrinho para finalizar o pedido.
        </p>
      </div>

      {/* Modal de Confirmação */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-bold dark:text-white">Confirmar Compra</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Você deseja adicionar <strong>{product.nome}</strong> ao carrinho?
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={cancelarCompra}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarCompra}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}