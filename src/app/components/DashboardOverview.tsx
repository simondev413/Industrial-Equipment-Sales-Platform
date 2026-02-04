import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, Package, Users, FileText, ArrowUpRight, ArrowDownRight,
  Clock, Shield, Activity, HelpCircle
} from 'lucide-react';
import { useStore, UserRole } from '@/app/lib/store';

const dataSales = [
  { name: 'Jan', sales: 4000 },
  { name: 'Fev', sales: 3000 },
  { name: 'Mar', sales: 2000 },
  { name: 'Abr', sales: 2780 },
  { name: 'Mai', sales: 1890 },
  { name: 'Jun', sales: 2390 },
];

const COLORS = ['#2563eb', '#3b82f6', '#93c5fd', '#1d4ed8'];

export const DashboardOverview = ({ role }: { role: UserRole }) => {
  const { store } = useStore();

  const isAdmin = role === 'admin';
  const isEmployee = role === 'employee';
  const isClient = role === 'client';

  const stats = [
    { 
      label: isClient ? 'Meus Ofícios' : 'Vendas Totais', 
      value: isClient ? store.inquiries.filter((i: any) => i.clientId === store.currentUser?.clientId).length : '142.000AO', 
      change: '+12.5%', icon: isClient ? FileText : TrendingUp, up: true 
    },
    { 
      label: isClient ? 'Encomendas' : 'Pedidos Pendentes', 
      value: isClient ? store.salesOrders.filter((s: any) => s.clientId === store.currentUser?.clientId).length : (store.inquiries.filter((i: any) => i.status === 'pending').length || '5'), 
      change: isClient ? 'Novas' : '-2', icon: isClient ? Package : Activity, up: !isClient 
    },
    { 
      label: 'Itens em Catálogo', 
      value: store.products.length, 
      change: 'Ativos', icon: Package, up: true 
    },
    { 
      label: isClient ? 'Pontos Fidelidade' : 'Novos Clientes', 
      value: isClient ? '1.250' : (store.clients.length || '24'), 
      change: '+4', icon: isClient ? Shield : Users, up: true 
    },
  ];

  const recentActivities = [
    { title: 'Novo Ofício Recebido', desc: 'Indústria Têxtil Norte - Solicitação de Chiller', time: 'Há 10 min', status: 'pendente' },
    { title: 'Nota de Aquisição Gerada', desc: 'Logística Sul S.A. - Split Ductless x4', time: 'Há 2 horas', status: 'concluído' },
    { title: 'Stock em Baixa', desc: 'Chiller Industrial 500kW - Apenas 2 unidades', time: 'Há 5 horas', status: 'alerta' },
  ];

  const clientActivities = [
    { title: 'Proposta Recebida', desc: 'A MEGA-AR enviou uma proposta para o Chiller.', time: 'Ontem', status: 'concluído' },
    { title: 'Catálogo Solicitado', desc: 'Recebeu o catálogo de sistemas VRF.', time: 'Há 2 dias', status: 'concluído' },
  ];

  const activitiesToShow = isClient ? clientActivities : recentActivities;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isClient ? 'Bem-vindo ao Portal do Cliente' : 'Visão Geral do Sistema'}
          </h1>
          <p className="text-slate-500">
            {isClient ? 'Acompanhe as suas solicitações e propostas MEGA-AR.' : 'Monitorização em tempo real das operações MEGA-AR.'}
          </p>
        </div>
        <div className="px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-600">{new Date().toLocaleDateString('pt-PT')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl ${stat.up ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center text-xs font-bold ${stat.up ? 'text-green-600' : 'text-blue-600'}`}>
                {stat.change}
                {stat.up ? <ArrowUpRight className="w-3 h-3 ml-1" /> : <ArrowDownRight className="w-3 h-3 ml-1" />}
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {!isClient && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-8">Performance Operacional</h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataSales}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Segurança MEGA-AR</h3>
            <p className="text-sm text-slate-500 mb-8">O sistema está a operar em conformidade com as normas ISO de climatização industrial.</p>
            <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all text-xs">
              Ver Relatório de Conformidade
            </button>
          </div>
        </div>
      )}

      {isClient && (
        <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-200">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="max-w-md text-center md:text-left">
              <h2 className="text-2xl font-bold mb-4">Precisa de assistência técnica imediata?</h2>
              <p className="text-blue-100 mb-6">A nossa equipa de engenheiros está disponível 24/7 para suporte em sistemas industriais críticos.</p>
              <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all flex items-center gap-2 mx-auto md:mx-0">
                <HelpCircle className="w-5 h-5" /> Abrir Ticket de Suporte
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
                <p className="text-2xl font-black">24h</p>
                <p className="text-[10px] uppercase font-bold text-blue-200">Tempo Resposta</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
                <p className="text-2xl font-black">99%</p>
                <p className="text-[10px] uppercase font-bold text-blue-200">Uptime Sist.</p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h2 className="font-bold text-slate-900">Atividades Recentes</h2>
          <button className="text-blue-600 text-sm font-semibold hover:underline">Ver todas</button>
        </div>
        <div className="divide-y divide-slate-50">
          {activitiesToShow.map((activity, i) => (
            <div key={i} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.status === 'pendente' ? 'bg-blue-50 text-blue-600' : 
                  activity.status === 'concluído' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{activity.title}</p>
                  <p className="text-xs text-slate-500">{activity.desc}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
