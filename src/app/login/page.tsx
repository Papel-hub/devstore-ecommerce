'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile 
} from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Ícones do Heroicons (nomes corretos)
import { 
  UserCircleIcon, 
  LockClosedIcon, 
  EnvelopeIcon,     
  EyeIcon, 
  EyeSlashIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

// Ícone do Google
import { GoogleIcon } from '@/components/GoogleIcon';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true); // true = login, false = cadastro
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();
  const provider = new GoogleAuthProvider();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);

    try {
      if (isLogin) {
        // Login com email e senha
        await signInWithEmailAndPassword(auth, email, senha);
        toast.success('Bem-vindo de volta!');
      } else {
        // Cadastro de novo usuário
        if (!nome.trim()) {
          toast.error('Por favor, insira seu nome');
          setCarregando(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        await updateProfile(userCredential.user, { displayName: nome });
        toast.success('Conta criada com sucesso!');
      }
      router.push('/');
    } catch (error) {
      let mensagem = 'Erro ao processar';
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          mensagem = 'Email ou senha inválidos';
          break;
        case 'auth/email-already-in-use':
          mensagem = 'Este email já está em uso';
          break;
        case 'auth/weak-password':
          mensagem = 'A senha deve ter pelo menos 6 caracteres';
          break;
        default:
          mensagem = error.message;
      }
      toast.error(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  const handleGoogleLogin = async () => {
    setCarregando(true);
    try {
      await signInWithPopup(auth, provider);
      toast.success('Logado com Google!');
      router.push('/');
    } catch (error) {
      toast.error('Erro ao fazer login com Google: ' + error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md transition-all">
        <div className="text-center mb-8">
          <UserCircleIcon className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {isLogin 
              ? 'Faça login para continuar' 
              : 'Cadastre-se para começar'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Nome (só no cadastro) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCircleIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full pl-10 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Seu nome"
                />
              </div>
            </div>
          )}

          {/* Campo Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
<div className="relative">
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
  </div>
  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full pl-10 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
    placeholder="seu@email.com"
    required
  />
</div>
          </div>

          {/* Campo Senha com toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full pl-10 pr-10 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Sua senha"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {mostrarSenha ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Botão de submit */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition"
          >
            {carregando ? 'Processando...' : isLogin ? 'Entrar' : 'Cadastrar'}
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          <span className="px-4 text-sm text-gray-500 dark:text-gray-400">ou</span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        {/* Login com Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={carregando}
          className="w-full flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition font-medium"
        >
          <GoogleIcon className="h-5 w-5 mr-3" />
          {isLogin ? 'Entrar com Google' : 'Cadastrar com Google'}
        </button>

        {/* Link para alternar entre login/cadastro */}
        <div className="text-center mt-6 text-sm">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setNome('');
            }}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {isLogin 
              ? 'Não tem conta? Cadastre-se' 
              : 'Já tem conta? Entrar'}
          </button>
        </div>
      </div>
    </div>
  );
}