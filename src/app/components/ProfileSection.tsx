import React from 'react';
import { User, Mail, Shield, Settings, Key, Bell, Globe } from 'lucide-react';

export const ProfileSection = ({ user }: { user: any }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">O Meu Perfil</h1>
        <p className="text-slate-500">Gira as tuas informações e preferências de conta.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
          <div className="absolute -bottom-12 left-8">
            <img 
              src={user?.avatar} 
              alt="Avatar" 
              className="w-24 h-24 rounded-3xl object-cover ring-8 ring-white shadow-xl"
            />
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-slate-500 flex items-center gap-2 mt-1">
              <Shield className="w-4 h-4" /> Administrador de Sistema
            </p>
          </div>
          <button className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all">
            Editar Perfil
          </button>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8 border-t border-slate-50">
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">E-mail Corporativo</p>
                <p className="text-sm font-medium text-slate-900">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Palavra-passe</p>
                <p className="text-sm font-medium text-slate-900">••••••••••••</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 px-4">Preferências</h4>
            
            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">Notificações de Stock</span>
              </div>
              <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">Idioma do Portal</span>
              </div>
              <span className="text-xs font-bold text-blue-600">Português (PT)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
