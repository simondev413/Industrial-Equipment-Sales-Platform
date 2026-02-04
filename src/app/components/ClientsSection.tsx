import React, { useState } from 'react';
import { Users, Plus, Search, Mail, MapPin, CreditCard } from 'lucide-react';
import { useStore, Client } from '@/app/lib/store';
import { toast } from 'sonner';

export const ClientsSection = () => {
  const { store, update } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    nif: '',
    address: '',
    email: '',
    hasSpecialCredit: false
  });

  const handleAddClient = () => {
    if (!newClient.name || !newClient.nif) {
      toast.error('Nome e NIF são obrigatórios');
      return;
    }

    const client: Client = {
      id: Math.random().toString(36).substr(2, 9),
      ...newClient
    };

    update('clients', [...store.clients, client]);
    setShowModal(false);
    toast.success('Cliente registado com sucesso');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Base de Clientes</h1>
          <p className="text-slate-500">Gestão de identidicação e condições comerciais.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus className="w-5 h-5" />
          Novo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {store.clients.map((client: Client) => (
          <div key={client.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <Users className="w-6 h-6" />
              </div>
              {client.hasSpecialCredit && (
                <div className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <CreditCard className="w-3 h-3" /> Crédito Especial
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-1">{client.name}</h3>
            <p className="text-sm text-slate-500 mb-6">NIF: {client.nif}</p>
            
            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                {client.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />
                {client.address}
              </div>
            </div>

            <button className="w-full mt-6 py-2 bg-slate-50 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100 transition-all">
              Ver Histórico de Ofícios
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Registar Novo Cliente</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-bold text-slate-700 block mb-2">Nome da Empresa</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    placeholder="Ex: MEGA-AR"
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">NIF</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    placeholder="500000000"
                    onChange={(e) => setNewClient({...newClient, nif: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">E-mail</label>
                  <input 
                    type="email" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    placeholder="vendas@cliente.pt"
                    onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-bold text-slate-700 block mb-2">Morada</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    placeholder="Rua das Indústrias, nº 1"
                    onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                  />
                </div>
                <div className="col-span-2 flex items-center gap-3 mt-2">
                  <input 
                    type="checkbox" 
                    id="specialCredit"
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    onChange={(e) => setNewClient({...newClient, hasSpecialCredit: e.target.checked})}
                  />
                  <label htmlFor="specialCredit" className="text-sm font-bold text-slate-700">Atribuir Crédito Especial (Pagamento em prestações)</label>
                </div>
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
                onClick={handleAddClient}
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                Criar Cliente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
