import { toast } from "sonner";
import { STORAGE_KEY } from "./env";
import  { useState,useEffect } from 'react'


export type UserRole = 'admin' | 'employee' | 'client';
export type Department = 'sales' | 'stock' | 'management' | null; // Novo

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'client';
  department: Department; // Campo obrigatório para funcionários
  avatar: string;
  clientId?: string;
  password: string;
}


export interface Supplier {
  id: string;
  name: string;
  contact: string;
  category: string;
}


export interface Client {
  id: string;
  name: string;
  nif: string;
  address: string;
  email: string;
  hasSpecialCredit: boolean;
}


export interface Inquiry {
  id: string;
  clientId: string;
  productId?: string; // Novo campo opcional
  date: string;
  equipmentType: string;
  details: string;
  status: 'pending' | 'catalog_sent' | 'interested' | 'rejected' | 'proposal_sent';
  assignedTo?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

export interface SalesOrder {
  id: string;
  clientId: string;
  productId: string;
  date: string;
  quantity: number;
  status: 'pending' | 'satisfied' | 'backordered';
  // Atualizado:
  paymentMethod: 'full' | 'installments' | 'cash' | 'transfer'; 
  paymentStatus: 'pending' | 'paid'; 
}
export interface PurchaseOrder {
  id: string;
  supplierId: string;
  productId: string;
  quantity: number;
  date: string;
  status: 'ordered' | 'received';
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
}

export interface Notification {
  id: string;
  userId: string; // Target user
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}


// No ficheiro store.ts, altera a função getStore:

const initialData = {
  users: [
    { id: 'u1', name: 'Admin Master', email: 'admin@mega-ar.pt', role: 'admin', department: 'admin', avatar: '...',password: 'admin123' },
    { id: 'u2', name: 'João Vendas', email: 'vendas@mega-ar.pt', role: 'employee', department: 'vendas', avatar: '...',password: 'vendas123'} ,
    { id: 'u3', name: 'Maria Stock', email: 'stock@mega-ar.pt', role: 'employee', department: 'stock', avatar: '...',password: 'stock123'  }
  ],
  suppliers: [
    { id: 's1', name: 'CoolTech Global', contact: 'comercial@cooltech.com', category: 'Chillers' },
    { id: 's2', name: 'HVAC Parts', contact: 'suporte@hvac.com', category: 'Componentes' }
  ],
  clients: [],
  inquiries: [],
  products: [],
  salesOrders: [],
  purchaseOrders: [],
  notifications: [],
  currentUser: null
};

export const getStore = () => {
  if (typeof window === 'undefined') return initialData; // Safe check para SSR

  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }

  try {
    const parsed = JSON.parse(data);
    // IMPORTANTE: Faz um merge com o initialData para garantir que chaves novas existam
    return { ...initialData, ...parsed };
  } catch (e) {
    return initialData;
  }
};

export const saveStore = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const useStore = () => {
  const [store, setStore] = useState(getStore());

  useEffect(() => {
    // Função para atualizar o estado quando houver mudanças
    const handleUpdate = () => {
      setStore(getStore());
    };

    // Escuta o evento personalizado que criaste no update()
    window.addEventListener('storage-update', handleUpdate);
    // Escuta mudanças de outras abas do navegador
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('storage-update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const update = (key: string, value: any) => {
    const currentStore = getStore();
    const newStore = { ...currentStore, [key]: value };
    saveStore(newStore);
    
    // Dispara o evento para avisar todos os componentes que usam useStore
    window.dispatchEvent(new Event('storage-update'));
    return newStore;
  };


  const notify = (userId: string, title: string, message: string, type: Notification['type'] = 'info') => {
    const newNotify: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      title,
      message,
      date: new Date().toISOString(),
      read: false,
      type
    };
    const currentNotifications = getStore().notifications;
    update('notifications', [newNotify, ...currentNotifications]);
  };

  return { store, update, notify };
};

