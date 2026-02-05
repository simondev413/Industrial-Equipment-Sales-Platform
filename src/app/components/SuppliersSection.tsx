import React, { useState } from 'react';
import { Truck, Plus, Mail, MapPin, Phone, Briefcase } from 'lucide-react';
import { useStore, Supplier } from '@/app/lib/store';
import { toast } from 'sonner';

export const SuppliersSection = () => {
  const { store, update } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [newSup, setNewSup] = useState({
    name: '', email: '', contact: '', category: 'Resfriamento', address: ''
  });

  const handleAdd = () => {
    if (!newSup.name || !newSup.email) return toast.error("Preencha os campos obrigatórios");
    
    const supplier: Supplier = {
      id: `SUP-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      ...newSup
    };

    update('suppliers', [...(store.suppliers || []), supplier]);
    setShowModal(false);
    toast.success("Fornecedor registado com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Parceiros e Fornecedores</h1>
          <p className="text-slate-500">Entidades certificadas para fornecimento de equipamentos MEGA-AR.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" /> Novo Fornecedor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(store.suppliers || []).map((sup: Supplier) => (
          <div key={sup.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Truck className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase">
                {sup.category}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">{sup.name}</h3>
            <div className="space-y-3 text-sm text-slate-500">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {sup.email}</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {sup.contact}</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {sup.address}</div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
            <h2 className="text-xl font-bold mb-6">Registar Fornecedor</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Nome da Empresa" className="w-full p-3 bg-slate-50 border rounded-xl outline-none" onChange={e => setNewSup({...newSup, name: e.target.value})} />
              <input type="email" placeholder="E-mail para Encomendas" className="w-full p-3 bg-slate-50 border rounded-xl outline-none" onChange={e => setNewSup({...newSup, email: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Contacto" className="w-full p-3 bg-slate-50 border rounded-xl outline-none" onChange={e => setNewSup({...newSup, contact: e.target.value})} />
                <select className="w-full p-3 bg-slate-50 border rounded-xl outline-none" onChange={e => setNewSup({...newSup, category: e.target.value})}>
                  <option>Resfriamento</option>
                  <option>Ventilação</option>
                  <option>Peças</option>
                </select>
              </div>
              <input type="text" placeholder="Morada/Sede" className="w-full p-3 bg-slate-50 border rounded-xl outline-none" onChange={e => setNewSup({...newSup, address: e.target.value})} />
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 font-bold text-slate-500">Cancelar</button>
              <button onClick={handleAdd} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl">Gravar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};