'use client';

import { useCartStore } from '@/lib/useCartStore';
import { auth } from '@/lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from "firebase/auth";
import { 
  SunIcon, 
  MoonIcon, 
  ShoppingBagIcon, 
  UserCircleIcon,
  XMarkIcon,
  Bars3Icon 
} from '@heroicons/react/24/outline';

export default function Navbar() {
 const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const totalItems = useCartStore(state => 
    state.items.reduce((acc, item) => acc + item.quantidade, 0)
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Verifica preferência de tema
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }

    return () => unsubscribe();
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
    setDarkMode(!darkMode);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/'); // Redireciona para home após sair
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <h1 
              className="text-2xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer"
              onClick={() => router.push('/')}
            >
              DevStore
            </h1>
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            {/* Botão de modo escuro */}
            <button
              onClick={toggleDarkMode}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>

            {/* Carrinho */}
            <button
              onClick={() => router.push('/carrinho')}
              className="relative text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              <ShoppingBagIcon className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Usuário logado ou opções de login */}
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Botão de Perfil */}
                <button
                  onClick={() => router.push('/perfil')}
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <UserCircleIcon className="h-6 w-6" />
                  <span className="text-sm font-medium">Perfil</span>
                </button>

                {/* Botão de Sair */}
                <button 
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button 
                onClick={() => router.push('/login')}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Entrar
              </button>
            )}
          </div>

          {/* Menu Mobile */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 dark:text-gray-300"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4 space-y-4">
            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300"
            >
              {darkMode ? (
                <>
                  <SunIcon className="h-5 w-5" /> <span>Modo Claro</span>
                </>
              ) : (
                <>
                  <MoonIcon className="h-5 w-5" /> <span>Modo Escuro</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  router.push('/carrinho');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300"
              >
                <ShoppingBagIcon className="h-5 w-5" />
                <span>Carrinho</span>
                {totalItems > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            {user ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    router.push('/perfil');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                >
                  <UserCircleIcon className="h-5 w-5" />
                  <span>Meu Perfil</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-500"
                >
                  <UserCircleIcon className="h-5 w-5" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  router.push('/login');
                  setMobileMenuOpen(false);
                }}
                className="text-blue-600 dark:text-blue-400"
              >
                Entrar
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}