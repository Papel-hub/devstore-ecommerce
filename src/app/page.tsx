'use client' // ✅ Adicione esta linha no topo

import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'produtos'));
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        setProducts(list);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    };
    loadProducts();
  }, []);

  return (
    <main>
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Bem-vindo à DevStore</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{products.map((product) => (
  <div 
    key={product.id}  // 👈 adiciona a key aqui
    className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer bg-white dark:bg-gray-800 flex flex-col"
  >
    <img src={product.imagem} alt={product.nome} className="w-full h-48 object-cover" />
    <div className="p-4 flex-1 flex flex-col">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{product.nome}</h2>
      <p className="text-gray-600 dark:text-gray-300 mt-1 flex-1 line-clamp-2">{product.descricao}</p>
      <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-2">
        R$ {product.preco}
      </p>
    </div>
  </div>
))}

        </div>
      </div>
    </main>
  );
}