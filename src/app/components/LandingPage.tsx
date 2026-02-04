import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Shield, BarChart3, ArrowRight, Menu } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface LandingPageProps {
  onLoginClick: () => void;
}

export const LandingPage = ({ onLoginClick }: LandingPageProps) => {
  return (
    <div className="relative overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Wind className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">MEGA-AR</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#solucoes" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Soluções</a>
            <a href="#processo" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Processo</a>
            <a href="#sobre" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Sobre</a>
            <button 
              onClick={onLoginClick}
              className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-all active:scale-95"
            >
              Portal Interno
            </button>
          </div>
          <button className="md:hidden">
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
                Climatização Industrial de Elite
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-8">
                Poder Térmico para a sua <span className="text-blue-600">Indústria</span>.
              </h1>
              <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
                Especialistas em sistemas de ar condicionado de alta performance para complexos industriais, armazéns e escritórios de grande escala.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                  Solicitar Ofício <ArrowRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 bg-white text-slate-900 font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  Ver Catálogo
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1769531682600-205cb9eb391e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwYWlyJTIwY29uZGl0aW9uZXIlMjBIVkFDfGVufDF8fHx8MTc2OTk5MzI3MXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Industrial AC"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl hidden sm:block border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Certificação ISO 9001</p>
                    <p className="text-xs text-slate-500">Qualidade Garantida</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-100 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: 'Projetos Concluídos', value: '500+' },
              { label: 'Anos de Experiência', value: '25' },
              { label: 'Clientes Ativos', value: '120' },
              { label: 'Equipa Técnica', value: '45' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</p>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section id="solucoes" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Soluções Adaptadas</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Fornecemos tecnologia de ponta para manter a sua operação em movimento, independentemente das condições externas.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Chillers de Grande Porte', desc: 'Sistemas de refrigeração centralizada para edifícios de alta densidade.', icon: Wind },
              { title: 'Sistemas VRF', desc: 'Eficiência energética extrema com controlo individualizado por zonas.', icon: BarChart3 },
              { title: 'Manutenção Preventiva', desc: 'Monitorização 24/7 e planos de intervenção rápida para zero downtime.', icon: Shield },
            ].map((item, i) => (
              <div key={i} className="p-8 bg-white border border-slate-100 rounded-3xl hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50 transition-all">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Wind className="text-blue-400 w-6 h-6" />
            <span className="text-xl font-bold tracking-tight">MEGA-AR</span>
          </div>
          <p className="text-slate-400 text-sm">© 2026 MEGA-AR Equipamentos Industriais. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Termos</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
