import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { LandingPage } from '@/app/components/LandingPage';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import { AuthScreen } from '@/app/components/AuthScreen';
import { getStore } from '@/app/lib/store';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [view, setView] = useState('landing');

  useEffect(() => {
    const store = getStore();
    if (store.currentUser) {
      setUser(store.currentUser);
      setView('dashboard');
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setView('dashboard');
    const store = getStore();
    store.currentUser = userData;
    localStorage.setItem('mega_ar_data_v2', JSON.stringify(store));
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing');
    const store = getStore();
    store.currentUser = null;
    localStorage.setItem('mega_ar_data_v2', JSON.stringify(store));
  };

  if (view === 'landing' && !user) {
    return (
      <div className="min-h-screen bg-white">
        <LandingPage onLoginClick={() => setShowAuth(true)} />
        {showAuth && (
          <AuthScreen 
            onClose={() => setShowAuth(false)} 
            onLogin={handleLogin} 
          />
        )}
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardLayout user={user} onLogout={handleLogout} />
      <Toaster position="top-right" />
    </div>
  );
}
