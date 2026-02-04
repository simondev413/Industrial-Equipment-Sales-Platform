import React, { useState } from "react";
import {
  Plus,
  Search,
  ShoppingCart,
  CreditCard,
  Printer,
  Info,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import {
  useStore,
  SalesOrder,
  Product,
  Client,
  UserRole,
} from "@/app/lib/store";
import { toast } from "sonner";

interface SalesOrdersSectionProps {
  role: UserRole;
  clientId?: string;
}

export const SalesOrdersSection = ({
  role,
  clientId,
}: SalesOrdersSectionProps) => {
  const { store, update, notify } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    productId: "",
    quantity: 1,
    paymentMethod: "full",
  });

  const isClient = role === "client";

  const handleCreateOrder = () => {
    const hasInterest = store.inquiries.some(
      (iq: any) =>
        iq.clientId === formData.clientId &&
        iq.productId === formData.productId &&
        iq.status === "interested",
    );

    if (!hasInterest) {
      toast.error(
        "Não é possível gerar venda. O cliente ainda não manifestou interesse formal neste produto via ofício.",
      );
      return;
    }
    if (!formData.clientId || !formData.productId) {
      toast.error("Preencha os dados do cliente e produto");
      return;
    }

    const product = store.products.find(
      (p: Product) => p.id === formData.productId,
    );
    const client = store.clients.find(
      (c: Client) => c.id === formData.clientId,
    );

    if (!product) return;

    const isInStock = product.stock >= formData.quantity;

    const newOrder: SalesOrder = {
      id: `AQ-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      clientId: formData.clientId,
      productId: formData.productId,
      date: new Date().toLocaleDateString(),
      quantity: formData.quantity,
      status: isInStock ? "satisfied" : "backordered",
      paymentMethod: formData.paymentMethod as any,
      paymentStatus: "pending", 
    };

    update("salesOrders", [newOrder, ...store.salesOrders]);

    if (isInStock) {
      const updatedProducts = store.products.map((p: Product) =>
        p.id === product.id ? { ...p, stock: p.stock - formData.quantity } : p,
      );
      update("products", updatedProducts);
      toast.success("Pedido satisfeito de imediato.");

      // Notify client user if exists
      const clientUser = store.users.find(
        (u: any) => u.clientId === formData.clientId,
      );
      if (clientUser) {
        notify(
          clientUser.id,
          "Novo Pedido Satisfeito",
          `O seu pedido ${newOrder.id} foi processado e está pronto para entrega.`,
          "success",
        );
      }
    } else {
      toast.warning(
        "Sem stock imediato. Gerada nota de encomenda a fornecedor.",
      );

      // Auto-create purchase order as per business rule
      const po: any = {
        id: `PO-AUTO-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        supplierId: "s1",
        productId: product.id,
        quantity: formData.quantity + 5,
        date: new Date().toLocaleDateString(),
        status: "ordered",
      };
      update("purchaseOrders", [po, ...store.purchaseOrders]);

      // Notify technical team
      store.users
        .filter((u: any) => u.role !== "client")
        .forEach((u: any) => {
          notify(
            u.id,
            "Ruptura de Stock",
            `Pedido ${newOrder.id} gerou encomenda automática ao fornecedor.`,
            "warning",
          );
        });
    }

    setShowModal(false);
  };

  // Função dentro de SalesOrdersSection.tsx
  const confirmPayment = (orderId: string) => {
    const order = store.salesOrders.find((o: SalesOrder) => o.id === orderId);

    if (order.status !== "satisfied") {
      toast.error(
        "Pagamento bloqueado: O equipamento ainda não foi entregue/satisfeito.",
      );
      return;
    }

    const updated = store.salesOrders.map((o: SalesOrder) =>
      o.id === orderId ? { ...o, paymentStatus: "paid" } : o,
    );

    update("salesOrders", updated);
    toast.success("Pagamento de " + order.paymentMethod + " confirmado!");
  };
  // Função para o CLIENTE confirmar que recebeu o produto
  const handleConfirmReceipt = (orderId: string) => {
    const updatedOrders = store.salesOrders.map((order: SalesOrder) =>
      order.id === orderId ? { ...order, status: "satisfied" as const } : order,
    );

    update("salesOrders", updatedOrders);

    // Notificar funcionários que o produto foi entregue e pode ser cobrado
    store.users
      .filter((u: any) => u.role !== "client")
      .forEach((u: any) => {
        notify(
          u.id,
          "Produto Entregue",
          `O cliente confirmou a receção da encomenda ${orderId}. Pode processar o pagamento.`,
          "info",
        );
      });

    toast.success(
      "Receção confirmada! O processo de pagamento será agora finalizado pelo nosso técnico.",
    );
  };

  // Função para o FUNCIONÁRIO confirmar o pagamento (Cash/Transfer)
  const handleConfirmPayment = (orderId: string) => {
    const updatedOrders = store.salesOrders.map((order: SalesOrder) =>
      order.id === orderId
        ? { ...order, paymentStatus: "paid" as const }
        : order,
    );

    update("salesOrders", updatedOrders);
    toast.success("Pagamento registado no sistema.");
  };
  const getClient = (id: string) => store.clients.find((c: any) => c.id === id);
  const getProduct = (id: string) =>
    store.products.find((p: any) => p.id === id);

  const filteredOrders = isClient
    ? store.salesOrders.filter((o: SalesOrder) => o.clientId === clientId)
    : store.salesOrders;

  // Função para processar o pagamento
  const handleProcessPayment = (orderId: string) => {
    const order = store.salesOrders.find((o: SalesOrder) => o.id === orderId);

    if (order.status !== "satisfied") {
      toast.error(
        "Não é possível processar o pagamento: o produto ainda não foi entregue/satisfeito.",
      );
      return;
    }

    const updatedOrders = store.salesOrders.map((o: SalesOrder) =>
      o.id === orderId ? { ...o, paymentStatus: "paid" as const } : o,
    );

    update("salesOrders", updatedOrders);
    toast.success("Pagamento confirmado com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isClient ? "Minhas Compras" : "Notas de Aquisição"}
          </h1>
          <p className="text-slate-500">
            {isClient
              ? "Histórico de aquisições e estado das entregas."
              : "Gestão de vendas e processamento de pedidos."}
          </p>
        </div>
        {!isClient && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <Plus className="w-5 h-5" />
            Nova Nota de Aquisição
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Ref.</th>
              {!isClient && <th className="px-6 py-4">Cliente</th>}
              <th className="px-6 py-4">Produto</th>
              <th className="px-6 py-4">Qtd</th>
              <th className="px-6 py-4">Pagamento</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={isClient ? 6 : 7}
                  className="px-6 py-12 text-center text-slate-400"
                >
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  Nenhuma aquisição registada.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order: SalesOrder) => (
  <tr
    key={order.id}
    className="hover:bg-slate-50/50 transition-colors"
  >
    <td className="px-6 py-4 text-xs font-bold text-blue-600">
      {order.id}
    </td>
    {!isClient && (
      <td className="px-6 py-4">
        <p className="text-sm font-bold text-slate-900">
          {getClient(order.clientId)?.name}
        </p>
      </td>
    )}
    <td className="px-6 py-4 text-sm text-slate-600">
      {getProduct(order.productId)?.name}
    </td>
    <td className="px-6 py-4 text-sm text-slate-900 font-bold">
      {order.quantity}
    </td>
    <td className="px-6 py-4 text-sm text-slate-600 capitalize">
      {order.paymentMethod === "full"
        ? "Pronto Pagamento"
        : order.paymentMethod === "cash" 
        ? "Dinheiro" 
        : order.paymentMethod === "transfer" 
        ? "Transferência" 
        : "Prestações"}
    </td>
    <td className="px-6 py-4">
      <div className="flex flex-col gap-1">
        {/* Status de Entrega */}
        <span
          className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter w-fit ${
            order.status === "satisfied"
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {order.status === "satisfied" ? "Entregue" : "Em Trânsito"}
        </span>
        {/* Status de Pagamento */}
        <span className={`text-[10px] font-bold ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-slate-400'}`}>
          {order.paymentStatus === "paid" ? "● PAGO" : "○ PENDENTE"}
        </span>
      </div>
    </td>
    
    {/* COLUNA DE AÇÕES UNIFICADA (O PONTO 2) */}
    <td className="px-6 py-4 text-right">
      <div className="flex justify-end gap-2">
        
        {/* 1. AÇÃO DO CLIENTE: Confirmar que recebeu o produto */}
        {isClient && order.status !== "satisfied" && (
          <button
            onClick={() => handleConfirmReceipt(order.id)}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-sm"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Confirmar Receção
          </button>
        )}

        {/* 2. AÇÃO DO FUNCIONÁRIO: Validar pagamento (Só aparece se o cliente já recebeu) */}
        {!isClient && order.status === "satisfied" && order.paymentStatus !== "paid" && (
          <button
            onClick={() => handleConfirmPayment(order.id)}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-all shadow-sm"
          >
            <DollarSign className="w-3.5 h-3.5" /> Validar Pagamento
          </button>
        )}

        {/* 3. MENSAGEM DE ESPERA PARA O CLIENTE */}
        {isClient && order.status === "satisfied" && order.paymentStatus !== "paid" && (
          <span className="text-[10px] text-slate-400 italic self-center">
            A aguardar validação financeira...
          </span>
        )}

        {/* Botão de Imprimir (Disponível para todos) */}
        <button className="p-2 text-slate-400 hover:text-blue-600 transition-all">
          <Printer className="w-4 h-4" />
        </button>
      </div>
    </td>
  </tr>
))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Processar Nota de Aquisição
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-bold text-slate-700 block mb-2">
                    Cliente
                  </label>
                  <select
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    onChange={(e) =>
                      setFormData({ ...formData, clientId: e.target.value })
                    }
                  >
                    <option value="">Selecionar Cliente...</option>
                    {store.clients.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.name}{" "}
                        {c.hasSpecialCredit ? "(Crédito Especial)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-bold text-slate-700 block mb-2">
                    Equipamento
                  </label>
                  <select
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    onChange={(e) =>
                      setFormData({ ...formData, productId: e.target.value })
                    }
                  >
                    <option value="">Selecionar Produto...</option>
                    {store.products.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Stock: {p.stock}) - {p.price} AO
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">
                    Método de Pagamento
                  </label>
                  <select
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value,
                      })
                    }
                  >
                    <option value="full">Pronto Pagamento (Cartão)</option>
                    <option value="cash">Dinheiro (Cash)</option>
                    <option value="transfer">Transferência Bancária</option>
                    {getClient(formData.clientId)?.hasSpecialCredit && (
                      <option value="installments">
                        Pagamento em Prestações
                      </option>
                    )}
                  </select>
                  {(formData.paymentMethod === "cash" ||
                    formData.paymentMethod === "transfer") && (
                    <p className="text-[10px] text-amber-600 font-bold mt-2 flex items-center gap-1">
                      <Info className="w-3 h-3" /> O pagamento só será
                      processado após a entrega do equipamento.
                    </p>
                  )}
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
                onClick={handleCreateOrder}
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg"
              >
                Finalizar Nota
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
