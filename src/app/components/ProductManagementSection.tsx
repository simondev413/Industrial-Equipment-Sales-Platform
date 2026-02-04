import React, { useState } from 'react';
import { PlusSquare, Search, Tag, Box, DollarSign, List, Edit2, Trash2 } from 'lucide-react';
import { useStore, Product } from '@/app/lib/store';
import { toast } from 'sonner';

export const ProductManagementSection = () => {
  const { store, update } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Resfriamento',
    stock: 0
  });

  const handleAdd = () => {
    if (!newProduct.name || newProduct.price <= 0) {
      toast.error('Preencha os dados do produto corretamente');
      return;
    }

    const product: Product = {
      id: `P-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      ...newProduct
    };

    update('products', [...store.products, product]);
    setShowModal(false);
    toast.success('Produto adicionado ao catálogo');
  };

  const deleteProduct = (id: string) => {
    update('products', store.products.filter((p: Product) => p.id !== id));
    toast.info('Produto removido');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Catálogo</h1>
          <p className="text-slate-500">Adicione ou edite os equipamentos comercializados pela MEGA-AR.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <PlusSquare className="w-5 h-5" />
          Novo Produto
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Produto</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Preço</th>
              <th className="px-6 py-4">Stock Inicial</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {store.products.map((p: Product) => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-900">{p.name}</p>
                  <p className="text-[10px] text-slate-500 truncate max-w-xs">{p.description}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{p.category}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">{p.price.toLocaleString()} AO</td>
                <td className="px-6 py-4 text-sm text-slate-600 font-bold">{p.stock} un.</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                  <button 
                    onClick={() => deleteProduct(p.id)}
                    className="p-2 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Novo Equipamento Industrial</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-bold text-slate-700 block mb-2">Nome do Produto</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">Categoria</label>
                <select 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                >
                  <option>Resfriamento</option>
                  <option>Aquecimento</option>
                  <option>Ventilação</option>
                  <option>Central</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">Preço ( AO)</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-bold text-slate-700 block mb-2">Descrição Técnica</label>
                <textarea 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none h-24"
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                ></textarea>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">Stock Inicial</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAdd}
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg"
              >
                Criar Produto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
