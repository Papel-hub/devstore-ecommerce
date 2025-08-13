'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { toast } from 'react-toastify';

// Ícones
import { 
  UserCircleIcon, 
   EnvelopeIcon, 
  ClockIcon, 
  ArrowRightOnRectangleIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';

export default function PerfilPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await auth.signOut();
      toast.success('Até logo!');
      router.push('/');
    } catch (error) {
      toast.error('Erro ao sair. Tente novamente.');
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Botão Voltar */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Voltar
          </button>

          {/* Card Principal */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-white text-center">
              <UserCircleIcon className="h-20 w-20 mx-auto mb-3 text-white" />
              <h1 className="text-2xl font-bold">Meu Perfil</h1>
              <p className="text-indigo-100">Informações da conta e configurações</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Dados do Usuário */}
              <div className="border-b dark:border-gray-700 pb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <UserCircleIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                  Informações Pessoais
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <UserCircleIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>Nome:</strong> {user.displayName || 'Não informado'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>Email:</strong> {user.email}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>ID:</strong> {user.uid.slice(0, 8)}...
                    </span>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex justify-end">
<button onClick={handleLogout} disabled={logoutLoading}>
  {logoutLoading ? (
    'Saindo...'
  ) : (
    <>
      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
      Sair da Conta
    </>
  )}
</button>
              </div>
            </div>
          </div>

          {/* Dica */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Seu perfil é seguro e sincronizado com o Firebase Authentication.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}