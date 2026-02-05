import React, { useState } from "react";
import {
  ShieldCheck,
  UserPlus,
  Search,
  Mail,
  Trash2,
  Edit2,
  User as UserIcon
} from "lucide-react";
import { useStore } from "@/app/lib/store";
import { User } from "../lib/store";
import { compressImage, handleImageUpload} from "../lib/utils";
import { toast } from "sonner";

export const EmployeeManagementSection = () => {
  const { store, update } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    role: "employee" as const,
    department: null as null | 'sales' | 'stock' | 'management',
    avatar: "",
    password: Math.random().toString(36).slice(-8), // Senha temporária gerada aleatoriamente
  });

  const employees = store.users.filter(
    (u: User) => u.role === "employee" || u.role === "admin",
  );

  const handleAdd = () => {
    if (!newEmployee.name || !newEmployee.email) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newEmployee.name,
      email: newEmployee.email,
      role: newEmployee.role,
      department: newEmployee.department,
      avatar: newEmployee.avatar || `https://ui-avatars.com/api/?name=${newEmployee.name}&background=random`,
      password: Math.random().toString(36).slice(-8), // Senha temporária gerada aleatoriamente
    };

    update("users", [...store.users, newUser]);
    setShowModal(false);
    toast.success(`Funcionário ${newEmployee.name} registado com sucesso`);
  };
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Comprime para no máximo 800px (ideal para catálogo)
        const compressedBase64 = await compressImage(file, 800, 800);
        setImagePreview(compressedBase64);
        setNewEmployee({ ...newEmployee, avatar: compressedBase64 });
      } catch (error) {
        toast.error("Erro ao processar imagem.");
      }
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Gestão de Equipa
          </h1>
          <p className="text-slate-500">
            Administração de funcionários e privilégios de acesso.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
        >
          <UserPlus className="w-5 h-5" />
          Novo Funcionário
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Colaborador</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">E-mail</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {employees.map((emp: User) => (
              <tr
                key={emp.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                    <p className="text-sm font-bold text-slate-900">
                      {emp.name}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                      emp.role === "admin"
                        ? "bg-purple-50 text-purple-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {emp.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {emp.email}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-blue-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-600">
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
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Adicionar Colaborador
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  E-mail Corporativo
                </label>
                <input
                  type="email"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
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
                      onChange={handleFileChange}
                      className="text-xs text-blue-600 font-bold"
                    />
                </div>
              </div>
              <div className="text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none">
                <label className="text-sm font-bold text-slate-700 block mb-2 px-3 pt-2">
                  Departamento
                </label>
                <select
                  className="w-full p-3 bg-slate-50 rounded-xl focus:outline-none"
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      department: e.target.value as any,
                    })
                  }
                >
                  <option value="">Selecionar Departamento</option>
                  <option value="sales">Vendas</option>
                  <option value="stock">Stock</option>
                  <option value="management">Gestão</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  Nível de Acesso
                </label>
                <select
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      role: e.target.value as any,
                    })
                  }
                >
                  <option value="employee">Funcionário (Operacional)</option>
                  <option value="admin">Administrador (Total)</option>
                </select>
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
                className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
              >
                Registar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
