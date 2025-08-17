import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DevStore - E-commerce de Produtos Digitais',
  description: 'Loja de cursos, e-books e templates para devs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1 bg-gray-50 dark:bg-gray-900">
              {children}
            </main>
            <footer className="p-4 text-center text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} DevStore. Todos os direitos reservados.
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}