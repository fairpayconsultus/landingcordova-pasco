import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Search, Briefcase, GraduationCap, Filter, ArrowLeft, Mail, Phone, Calendar } from 'lucide-react';
import { fetchStrapiList, getImageUrl, fetchPaginaConfig } from '../../lib/strapi';
import type { TeamMember, PaginaConfig } from '../../lib/strapi-types';


// Funciones para extraer dinámicamente los valores únicos
const extractUniquePracticeAreas = (members: TeamMember[]): string[] => {
  const areas = new Set<string>();
  members.forEach(member => {
    if (member.practiceAreas) {
      member.practiceAreas.forEach(area => areas.add(area));
    }
  });
  return ['Todas', ...Array.from(areas).sort()];
};

const extractUniqueIndustries = (members: TeamMember[]): string[] => {
  const industries = new Set<string>();
  members.forEach(member => {
    if (member.industries) {
      member.industries.forEach(industry => industries.add(industry));
    }
  });
  return ['Todas', ...Array.from(industries).sort()];
};

// Componente para vista individual de abogado
function AbogadoProfile() {
  const { slug } = useParams();
  const [lawyer, setLawyer] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetchStrapiList<TeamMember>('/team-members', `filters[slug][$eq]=${slug}&populate=*`)
      .then(results => {
        setLawyer(results[0] || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="font-sans text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-[#000000] mb-4">
            Abogado no encontrado
          </h1>
          <p className="font-sans text-gray-600 mb-8">
            El abogado que buscas no existe o ha sido removido.
          </p>
          <Link
            to="/abogados"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#e65649] text-white font-sans font-semibold hover:bg-[#8B1810] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a Abogados
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-20 bg-[#000000]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/abogados"
              className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver a Abogados
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Imagen */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <ImageWithFallback
                src={getImageUrl(lawyer.photo) || '/Omar.png'}
                alt={lawyer.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Info Principal */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-[#e65649] text-white font-sans text-sm font-semibold rounded-full mb-4">
                  {lawyer.role}
                </span>
                <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
                  {lawyer.name}
                </h1>
                <p className="font-sans text-xl text-gray-300 font-light">
                  {lawyer.experience}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-5 h-5" />
                  <span>{lawyer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone className="w-5 h-5" />
                  <span>{lawyer.phone}</span>
                </div>
              </div>

              <p className="font-sans text-lg text-gray-300 leading-relaxed mb-8 text-justify">
                {lawyer.bio}
              </p>

              {lawyer.languages && lawyer.languages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(lawyer.languages || []).map((lang, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white/10 text-white font-sans text-sm rounded-full"
                  >
                    {lang}
                  </span>
                ))}
              </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Detalles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Educación */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="w-6 h-6 text-[#e65649]" />
                <h3 className="font-display text-2xl font-bold text-[#000000]">
                  Educación
                </h3>
              </div>
              <ul className="space-y-3">
                {(lawyer.education || []).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 font-sans text-[#2D2D3D]">
                    <span className="inline-block w-1.5 h-1.5 bg-[#e65649] mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Áreas de Práctica */}
            <motion.div
              initial={{ opacity: 0, x: 0 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="w-6 h-6 text-[#e65649]" />
                <h3 className="font-display text-2xl font-bold text-[#000000]">
                  Áreas de Práctica
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(lawyer.practiceAreas || []).map((area, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-2 bg-[#e65649]/10 text-[#e65649] font-sans text-sm rounded-lg"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Industrias */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-[#e65649]" />
                <h3 className="font-display text-2xl font-bold text-[#000000]">
                  Industrias
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(lawyer.industries || []).map((industry, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-2 bg-gray-100 text-gray-700 font-sans text-sm rounded-lg"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Logros */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16"
          >
            <h3 className="font-display text-3xl font-bold text-[#000000] mb-8">
              Logros Destacados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(lawyer.achievements || []).map((achievement, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 bg-[#e65649] mt-2 flex-shrink-0 rounded-full" />
                  <p className="font-sans text-[#2D2D3D]">{achievement}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="bg-[#F8F9FA] p-8 rounded-2xl border border-gray-200">
              <h3 className="font-display text-2xl font-bold text-[#000000] mb-4">
                ¿Necesita asesoría legal?
              </h3>
              <p className="font-sans text-[#2D2D3D] mb-6">
                Contacte a {lawyer.name.split(' ')[0]} para una consulta inicial y evalúe cómo podemos ayudarle con sus necesidades legales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`mailto:${lawyer.email}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#e65649] text-white font-sans font-semibold hover:bg-[#8B1810] transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Enviar Email
                </a>
                <a
                  href={`tel:${lawyer.phone}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#000000] text-white font-sans font-semibold hover:bg-[#e65649] transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Llamar
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default function Abogados() {
  const { slug } = useParams();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [practiceAreasList, setPracticeAreasList] = useState<string[]>(['Todas']);
  const [industriesList, setIndustriesList] = useState<string[]>(['Todas']);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPracticeArea, setSelectedPracticeArea] = useState('Todas');
  const [selectedIndustry, setSelectedIndustry] = useState('Todas');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [paginaConfig, setPaginaConfig] = useState<PaginaConfig | null>(null);

  useEffect(() => {
    Promise.all([
      fetchStrapiList<TeamMember>('/team-members', 'sort=order:asc'),
      fetchPaginaConfig(),
    ])
      .then(([members, config]) => {
        setTeamMembers(members);
        setPracticeAreasList(extractUniquePracticeAreas(members));
        setIndustriesList(extractUniqueIndustries(members));
        setPaginaConfig(config);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Si hay un slug, mostrar vista individual
  if (slug) {
    return <AbogadoProfile />;
  }

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (member.role && member.role.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPracticeArea = selectedPracticeArea === 'Todas' ||
                              (member.practiceAreas && member.practiceAreas.some(area => area.toLowerCase().includes(selectedPracticeArea.toLowerCase())));
    const matchesIndustry = selectedIndustry === 'Todas' ||
                          (member.industries && member.industries.some(industry => industry.toLowerCase().includes(selectedIndustry.toLowerCase())));
    const matchesCategory = selectedCategory === 'Todos' || member.category === selectedCategory;

    return matchesSearch && matchesPracticeArea && matchesIndustry && matchesCategory;
  });

  const stats = {
    socios: teamMembers.filter(m => m.category === 'socio').length,
    consultores: teamMembers.filter(m => m.category === 'consultor').length,
    asociados: teamMembers.filter(m => m.category === 'asociado').length,
  };

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center bg-[#000000]">
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {paginaConfig?.bannerAbogados && (
              <ImageWithFallback
                src={getImageUrl(paginaConfig.bannerAbogados)}
                alt="Equipo Legal"
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 70%' }}
              />
            )}
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" 
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <motion.h1
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Nuestro Equipo Legal
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-sans text-xl text-gray-300 max-w-3xl mx-auto font-normal"
          >
            Profesionales altamente especializados con experiencia comprobada en las industrias
            más complejas y reguladas del mercado.
          </motion.p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[#000000] p-8 lg:p-12 rounded-2xl shadow-lg border border-[#000000]/20"
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-600 bg-gray-900 text-white placeholder-gray-400 rounded-lg font-sans focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                  />
                </div>
              </div>

              {/* Practice Areas */}
              <div>
                <label className="block font-sans text-sm font-medium text-white mb-2">
                  Áreas de Práctica
                </label>
                <select
                  value={selectedPracticeArea}
                  onChange={(e) => setSelectedPracticeArea(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-lg font-sans focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                >
                  {practiceAreasList.map(area => (
                    <option key={area} value={area} className="bg-gray-900 text-white">{area}</option>
                  ))}
                </select>
              </div>

              {/* Industries */}
              <div>
                <label className="block font-sans text-sm font-medium text-white mb-2">
                  Industrias
                </label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-lg font-sans focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                >
                  {industriesList.map(industry => (
                    <option key={industry} value={industry} className="bg-gray-900 text-white">{industry}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block font-sans text-sm font-medium text-white mb-2">
                  Categoría
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-lg font-sans focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                >
                  <option value="Todos" className="bg-gray-900 text-white">Todos</option>
                  <option value="socio" className="bg-gray-900 text-white">Socios</option>
                  <option value="asociado" className="bg-gray-900 text-white">Asociados</option>
                  <option value="consultor" className="bg-gray-900 text-white">Consultores</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <p className="font-sans text-sm text-gray-600">
                {filteredMembers.length} {filteredMembers.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedPracticeArea('Todas');
                  setSelectedIndustry('Todas');
                  setSelectedCategory('Todos');
                }}
                className="font-sans text-sm text-[#e65649] hover:text-[#8B1810] transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center items-center gap-8 lg:gap-16"
          >
            {[
              { number: stats.socios, label: 'Socios' },
              { number: stats.consultores, label: 'Consultores' },
              { number: stats.asociados, label: 'Asociados' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-[#e65649] rounded-full flex items-center justify-center">
                  <span className="font-display text-lg font-bold text-white">
                    {stat.number}
                  </span>
                </div>
                <span className="font-sans text-sm text-gray-600 uppercase tracking-wider font-medium">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {filteredMembers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#000000] mb-2">
                No se encontraron resultados
              </h3>
              <p className="font-sans text-gray-600">
                Intente ajustar los filtros de búsqueda para encontrar al profesional que necesita.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMembers.map((member, index) => (
                <Link
                  key={member.slug}
                  to={`/abogados/${member.slug}`}
                  className="block"
                >
                  <motion.div
                    initial={{ opacity: 0, x: index % 3 === 0 ? -100 : index % 3 === 1 ? 0 : 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15, duration: 0.8 }}
                    className="bg-[#000000]/95 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden hover:shadow-xl hover:bg-[#000000] transition-all cursor-pointer flex flex-col h-full"
                  >
                    {/* Image */}
                    <div className="aspect-[4/5] overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={getImageUrl(member.photo) || '/Omar.png'}
                        alt={member.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Role Badge */}
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-[#e65649] text-white font-sans text-xs font-semibold rounded-full">
                          {member.role}
                        </span>
                      </div>

                      {/* Name */}
                      <h3 className="font-display text-xl font-bold text-white mb-2">
                        {member.name}
                      </h3>

                      {/* Experience */}
                      <p className="font-sans text-sm text-gray-300 mb-4">
                        {member.experience}
                      </p>

                      {/* Practice Areas */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="w-4 h-4 text-[#e65649]" />
                          <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider">
                            Áreas de Práctica
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {(member.practiceAreas || []).slice(0, 2).map((area, idx) => (
                            <span key={idx} className="px-2 py-1 bg-[#e65649]/20 text-white font-sans text-xs rounded">
                              {area}
                            </span>
                          ))}
                          {(member.practiceAreas || []).length > 2 && (
                            <span className="px-2 py-1 bg-white/20 text-white font-sans text-xs rounded">
                              +{(member.practiceAreas || []).length - 2}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Industries */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <GraduationCap className="w-4 h-4 text-[#e65649]" />
                          <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider">
                            Industrias
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {(member.industries || []).slice(0, 2).map((industry, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white/20 text-white font-sans text-xs rounded">
                              {industry}
                            </span>
                          ))}
                          {(member.industries || []).length > 2 && (
                            <span className="px-2 py-1 bg-white/20 text-white font-sans text-xs rounded">
                              +{(member.industries || []).length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
