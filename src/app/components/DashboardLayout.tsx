import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ShoppingCart, 
  Package, 
  Truck, 
  BookOpen, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  User as UserIcon,
  ShieldCheck,
  PlusSquare,
  ClipboardList,
  icons,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardOverview } from '@/app/components/DashboardOverview';
import { InquiriesSection } from '@/app/components/InquiriesSection';
import { SalesOrdersSection } from '@/app/components/SalesOrdersSection';
import { InventorySection } from '@/app/components/InventorySection';
import { ClientsSection } from '@/app/components/ClientsSection';
import { PurchaseOrdersSection } from '@/app/components/PurchaseOrdersSection';
import { CatalogSection } from '@/app/components/CatalogSection';
import { ProfileSection } from '@/app/components/ProfileSection';
import { ProductManagementSection } from '@/app/components/ProductManagementSection';
import { EmployeeManagementSection } from '@/app/components/EmployeeManagementSection';
import { NotificationCenter } from '@/app/components/NotificationCenter';
import { useStore } from '@/app/lib/store';
import { SuppliersSection } from './SuppliersSection';

interface DashboardLayoutProps {
  user: any;
  onLogout: () => void;
}

export const DashboardLayout = ({ user, onLogout }: DashboardLayoutProps) => {
  const { store } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isEmployee = user?.role === 'employee';
  const isClient = user?.role === 'client';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'employee', 'client'], depts: ['vendas', 'stock', 'admin'] },
  { id: 'inquiries', label: 'Ofícios', icon: FileText, roles: ['admin', 'employee', 'client'], depts: ['vendas', 'admin'] },
  { id: 'clients', label: 'Clientes', icon: Users, roles: ['admin', 'employee'], depts: ['vendas', 'admin'] },
  { id: 'sales', label: 'Vendas', icon: ShoppingCart, roles: ['admin', 'employee', 'client'], depts: ['vendas', 'admin'] },
  { id: 'inventory', label: 'Stock / Armazém', icon: Package, roles: ['admin', 'employee'], depts: ['stock', 'admin'] },
  { id: 'purchase', label: 'Encomendas Fornecedor', icon: Truck, roles: ['admin', 'employee'], depts: ['stock', 'admin'] },
  { id: 'catalog', label: 'Catálogo', icon: BookOpen, roles: ['admin', 'employee', 'client'], depts: ['vendas', 'stock', 'admin'] },
  { id: 'products', label: 'Gerir Produtos', icon: PlusSquare, roles: ['admin', 'employee'], depts: ['stock', 'admin'] },
  { id: 'employees', label: 'Gestão de Equipa', icon: ShieldCheck, roles: ['admin'], depts: ['admin'] },
  { id:'suppliers',label:'Fornecedores',icon:Briefcase,roles:['admin','employee'],depts:['admin','stock']}
];

// Filtro robusto 
const filteredMenuItems = menuItems.filter(item => {
  const hasRole = item.roles.includes(user?.role);
  
  // Se for cliente ou admin, a lógica de departamento é simplificada
  if (user?.role === 'client') return hasRole;
  if (user?.role === 'admin') return hasRole;

  // Para funcionários (employee), verifica se o departamento dele tem permissão para o item
  const hasDept = user?.department && item.depts.includes(user.department);
  return hasRole && hasDept;
});

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview role={user?.role} />;
      case 'inquiries': return <InquiriesSection role={user?.role} userId={user?.id} clientId={user?.clientId} />;
      case 'sales': return <SalesOrdersSection role={user?.role} clientId={user?.clientId} />;
      case 'inventory': return <InventorySection role={user?.role} />;
      case 'clients': return <ClientsSection />;
      case 'purchase': return <PurchaseOrdersSection />;
      case 'catalog': return <CatalogSection />;
      case 'products': return <ProductManagementSection />;
      case 'suppliers':return <SuppliersSection />
      case 'employees': return <EmployeeManagementSection />;
      case 'profile': return <ProfileSection user={user} />;
      default: return <DashboardOverview role={user?.role} />;
    }
  };

  const unreadCount = store.notifications?.filter((n: any) => n.userId === user?.id && !n.read).length || 0;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight">MEGA-AR {user?.role.toUpperCase()}</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-2">
          {filteredMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
          <button 
            onClick={() => setActiveTab('profile')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 transition-all"
          >
            <UserIcon className="w-5 h-5" />
            O Meu Perfil
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <NotificationCenter 
                    user={user} 
                    onClose={() => setShowNotifications(false)} 
                  />
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{user?.role}</p>
              </div>
              <img 
                src={user?.avatar} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>
    </div>
  );
};
