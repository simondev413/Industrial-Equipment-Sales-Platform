import React, { useState } from "react";
import {
  Truck,
  Search,
  Calendar,
  Package,
  ArrowRight,
  CheckCircle2,
  Plus,
  PackageCheck
} from "lucide-react";
import { useStore, PurchaseOrder, Product, Supplier } from "@/app/lib/store";
import { toast } from "sonner";

export const PurchaseOrdersSection = () => {
  const { store, update, notify } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    supplierId: "",
    productId: "",
    quantity: 1,
  });

  const handleCreateOrder = () => {
    if (!formData.supplierId || !formData.productId) {
      toast.error("Preencha os dados da encomenda");
      return;
    }

    const newPO: PurchaseOrder = {
      id: `PO-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      supplierId: formData.supplierId,
      productId: formData.productId,
      quantity: formData.quantity,
      date: new Date().toLocaleDateString(),
      status: "ordered",
    };

    update("purchaseOrders", [newPO, ...store.purchaseOrders]);
    setShowModal(false);
    toast.success("Encomenda enviada ao fornecedor");
  };


const handleReceiveStock = (orderId: string) => {
  const order = store.purchaseOrders.find((po: any) => po.id === orderId);
  if (!order) return;

  // 1. Atualizar Status da Encomenda
  const updatedOrders = store.purchaseOrders.map((po: any) => 
    po.id === orderId ? { ...po, status: 'received' } : po
  );

  // 2. Aumentar Stock do Produto
  const updatedProducts = store.products.map((p: any) => 
    p.id === order.productId ? { ...p, stock: p.stock + order.quantity } : p
  );

  update('purchaseOrders', updatedOrders);
  update('products', updatedProducts);

  // 3. Notificação de Sucesso
  notify('all', 'Stock Atualizado', `Recebemos ${order.quantity} unidades do produto ID: ${order.productId}`, 'success');
  
  toast.success("Mercadoria integrada no armazém!");
};

  const getProduct = (id: string) =>
    store.products.find((p: any) => p.id === id);
  const getSupplier = (id: string) =>
    store.suppliers.find((s: any) => s.id === id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Encomendas a Fornecedores
          </h1>
          <p className="text-slate-500">
            Reposição de stock e gestão de compras aos parceiros industriais.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nova Encomenda
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Ref. Encomenda</th>
              <th className="px-6 py-4">Fornecedor</th>
              <th className="px-6 py-4">Equipamento</th>
              <th className="px-6 py-4">Qtd.</th>
              <th className="px-6 py-4">Data Pedido</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {store.purchaseOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-slate-400"
                >
                  <Truck className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  Nenhuma encomenda ativa aos fornecedores.
                </td>
              </tr>
            ) : (
              store.purchaseOrders.map((po: PurchaseOrder) => (
                <tr
                  key={po.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-xs font-bold text-blue-600">
                    {po.id}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">
                      {getSupplier(po.supplierId)?.name}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {getProduct(po.productId)?.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-bold">
                    {po.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {po.date}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        po.status === "ordered"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {po.status === "ordered" ? "Em Trânsito" : "Recebido"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {po.status === "ordered" ? (
                      <button
                        onClick={() => handleReceiveStock(po.id)}
                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-all shadow-sm"
                        title="Simular entrega do fornecedor"
                      >
                        <PackageCheck className="w-4 h-4" /> Confirmar Entrega
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 text-slate-400 text-xs font-medium justify-end">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />{" "}
                        Stock Integrado
                      </div>
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
              Encomendar a Fornecedor
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  Fornecedor Selecionado
                </label>
                <select
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  onChange={(e) =>
                    setFormData({ ...formData, supplierId: e.target.value })
                  }
                >
                  <option value="">Escolher Fornecedor...</option>
                  {store.suppliers?.map((s: Supplier) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>
              <div>
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
                  {store.products.map((p: Product) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock: {p.stock})
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
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: parseInt(e.target.value),
                    })
                  }
                />
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
                className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg"
              >
                Enviar Encomenda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
