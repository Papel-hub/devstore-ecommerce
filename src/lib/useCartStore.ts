import { create } from 'zustand';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface Product {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
  quantidade: number;
}

interface CartStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  loadCart: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  loadCart: async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const cartRef = doc(db, 'carrinhos', user.uid);
      const cartSnap = await getDoc(cartRef);
      if (cartSnap.exists()) {
        set({ items: cartSnap.data().items });
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    }
  },

  addItem: async (product) => {
    const user = auth.currentUser;
    if (!user) {
      alert('Faça login para adicionar ao carrinho');
      return;
    }

    const currentItems = get().items;
    const existing = currentItems.find(item => item.id === product.id);

    let updatedItems;
    if (existing) {
      updatedItems = currentItems.map(item =>
        item.id === product.id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      );
    } else {
      updatedItems = [...currentItems, { ...product, quantidade: 1 }];
    }

    set({ items: updatedItems });

    // Salvar no Firebase
    try {
      const cartRef = doc(db, 'carrinhos', user.uid);
      await setDoc(cartRef, { items: updatedItems });
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
    }
  },

  removeItem: async (id) => {
    const user = auth.currentUser;
    if (!user) return;

    const currentItems = get().items;
    const updatedItems = currentItems
      .map(item => ({ ...item, quantidade: item.quantidade - 1 }))
      .filter(item => item.quantidade > 0);

    set({ items: updatedItems });

    try {
      const cartRef = doc(db, 'carrinhos', user.uid);
      await setDoc(cartRef, { items: updatedItems });
    } catch (error) {
      console.error('Erro ao atualizar carrinho:', error);
    }
  },

  clearCart: async () => {
    const user = auth.currentUser;
    if (!user) return;

    set({ items: [] });

    try {
      const cartRef = doc(db, 'carrinhos', user.uid);
      await setDoc(cartRef, { items: [] });
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
    }
  },
}));