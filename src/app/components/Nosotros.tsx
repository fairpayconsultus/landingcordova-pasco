import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Award, Building2, Users, Target, GraduationCap, Briefcase, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { fetchStrapiList, getImageUrl, fetchPaginaConfig } from '../../lib/strapi';
import type { TeamMember, PaginaConfig } from '../../lib/strapi-types';

const AnimatedCounter = ({ value, duration = 2000 }: { value: string; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = parseInt(value.replace(/\D/g, '')) || 0;

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCounter = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      const currentValue = Math.floor(progress * numericValue);
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [numericValue, duration]);

  return (
    <span className="text-4xl font-bold text-[#e65649]">
      {displayValue}+
    </span>
  );
};

const values = [
  {
    icon: Award,
    title: 'Excelencia Técnica',
    description: 'Compromiso inquebrantable con el rigor académico y la actualización permanente en tendencias jurídicas y normativas.',
  },
  {
    icon: Target,
    title: 'Enfoque Estratégico',
    description: 'Cada caso es abordado con visión de negocio, analizando aspectos legales, organizacionales y financieros.',
  },
  {
    icon: Users,
    title: 'Atención Personalizada',
    description: 'Nuestros socios participan directamente en cada asunto, asegurando un servicio boutique de primer nivel.',
  },
  {
    icon: Building2,
    title: 'Integridad Institucional',
    description: 'Ética profesional y transparencia como pilares fundamentales de nuestra relación con clientes.',
  },
];

export function Nosotros() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPartner, setCurrentPartner] = useState(0);
  const [paginaConfig, setPaginaConfig] = useState<PaginaConfig | null>(null);

  useEffect(() => {
    Promise.all([
      fetchStrapiList<TeamMember>('/team-members', 'sort=order:asc'),
      fetchPaginaConfig(),
    ])
      .then(([members, config]) => {
        setTeamMembers(members);
        setPaginaConfig(config);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const nextPartner = () => {
    setCurrentPartner((prev) => (prev + 1) % teamMembers.length);
  };

  const prevPartner = () => {
    setCurrentPartner((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  // Auto-play del carrusel
  useEffect(() => {
    if (teamMembers.length === 0) return;
    const interval = setInterval(() => {
      nextPartner();
    }, 4000); // Cambiar cada 4 segundos

    return () => clearInterval(interval);
  }, [teamMembers]);

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {paginaConfig?.bannerNosotros && (
              <ImageWithFallback
                src={getImageUrl(paginaConfig.bannerNosotros)}
                alt="Modern Office"
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
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              Nuestro Equipo
            </h1>
            <p className="font-sans text-lg text-gray-300 max-w-3xl mx-auto font-normal">
              Liderazgo con trayectoria comprobada en instituciones públicas y privadas de primer nivel.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Carousel */}
      {teamMembers.length > 0 && (
      <section className="py-20 lg:py-24 bg-[#F8F9FA] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          {/* Carrusel del Equipo */}
          <div className="relative max-w-5xl mx-auto">
            {/* Contenedor del carrusel */}
            <div className="overflow-hidden rounded-2xl">
              <div className="flex transition-transform duration-500 ease-in-out" 
                   style={{ transform: `translateX(-${currentPartner * 100}%)` }}>
                {teamMembers.map((member, index) => (
                  <div key={member.name} className="w-full flex-shrink-0 px-4">
                    <motion.div
                      initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Imagen */}
                        <div className="relative">
                          <div className="aspect-[4/5] overflow-hidden">
                            <ImageWithFallback
                              src={getImageUrl(member.photo) || '/Omar.png'}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {/* Badge de rol */}
                          <div className="absolute top-4 left-4">
                            <span className="bg-[#e65649] text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
                              {member.role}
                            </span>
                          </div>
                        </div>

                        {/* Contenido */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                          <h3 className="font-display text-3xl lg:text-4xl font-bold text-[#000000] mb-3">
                            {member.name}
                          </h3>
                          
                          <p className="font-sans text-lg text-[#2D2D3D] font-medium mb-8">
                            {member.experience || member.role}
                          </p>

                          <div className="space-y-6">
                            {member.education && member.education.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <GraduationCap className="w-5 h-5 text-[#e65649]" />
                                <h4 className="font-sans text-sm font-bold text-[#000000] uppercase tracking-wide">
                                  Formación Académica
                                </h4>
                              </div>
                              <ul className="space-y-2">
                                {(member.education || []).map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-3 font-sans text-[#2D2D3D] font-normal">
                                    <span className="inline-block w-1.5 h-1.5 bg-[#e65649] mt-2 flex-shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            )}

                            {member.highlights && member.highlights.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Briefcase className="w-5 h-5 text-[#e65649]" />
                                <h4 className="font-sans text-sm font-bold text-[#000000] uppercase tracking-wide">
                                  Experiencia Destacada
                                </h4>
                              </div>
                              <ul className="space-y-2">
                                {(member.highlights || []).map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-3 font-sans text-[#2D2D3D] font-normal">
                                    <span className="inline-block w-1.5 h-1.5 bg-[#e65649] mt-2 flex-shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controles del carrusel */}
            <button
              onClick={prevPartner}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl hover:border-[#e65649]/20 transition-all duration-300 z-10"
              aria-label="Anterior miembro"
            >
              <ChevronLeft className="w-6 h-6 text-[#000000]" />
            </button>

            <button
              onClick={nextPartner}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl hover:border-[#e65649]/20 transition-all duration-300 z-10"
              aria-label="Siguiente miembro"
            >
              <ChevronRight className="w-6 h-6 text-[#000000]" />
            </button>

            {/* Indicadores */}
            <div className="flex justify-center items-center gap-3 mt-8 hidden">
              {teamMembers.map((member, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPartner(index)}
                  className={`group relative transition-all duration-500 ${
                    currentPartner === index 
                      ? 'scale-125' 
                      : 'hover:scale-110'
                  }`}
                  aria-label={`Ir al ${member.name}`}
                >
                  <div className={`relative transition-all duration-500 ${
                    currentPartner === index 
                      ? 'w-4 h-4 bg-[#e65649] rounded-full shadow-lg shadow-[#e65649]/30 scale-125' 
                      : 'w-3 h-3 bg-gray-300 hover:bg-gray-400 rounded-full'
                  }`}>
                    {currentPartner === index && (
                      <>
                        <div className="absolute inset-0 bg-[#e65649] rounded-full animate-ping opacity-20"></div>
                        <div className="absolute inset-0 bg-[#e65649] rounded-full"></div>
                        <div className="absolute inset-1 bg-white rounded-full"></div>
                        <div className="absolute inset-2 bg-[#e65649] rounded-full"></div>
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Mission Statement */}
      <section className="py-20 lg:py-24 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#000000] mb-8">
                Nuestra Misión
              </h2>

              <div className="space-y-6 font-sans text-lg text-[#2D2D3D] font-normal leading-relaxed">
                <p className="text-justify">
                  Somos un estudio boutique de abogados con sede en Lima, Perú, especializado en brindar
                  asesoría jurídica de alta complejidad en diversas materias legales.
                </p>

                <p className="text-justify">
                  Nuestro enfoque combina la rigurosidad técnica de los grandes estudios jurídicos con la
                  cercanía, agilidad y compromiso personalizado que solo un estudio boutique puede ofrecer.
                </p>

                <p className="font-medium text-[#000000] text-xl text-justify">
                  Ofrecer soluciones jurídicas de excelencia, con un enfoque estratégico y orientado a la
                  protección efectiva de los derechos e intereses de nuestros clientes, dentro de un marco de
                  absoluta reserva, confidencialidad y ética profesional.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Identity - Consolidated Section */}
      <section className="py-20 lg:py-24 bg-[#000000] text-white border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              Nuestra Identidad
            </h2>
            <p className="font-sans text-lg text-gray-300 max-w-3xl mx-auto font-normal">
              Valores, logros y diferenciadores que nos definen como estudio boutique de excelencia.
            </p>
          </motion.div>

          
          {/* Core Values & Differentiators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: Award,
                title: 'Excelencia Técnica',
                description: 'Rigor académico y actualización permanente en tendencias jurídicas.',
              },
              {
                icon: Target,
                title: 'Enfoque Estratégico',
                description: 'Visión de negocio integrando aspectos legales y financieros.',
              },
              {
                icon: Users,
                title: 'Atención Personalizada',
                description: 'Socios participan directamente en cada asunto.',
              },
              {
                icon: Building2,
                title: 'Integridad Absoluta',
                description: 'Ética profesional y transparencia como pilares.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.8 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 text-center hover:bg-white/20 hover:border-white/40 transition-all"
              >
                <div className="w-14 h-14 bg-[#e65649] flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                </div>

                <h3 className="font-sans text-lg font-semibold text-white mb-4">
                  {item.title}
                </h3>

                <p className="font-sans text-sm text-gray-300 leading-relaxed font-normal">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Strategic Alliance */}
      <section className="py-20 lg:py-24 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-10 lg:p-12 border-l-4 border-[#e65649] shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-8 h-8 text-[#e65649]" />
              <h3 className="font-sans text-sm font-bold text-[#e65649] uppercase tracking-wider">
                Alianza Estratégica
              </h3>
            </div>

            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#000000] mb-6">
              Canal Estratégico jurídico de Consultus Group
            </h2>

            <div className="space-y-4 font-sans text-lg text-[#2D2D3D] font-normal leading-relaxed">
              <p>
                Operamos como <span className="font-semibold text-[#000000]">canal estratégico de los servicios
                legales de Consultus Group</span>, combinando la profundidad analítica de una firma de consultoría
                de primer nivel con la solidez jurídica de un estudio legal especializado.
              </p>

              <p>
                Esta alianza nos permite integrar la experiencia de ingenieros especializados en sectores clave
                como energía, hidrocarburos, agroindustria e infraestructura. <span className="font-semibold text-[#000000]">Cada
                caso es atendido directamente por nuestros socios</span>, garantizando un servicio boutique con
                respaldo multidisciplinario de primer nivel.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      </div>
  );
}
