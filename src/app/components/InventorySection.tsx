import React, { useState } from 'react';
import { Package, Search, AlertTriangle, ArrowUp, RefreshCw } from 'lucide-react';
import { useStore, Product } from '@/app/lib/store';
import { toast } from 'sonner';

export const InventorySection = () => {
  const { store, update } = useStore();
  const [search, setSearch] = useState('');

  const filteredProducts = store.products.filter((p: Product) => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Stock / Armazém</h1>
          <p className="text-slate-500">Controlo de equipamentos e níveis de inventário.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white text-slate-600 border border-slate-200 px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-50 transition-all">
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Itens</p>
          <p className="text-3xl font-bold text-slate-900">{store.products.reduce((acc: number, p: Product) => acc + p.stock, 0)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-amber-500">
          <p className="text-sm font-medium text-slate-500 mb-1">Stock Baixo</p>
          <p className="text-3xl font-bold text-amber-600">{store.products.filter((p: Product) => p.stock > 0 && p.stock <= 2).length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-red-500">
          <p className="text-sm font-medium text-slate-500 mb-1">Ruptura de Stock</p>
          <p className="text-3xl font-bold text-red-600">{store.products.filter((p: Product) => p.stock === 0).length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Procurar equipamento no armazém..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Equipamento</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Preço Base</th>
              <th className="px-6 py-4">Stock Atual</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredProducts.map((product: Product) => (
              <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{product.name}</p>
                      <p className="text-[10px] text-slate-500">{product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{product.category}</span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">{product.price.toLocaleString()} AO</td>
                <td className="px-6 py-4">
                  <p className={`text-sm font-bold ${product.stock === 0 ? 'text-red-600' : product.stock <= 2 ? 'text-amber-600' : 'text-slate-900'}`}>
                    {product.stock} un.
                  </p>
                </td>
                <td className="px-6 py-4">
                  {product.stock === 0 ? (
                    <span className="flex items-center gap-1.5 text-red-600 text-[10px] font-bold uppercase">
                      <AlertTriangle className="w-3 h-3" /> Esgotado
                    </span>
                  ) : product.stock <= 2 ? (
                    <span className="flex items-center gap-1.5 text-amber-600 text-[10px] font-bold uppercase">
                      <AlertTriangle className="w-3 h-3" /> Crítico
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-green-600 text-[10px] font-bold uppercase">
                      Disponível
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 text-xs font-bold hover:underline">Ajustar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
