import React, { useState } from "react";
import {
  Plus,
  Search,
  FileText,
  Send,
  CheckCircle,
  Clock,
  MessageSquare,
  ClipboardCheck,
  ShoppingCart
} from "lucide-react";
import { useStore, Inquiry, UserRole, saveStore } from "@/app/lib/store";
import { STORAGE_KEY } from "../lib/env";
import { toast } from "sonner";
import { Product, SalesOrder } from "../lib/store";

interface InquiriesSectionProps {
  role: UserRole;
  userId: string;
  clientId?: string;
}

export const InquiriesSection = ({
  role,
  userId,
  clientId,
}: InquiriesSectionProps) => {
  const { store, update, notify } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [newInquiry, setNewInquiry] = useState({
    clientId: clientId || "",
    productId: "", // Adicionado
    details: "",
  });
  const isClient = role === "client";

  const handleAddInquiry = () => {
    const selectedProduct = store.products.find(
      (p: Inquiry) => p.id === newInquiry.productId,
    );

    const inquiry: Inquiry = {
      id: `OF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      clientId: isClient ? clientId! : newInquiry.clientId,
      productId: newInquiry.productId, // ID vinculado
      equipmentType: selectedProduct?.name || "Equipamento Especial",
      date: new Date().toLocaleDateString(),
      details: newInquiry.details,
      status: "pending",
    };

    update("inquiries", [...store.inquiries, inquiry]);

    // Notificar admins/employees
    (store.users || [])
      .filter((u: any) => u.role !== "client")
      .forEach((u: any) => {
        notify(
          u.id,
          "Novo Ofício Recebido",
          `O cliente ${getClientName(inquiry.clientId)} enviou uma nova solicitação.`,
          "info",
        );
      });

    setShowModal(false);
    setNewInquiry({ clientId: clientId || "", productId: "", details: "" }); // Limpar form
    toast.success("Ofício registado com sucesso.");
  };

  const handleConvertToSale = (inquiry: Inquiry) => {
    const product = store.products.find((p:Product) => p.id === inquiry.productId);

    // Criar a Nota de Aquisição automaticamente com os dados do Ofício
    const newOrder: SalesOrder = {
      id: `AQ-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      clientId: inquiry.clientId,
      productId: inquiry.productId!,
      date: new Date().toLocaleDateString(),
      quantity: 1, // Default
      status: product!.stock > 0 ? "satisfied" : "backordered",
      paymentMethod: "cash", // Inicia com cash por segurança ou abre modal
      paymentStatus: "pending",
    };

    // 1. Gravar a Venda
    update("salesOrders", [newOrder, ...store.salesOrders]);

    // 2. Atualizar o Ofício para um estado final (ex: 'closed') ou manter interested
    // mas agora o CatalogSection já vai esconder o produto porque existe uma salesOrder

    toast.success(
      "Nota de Aquisição gerada com sucesso baseada no interesse do cliente!",
    );
  };

  const updateStatus = (id: string, status: Inquiry["status"]) => {
    const inquiry = store.inquiries.find((iq: Inquiry) => iq.id === id);
    const updated = store.inquiries.map((iq: Inquiry) =>
      iq.id === id ? { ...iq, status, assignedTo: userId } : iq,
    );
    update("inquiries", updated);

    // Notify client
    const clientUser = store.users.find(
      (u: any) => u.clientId === inquiry.clientId,
    );
    if (clientUser) {
      notify(
        clientUser.id,
        "Atualização de Ofício",
        `O seu ofício para ${inquiry.equipmentType} foi atualizado para: ${status}`,
        "success",
      );
    }

    toast.success(`Estado atualizado para ${status}`);
  };

  // Altera a função getClientName
  const getClientName = (id: string) => {
    return (
      (store?.clients || []).find((c: any) => c.id === id)?.name ||
      "Cliente Desconhecido"
    );
  };

  // Altera o filtro
  const filteredInquiries = isClient
    ? (store?.inquiries || []).filter((iq: Inquiry) => iq.clientId === clientId)
    : store?.inquiries || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isClient ? "Meus Ofícios" : "Gestão de Ofícios"}
          </h1>
          <p className="text-slate-500">
            {isClient
              ? "Acompanhe as suas solicitações à MEGA-AR."
              : "Monitorização e acompanhamento de solicitações de clientes."}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus className="w-5 h-5" />
          {isClient ? "Nova Solicitação" : "Registar Ofício"}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Ref.</th>
              <th className="px-6 py-4">Data</th>
              {!isClient && <th className="px-6 py-4">Cliente</th>}
              <th className="px-6 py-4">Equipamento</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredInquiries.length === 0 ? (
              <tr>
                <td
                  colSpan={isClient ? 5 : 6}
                  className="px-6 py-12 text-center text-slate-400"
                >
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  Nenhum ofício encontrado.
                </td>
              </tr>
            ) : (
              filteredInquiries.map((inq: Inquiry) => (
                <tr
                  key={inq.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-xs font-bold text-blue-600">
                    {inq.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {inq.date}
                  </td>
                  {!isClient && (
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">
                        {getClientName(inq.clientId)}
                      </p>
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {inq.equipmentType}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        inq.status === "pending"
                          ? "bg-amber-50 text-amber-600"
                          : inq.status === "catalog_sent"
                            ? "bg-blue-50 text-blue-600"
                            : inq.status === "proposal_sent"
                              ? "bg-purple-50 text-purple-600"
                              : inq.status === "interested"
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-600"
                      }`}
                    >
                      {inq.status === "pending"
                        ? "Pendente"
                        : inq.status === "catalog_sent"
                          ? "Catálogo Enviado"
                          : inq.status === "proposal_sent"
                            ? "Proposta Enviada"
                            : inq.status === "interested"
                              ? "Interessado"
                              : "Rejeitado"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {!isClient && (
                      <>
                        {inq.status === "pending" && (
                          <button
                            onClick={() => updateStatus(inq.id, "catalog_sent")}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Enviar Catálogo"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        {(inq.status === "catalog_sent" ||
                          inq.status === "pending") && (
                          <button
                            onClick={() =>
                              updateStatus(inq.id, "proposal_sent")
                            }
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                            title="Enviar Proposta Técnica"
                          >
                            <ClipboardCheck className="w-4 h-4" />
                          </button>
                        )}
                        {inq.status === "proposal_sent" && (
                          <button
                            onClick={() => updateStatus(inq.id, "interested")}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            title="Marcar como Interessado"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                    <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </td>

                  <td className="px-6 py-4 text-right space-x-2">
                    {/* BOTAÃO PARA O CLIENTE MANIFESTAR INTERESSE */}
                    {isClient && inq.status === "catalog_sent" && (
                      <button
                        onClick={() => updateStatus(inq.id, "interested")}
                        className="bg-green-600 text-white px-1 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 flex items-center gap-1 ml-auto"
                      >
                        <CheckCircle className="w-4 h-4" /> Tenho Interesse em
                        Comprar
                      </button>
                    )}

                    {/* Lógica original para funcionários (restringida) */}
                    {!isClient && inq.status === "interested" && (
                      <button
                        onClick={() => handleConvertToSale(inq)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-1"
                      >
                        <ShoppingCart className="w-4 h-4" /> Gerar Nota de
                        Aquisição
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              {isClient ? "Nova Solicitação de Equipamento" : "Novo Ofício"}
            </h2>
            <div className="space-y-4">
              {!isClient && (
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">
                    Cliente
                  </label>
                  <select
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    onChange={(e) =>
                      setNewInquiry({ ...newInquiry, clientId: e.target.value })
                    }
                  >
                    <option value="">Selecionar Cliente...</option>
                    {store.clients.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  Produto pretendido
                </label>
                <select
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  onChange={(e) =>
                    setNewInquiry({ ...newInquiry, productId: e.target.value })
                  }
                >
                  <option value="">
                    Selecione um equipamento do catálogo...
                  </option>
                  {store.products.map((p: Product) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  Detalhes e Especificações
                </label>
                <textarea
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none h-32"
                  placeholder="Descreva as necessidades técnicas..."
                  onChange={(e) =>
                    setNewInquiry({ ...newInquiry, details: e.target.value })
                  }
                ></textarea>
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
                onClick={handleAddInquiry}
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                Enviar Ofício
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
