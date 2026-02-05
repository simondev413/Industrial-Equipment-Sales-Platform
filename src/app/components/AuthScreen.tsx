import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Lock,
  Wind,
  Loader2,
  UserPlus,
  ShieldCheck,
  User as UserIcom,
  Package,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { getStore, saveStore, useStore,User } from "@/app/lib/store";
import { compressImage } from "../lib/utils";
import { Client } from "../lib/store";

interface AuthScreenProps {
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthScreen = ({ onClose, onLogin }: AuthScreenProps) => {
  const { store, update } = useStore();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");

  // Login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register form (Client only)
  const [regData, setRegData] = useState({
    name: "",
    email: "",
    nif: "",
    address: "",
    avatar: "",
    password: "",
    confirmPassword: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Comprime para no máximo 800px (ideal para perfil)
        const compressedBase64 = await compressImage(file, 800, 800);
        setRegData({ ...regData, avatar: compressedBase64 });
      } catch (error) {
        toast.error("Erro ao processar imagem.");
      }
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Adicionamos o optional chaining ?. e um fallback para array vazio []
      const users = store?.users || [];
      const user = users.find(
        (u: User) => u.email === email && u.password === password,
      );
      console.log(user,password,email) 

      if (user) {
        onLogin(user);
        toast.success(`Bem-vindo, ${user.name}!`);
      } else {
        toast.error("Utilizador não encontrado. Tente admin@mega-ar.pt");
      }
      setLoading(false);
    }, 1200);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // 1. Create Client record
      const clientId = Math.random().toString(36).substr(2, 9);
      const newClient: Client = {
        id: clientId,
        name: regData.name,
        nif: regData.nif,
        address: regData.address,
        email: regData.email,
        hasSpecialCredit: false,
      };

      // 2. Create User record
      const newUser : User = {
        id: Math.random().toString(36).substr(2, 9),
        name: regData.name,
        email: regData.email,
        role: "client" as const,
        avatar: regData.avatar,
        clientId: clientId,
        password: regData.password,
        confirmPassword: regData.confirmPassword,
      };

      const updatedUsers = [...store.users, newUser];
      const updatedClients = [...store.clients, newClient];

      const newStore = {
        ...store,
        users: updatedUsers,
        clients: updatedClients,
      };
      saveStore(newStore);

      toast.success("Registo concluído! Já pode entrar.");
      setMode("login");
      setEmail(regData.email);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-10">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200">
              <Wind className="text-white w-10 h-10" />
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {mode === "login" ? "Portal MEGA-AR" : "Registo de Cliente"}
            </h2>
            <p className="text-slate-500">
              {mode === "login"
                ? "Aceda à sua área reservada"
                : "Crie a sua conta para solicitar ofícios e propostas"}
            </p>
          </div>

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="utilizador@email.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  Palavra-passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Entrar"
                )}
              </button>

              <div className="pt-4 text-center">
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-sm font-bold text-blue-600 hover:underline"
                >
                  Novo cliente? Registe a sua empresa
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">
                    Nome da Empresa
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    value={regData.name}
                    onChange={(e) =>
                      setRegData({ ...regData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    value={regData.email}
                    onChange={(e) =>
                      setRegData({ ...regData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">
                    NIF
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    value={regData.nif}
                    onChange={(e) =>
                      setRegData({ ...regData, nif: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">
                    Morada
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    value={regData.address}
                    onChange={(e) =>
                      setRegData({ ...regData, address: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">
                    Foto de Perfil
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-full h-full p-3 text-slate-300" />
                      )}
                    </div>
                     <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="text-xs text-blue-600 font-bold"
                      />
                  </div>
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  Palavra-passe
                </label>
                <input
                  type="password"
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  onChange={(e) =>
                    setRegData({ ...regData, password: e.target.value })
                  }
                />
               </div>

              <div className="col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  Confirmar Palavra-passe
                </label>
                <input
                  type="password"
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  onChange={(e) =>
                    setRegData({ ...regData, confirmPassword: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Criar Conta"
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-sm font-bold text-slate-500 hover:underline"
                >
                  Já tenho conta. Voltar ao Login
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
