import React from 'react';
import { BookOpen, Download, ExternalLink, Filter, Info } from 'lucide-react';
import { useStore, Product, Inquiry, SalesOrder } from '@/app/lib/store';

export const CatalogSection = () => {
  const { store } = useStore();
  const user = store.currentUser;
  const isClient = user?.role === 'client';

  // Lógica de Filtragem de Negócio
  const filteredProducts = store.products.filter((product:Product) => {
  if (!isClient) return true;

  // Só mostra se houver um ofício com este PRODUTO ID e status de catálogo enviado ou superior
  const hasInterestRecord = store.inquiries?.some((iq:Inquiry) => 
    iq.clientId === user.clientId && 
    iq.productId === product.id && 
    ['catalog_sent', 'proposal_sent', 'interested'].includes(iq.status)
  );

  // Esconde se já houver uma compra (Nota de Aquisição) para este produto
  const alreadyPurchased = store.salesOrders?.some((order:SalesOrder) => 
    order.clientId === user.clientId && 
    order.productId === product.id
  );

  return hasInterestRecord && !alreadyPurchased;
});
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isClient ? 'O Meu Catálogo Técnico' : 'Catálogo Geral de Equipamentos'}
          </h1>
          <p className="text-slate-500">
            {isClient 
              ? 'Equipamentos com propostas ativas e documentação técnica disponível.' 
              : 'Visualização técnica e comercial dos produtos MEGA-AR.'}
          </p>
        </div>
        {!isClient && (
          <button className="bg-white text-slate-600 border border-slate-200 px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        )}
      </div>

      {/* Estado Vazio para Clientes */}
      {isClient && filteredProducts.length === 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Nenhum catálogo disponível</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            Para visualizar detalhes técnicos e preços de equipamentos, deve primeiro abrir um <b>Ofício</b>. 
            Assim que um técnico validar o pedido, o catálogo aparecerá aqui.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product: Product) => (
          <div key={product.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group">
            <div className="h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
              <BookOpen className="w-16 h-16 text-slate-300 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-slate-900 uppercase">
                {product.category}
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{product.name}</h3>
              <p className="text-sm text-slate-500 mb-6 flex-1 leading-relaxed">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Preço Unidade</p>
                  <p className="text-xl font-black text-blue-600">{product.price.toLocaleString()} AO</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    title="Descarregar Ficha Técnica"
                    className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button 
                    title="Ver Detalhes Avançados"
                    className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {isClient && (
                <div className="mt-4 flex items-center gap-2 text-[10px] text-green-600 font-bold bg-green-50 p-2 rounded-lg">
                  <Info className="w-3 h-3" />
                  DISPONÍVEL PARA AQUISIÇÃO IMEDIATA
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};