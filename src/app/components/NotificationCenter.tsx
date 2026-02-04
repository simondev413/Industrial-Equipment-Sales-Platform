import React from 'react';
import { motion } from 'framer-motion';
import { X, Bell, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useStore, Notification } from '@/app/lib/store';

interface NotificationCenterProps {
  user: any;
  onClose: () => void;
}

export const NotificationCenter = ({ user, onClose }: NotificationCenterProps) => {
  const { store, update } = useStore();
  
  const notifications = store.notifications?.filter((n: Notification) => n.userId === user?.id) || [];

  const markAsRead = (id: string) => {
    const updated = store.notifications.map((n: Notification) => 
      n.id === id ? { ...n, read: true } : n
    );
    update('notifications', updated);
  };

  const markAllAsRead = () => {
    const updated = store.notifications.map((n: Notification) => 
      n.userId === user?.id ? { ...n, read: true } : n
    );
    update('notifications', updated);
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[300] overflow-hidden"
    >
      <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600" /> Notificações
        </h3>
        <button onClick={markAllAsRead} className="text-[10px] font-bold text-blue-600 hover:underline">
          Marcar todas
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-50">
        {notifications.length === 0 ? (
          <div className="p-10 text-center">
            <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Sem notificações</p>
          </div>
        ) : (
          notifications.map((n: Notification) => (
            <div 
              key={n.id} 
              onClick={() => markAsRead(n.id)}
              className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer relative ${!n.read ? 'bg-blue-50/30' : ''}`}
            >
              {!n.read && <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full" />}
              <div className="flex gap-3">
                <div className="mt-1">{getTypeIcon(n.type)}</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900 leading-tight">{n.title}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400 font-medium">
                    <Clock className="w-3 h-3" /> {new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
        <button onClick={onClose} className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-all">
          Fechar
        </button>
      </div>
    </motion.div>
  );
};
