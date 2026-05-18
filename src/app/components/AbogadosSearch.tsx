import { motion } from 'motion/react';
import { Search, Filter } from 'lucide-react';
import { useState } from 'react';

interface AbogadosSearchProps {
  onSearch?: (searchTerm: string, practiceArea: string, industry: string, category: string) => void;
  className?: string;
}

const practiceAreas = [
  'Todas',
  'Derecho Administrativo',
  'Arbitraje',
  'Contratos',
  'Derecho Corporativo',
  'Derecho Laboral',
  'Energía',
  'Control Gubernamental',
  'Derecho Civil',
  'Derecho Penal',
];

const industries = [
  'Todas',
  'Energía',
  'Oil & Gas',
  'Minería',
  'Infraestructura',
  'Telecomunicaciones',
  'Sector Público',
  'Financiero',
  'Salud',
  'Educación',
];

const categories = [
  'Todos',
  'socio',
  'asociado',
  'asociada',
];

export function AbogadosSearch({ onSearch, className = "" }: AbogadosSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPracticeArea, setSelectedPracticeArea] = useState('Todas');
  const [selectedIndustry, setSelectedIndustry] = useState('Todas');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm, selectedPracticeArea, selectedIndustry, selectedCategory);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`bg-[#000000] p-8 lg:p-12 rounded-2xl shadow-lg border border-[#000000]/20 ${className}`}
    >
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex items-center gap-3 mb-8"
      >
        <Filter className="w-6 h-6 text-white" />
        <h2 className="font-display text-2xl font-bold text-white">
          Buscar Abogados
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Search Input */}
        <div className="lg:col-span-1">
          <label className="block font-sans text-sm font-medium text-white mb-2">
            Abogados
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Nombre o cargo..."
              className="w-full pl-10 pr-4 py-3 border border-gray-600 bg-white/10 text-white placeholder-gray-300 rounded-lg font-sans focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Practice Areas */}
        <div>
          <label className="block font-sans text-sm font-medium text-white mb-2">
            Áreas de Práctica
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-600 bg-white/10 text-white rounded-lg font-sans focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
            value={selectedPracticeArea}
            onChange={(e) => setSelectedPracticeArea(e.target.value)}
          >
            {practiceAreas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        {/* Industries */}
        <div>
          <label className="block font-sans text-sm font-medium text-white mb-2">
            Industrias
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-600 bg-white/10 text-white rounded-lg font-sans focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
          >
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>

        {/* Categories */}
        <div>
          <label className="block font-sans text-sm font-medium text-white mb-2">
            Categoría
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-600 bg-white/10 text-white rounded-lg font-sans focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="socio">Socios</option>
            <option value="asociado">Asociados</option>
            <option value="asociada">Asociadas</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-white/60 text-sm">
          {searchTerm || selectedPracticeArea !== 'Todas' || selectedIndustry !== 'Todas' || selectedCategory !== 'Todos'
            ? 'Filtros aplicados'
            : 'Mostrando todos los abogados'
          }
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-[#e65649] text-white font-sans font-semibold hover:bg-[#8B1810] transition-colors rounded-lg"
        >
          Buscar
        </button>
      </div>
    </motion.div>
  );
}
