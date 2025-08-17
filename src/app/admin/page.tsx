'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// Ícones do Heroicons
import { 
  UserCircleIcon, 
  ShieldCheckIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';

export default function AdminPage() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Verifica autenticação
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser && firebaseUser.email === "admin@devstore.com") {
      setUser(firebaseUser);
    } else if (firebaseUser) {
      toast.error("Acesso negado! Apenas administradores podem acessar.");
      router.push("/");
    } else {
      router.push("/login");
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, [router]);


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!nome.trim() || !descricao.trim() || !preco || !imagem) {
    toast.error('Todos os campos são obrigatórios!');
    return;
  }

  try {
    await addDoc(collection(db, 'produtos'), {
      nome: nome.trim(),
      descricao: descricao.trim(),
      preco: parseFloat(preco),
      imagem: imagem.trim(),
    });

    toast.success('✅ Produto cadastrado com sucesso!');

    // Limpa o formulário
    setNome('');
    setDescricao('');
    setPreco('');
    setImagem('');

  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    toast.error('❌ Erro ao cadastrar produto. Tente novamente.');
  }
};


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">Carregando painel de admin...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 flex items-center gap-4 border-l-4 border-blue-500">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
            <ShieldCheckIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Painel de Administração</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Bem-vindo, <span className="font-semibold">{user.displayName || 'Admin'}</span> |{' '}
              <span className="text-sm text-gray-500">{user.email}</span>
            </p>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
            <h2 className="text-xl font-semibold flex items-center">
              <UserCircleIcon className="h-6 w-6 mr-2" />
              Cadastrar Novo Produto
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome do Produto
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Ex: Curso de React Avançado"
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descrição
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Descreva o produto com detalhes..."
                required
              />
            </div>

            {/* Preço */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preço (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="99.90"
                required
              />
            </div>

            {/* URL da Imagem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL da Imagem
              </label>
              <input
                type="url"
                value={imagem}
                onChange={(e) => setImagem(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://exemplo.com/imagem.jpg"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Use imagens de hospedagem pública (ex: Imgur, Firebase Storage)
              </p>
            </div>

            {/* Botão */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center transition"
              >
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Cadastrar Produto
              </button>
            </div>
          </form>
        </div>

        {/* Dica */}
        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <ExclamationCircleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" />
            <div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                <strong>Dica:</strong> Após cadastrar, o produto já aparecerá na loja automaticamente.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}