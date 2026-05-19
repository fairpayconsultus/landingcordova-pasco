import { motion } from 'motion/react';
import { Zap, Droplet, Wheat, Building, Building2, GitMerge, Mountain, Users, Home, X, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Link, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { getImageUrl, fetchPaginaConfig, fetchSectors } from '../../lib/strapi';
import type { PaginaConfig, Sector } from '../../lib/strapi-types';

const SECTOR_ICONS: Record<string, React.ComponentType<any>> = {
  Zap, Droplet, Wheat, Building, Building2, GitMerge, Mountain, Users, Home,
};

// Datos LEGACY para fallback
const SECTORS_LEGACY = [
  {
    icon: Zap,
    title: 'Energía',
    subtitle: 'Generación, Transmisión y Distribución',
    slug: 'sector-energia',
    name: 'Energía',
    description: 'Asesoría legal especializada para proyectos de generación eléctrica, líneas de transmisión y sistemas de distribución.',
    services: [
      'Contratos de suministro de energía (PPA)',
      'Concesiones eléctricas y autorizaciones',
      'Aspectos regulatorios ante OSINERGMIN',
      'Proyectos de energías renovables',
      'Servidumbres y derecho de vía',
      'Resolución de controversias en energía',
    ],
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
  },
  {
    icon: Droplet,
    title: 'Oil & Gas',
    subtitle: 'Hidrocarburos y Petroquímica',
    slug: 'sector-oil-gas',
    name: 'Oil & Gas',
    description: 'Experiencia comprobada en la industria de hidrocarburos, desde exploración hasta distribución.',
    services: [
      'Contratos upstream y downstream',
      'Licencias y autorizaciones sectoriales',
      'Normativa ambiental y seguridad',
      'Contratos EPC para plantas de procesamiento',
      'Arbitrajes en proyectos petroleros',
      'Gestión de pasivos ambientales',
    ],
    image: '/oilgas.jpg',
  },
  {
    icon: Wheat,
    title: 'Agroindustria',
    subtitle: 'Producción y Agronegocios',
    slug: 'sector-agroindustria',
    name: 'Agroindustria',
    description: 'Soporte jurídico integral para empresas del sector agrícola y agroindustrial.',
    services: [
      'Derechos de uso de agua',
      'Contratos de compra de productos agrícolas',
      'Certificaciones y cumplimiento fitosanitario',
      'Derecho de propiedad rural',
      'Financiamiento agrícola y garantías',
      'Exportación e importación de productos',
    ],
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
  },
  {
    icon: Building,
    title: 'Sector Público',
    subtitle: 'Infraestructura y Gestión Gubernamental',
    slug: 'sector-publico',
    name: 'Sector Público',
    description: 'Experiencia institucional profunda en entidades del Estado y proyectos de infraestructura pública.',
    services: [
      'Contratos de obra pública',
      'Asociaciones Público-Privadas (APP)',
      'Procedimientos de selección del Estado',
      'Supervisión y liquidación de contratos',
      'Defensa en controversias contractuales',
      'Gestión de proyectos de inversión pública',
    ],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
  },
  {
    icon: 'GitMerge',
    title: 'APPs',
    subtitle: 'Concesiones e Inversión Privada en Infraestructura',
    slug: 'sector-apps',
    name: 'APPs',
    description: 'Asesoría legal integral en la estructuración, negociación y ejecución de Asociaciones Público-Privadas, concesiones y obras por impuestos, con dominio del marco normativo del DL 1362 y el reglamento OSITRAN/MTC.',
    services: [
      'Estructuración de contratos APP y concesiones',
      'Obras por impuestos (Ley 29230)',
      'Negociación de adendas y modificaciones contractuales',
      'Renegociación ante PROINVERSIÓN',
      'Resolución de controversias en contratos de concesión',
      'Asesoría regulatoria ante OSITRAN y MTC',
    ],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
  },
  {
    icon: 'Building2',
    title: 'Infraestructura',
    subtitle: 'Proyectos de Construcción y Obra Pública',
    slug: 'sector-infraestructura',
    name: 'Infraestructura',
    description: 'Soporte jurídico especializado en proyectos de infraestructura pública y privada, con expertise en contratos de construcción bajo estándares internacionales FIDIC y NEC, gestión de claims y resolución de controversias técnicas.',
    services: [
      'Contratos de construcción (FIDIC, NEC, EPC)',
      'Gestión de variaciones y adicionales de obra',
      'Preparación y defensa de claims contractuales',
      'Supervisión y liquidación de contratos de obra',
      'Arbitrajes en proyectos de infraestructura',
      'Contratos de concesión vial, portuaria y aeroportuaria',
    ],
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800',
  },
  {
    icon: 'Mountain',
    title: 'Minería',
    subtitle: 'Industria Extractiva y Recursos Naturales',
    slug: 'sector-mineria',
    name: 'Minería',
    description: 'Asesoría legal en la industria minera peruana, desde la etapa exploratoria hasta el cierre de minas, cubriendo aspectos concesionales, ambientales, comunitarios y contractuales en el marco de la normativa del MINEM.',
    services: [
      'Concesiones mineras y permisos sectoriales',
      'Contratos de exploración y explotación',
      'Gestión de relaciones comunitarias y consulta previa',
      'Cumplimiento normativo ante OEFA y MINEM',
      'Contratos EPC y EPCM para plantas mineras',
      'Cierre de minas y gestión de pasivos ambientales',
    ],
    image: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800',
  },
  {
    icon: 'Users',
    title: 'Servicios & Clubes',
    subtitle: 'Instituciones Privadas y Asociaciones',
    slug: 'sector-servicios-clubes',
    name: 'Servicios & Clubes',
    description: 'Asesoría jurídica para empresas de servicios, clubes deportivos, asociaciones e instituciones privadas, con enfoque en gobierno institucional, compliance y gestión contractual.',
    services: [
      'Gobierno corporativo e institucional',
      'Estatutos y reglamentos internos',
      'Contratos de prestación de servicios',
      'Compliance regulatorio sectorial',
      'Gestión de relaciones laborales en servicios',
      'Asesoría en fusiones y adquisiciones institucionales',
    ],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
  },
  {
    icon: 'Home',
    title: 'Empresas Familiares',
    subtitle: 'Gobierno Familiar y Continuidad Patrimonial',
    slug: 'sector-empresas-familiares',
    name: 'Empresas Familiares',
    description: 'Acompañamos a empresas familiares en su proceso de profesionalización, estructuración de gobierno corporativo y planificación de la continuidad patrimonial, combinando asesoría jurídica con visión estratégica de largo plazo.',
    services: [
      'Protocolo familiar y pactos de accionistas',
      'Estructuración de holding familiar',
      'Planificación sucesoral y transferencia patrimonial',
      'Gobierno corporativo para empresas familiares',
      'Incorporación de directores independientes',
      'Due diligence en procesos de profesionalización',
    ],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
  },
];

// Componente para vista individual del sector
function SectorDetail() {
  const { sectorSlug } = useParams();
  const [sector, setSector] = useState<StrapiSector | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sectorSlug) return;
    fetchStrapiList<StrapiSector>('/sectors', `filters[slug][$eq]=${sectorSlug}&populate=*`)
      .then(results => {
        setSector(results[0] || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sectorSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="font-sans text-gray-600">Cargando sector...</p>
        </div>
      </div>
    );
  }

  if (!sector) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-[#000000] mb-4">
            Sector no encontrado
          </h1>
          <p className="font-sans text-gray-600 mb-8">
            El sector que buscas no existe o ha sido movido.
          </p>
          <Link
            to="/sectores"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#e65649] text-white font-sans font-semibold hover:bg-[#8B1810] transition-colors rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a Sectores
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={getImageUrl(sector.image) || '/sectores.png'}
            alt={sector.name}
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 70%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center px-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link
                to="/sectores"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver a Sectores
              </Link>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {sector.name}
              </h1>
              <p className="font-sans text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                {sector.subtitle || sector.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#000000] mb-6">
              Descripción del Sector
            </h2>
            <p className="font-sans text-lg text-gray-600 leading-relaxed text-justify">
              {sector.description}
            </p>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#000000] mb-8">
              Servicios Especializados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sector.services.map((service, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + idx * 0.1 }}
                  className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-3 h-3 bg-[#e65649] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="font-sans text-gray-700 font-medium">{service}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-[#e65649] to-[#8B1810] rounded-3xl p-8 lg:p-12 text-white">
              <h3 className="font-display text-2xl lg:text-3xl font-bold mb-4">
                ¿Necesita asesoría en {sector.title}?
              </h3>
              <p className="font-sans text-lg mb-8 text-white/90 text-justify">
                Nuestro equipo de expertos está listo para ayudarle con sus proyectos y necesidades legales en este sector.
              </p>
              <Link
                to="/contacto"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#e65649] font-sans font-semibold hover:bg-gray-100 transition-colors rounded-xl"
              >
                Contactar Expertos
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export function Sectores() {
  const { sectorSlug } = useParams();
  const [paginaConfig, setPaginaConfig] = useState<PaginaConfig | null>(null);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchPaginaConfig(),
      fetchSectors(),
    ])
      .then(([config, sectorsData]) => {
        setPaginaConfig(config);
        setSectors(sectorsData || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Si hay un slug, mostrar vista individual
  if (sectorSlug) {
    return <SectorDetail />;
  }

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
            {paginaConfig?.bannerSectores && (
              <ImageWithFallback
                src={getImageUrl(paginaConfig.bannerSectores)}
                alt="Sectores Industriales"
                className="w-full h-full object-cover"
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
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">
              Sectores Especializados
            </h1>

            <motion.p
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-sans text-xl text-gray-300 max-w-3xl mx-auto font-normal"
            >
              Conocimiento profundo de las industrias más reguladas y técnicamente complejas,
              respaldado por ingeniería especializada.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
          <motion.h2
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-3xl lg:text-4xl font-bold text-[#000000] mb-6"
          >
            La Diferencia Multidisciplinaria
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-sans text-lg text-[#2D2D3D] leading-relaxed font-normal text-justify"
          >
            En alianza con <span className="font-semibold text-[#000000]">Consultus Group</span>, contamos
            con ingenieros especializados que comprenden la complejidad técnica de cada sector. Esta sinergia
            nos permite ofrecer asesoría legal fundamentada en la realidad operativa y regulatoria de
            industrias altamente especializadas.
          </motion.p>
        </div>
      </section>

      {/* Sectors Grid - Crossover Design */}
      <section className="py-20 bg-gradient-to-br from-[#F8F9FA] to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#e65649]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#000000]/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="space-y-32 lg:space-y-48">
            {sectors.map((sector, index) => (
              <div key={sector.slug} id={`sector-${sector.slug}`} className="relative">
                {/* Crossover Container */}
                <div className={`relative grid grid-cols-1 lg:grid-cols-2 gap-0 items-center min-h-[600px] ${
                  index % 2 === 0 ? 'lg:grid-flow-col' : 'lg:grid-flow-col-dense'
                }`}>
                  
                  {/* Image Section - Overlapping */}
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -200 : 200 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.08, type: "spring" }}
                    className={`relative z-20 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}
                  >
                    <div className="relative">
                      {/* Main Image */}
                      <div className="aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl">
                        <ImageWithFallback
                          src={getImageUrl(sector.image) || '/sectores.png'}
                          alt={sector.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                        />
                      </div>

                      {/* Floating Badge */}
                      {sector.icon && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.6, type: "spring" }}
                        className="absolute -top-4 -right-4 bg-white shadow-2xl rounded-2xl p-4 border-2 border-[#e65649]/20 backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#e65649] to-[#8B1810] rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/50">
                            {(() => {
                              const IconComponent = SECTOR_ICONS[sector.icon] || Zap;
                              return <IconComponent className="w-6 h-6 text-white" strokeWidth={2.5} />;
                            })()}
                          </div>
                          <div className="pr-2">
                            <p className="font-sans text-xs font-bold text-[#000000] uppercase tracking-wider drop-shadow-sm">
                              {sector.subtitle || sector.name}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                      )}
                      
                      {/* Decorative Elements */}
                      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#e65649]/10 rounded-2xl transform rotate-12"></div>
                      <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#000000]/10 rounded-xl transform -rotate-12"></div>
                    </div>
                  </motion.div>

                  {/* Content Section - Overlapping */}
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? 200 : -200 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1, type: "spring" }}
                    className={`relative z-30 ${index % 2 === 0 ? 'lg:left-1/2 lg:-translate-x-8' : 'lg:right-1/2 lg:translate-x-8'} lg:absolute lg:top-1/2 lg:transform lg:-translate-y-1/2 w-full lg:w-auto lg:max-w-lg`}
                  >
                    <div className="bg-white/95 rounded-3xl shadow-2xl p-6 md:p-8 lg:p-12 border-2 border-[#e65649]/10 hover:shadow-3xl hover:border-[#e65649]/30 transition-all duration-500 backdrop-blur-sm relative overflow-hidden">
                      {/* Background Accent */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#e65649]/5 to-transparent rounded-bl-3xl"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#000000]/5 to-transparent rounded-tr-3xl"></div>
                      
                      {/* Content Header */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.5, duration: 0.6 }}
                        className="relative z-10"
                      >
                        <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-[#000000] mb-3 drop-shadow-sm">
                          {sector.name}
                        </h3>
                        <div className="w-20 h-1.5 bg-gradient-to-r from-[#e65649] via-[#e65649]/70 to-[#e65649]/30 rounded-full mb-6 shadow-sm"></div>
                      </motion.div>

                      {/* Description */}
                      <motion.p
                        initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.6, duration: 0.8 }}
                        className="font-sans text-base md:text-lg text-[#2D2D3D] leading-relaxed mb-8"
                      >
                        {sector.description || sector.content}
                      </motion.p>

                      {/* Services */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.7, duration: 0.6 }}
                      >
                        <h4 className="font-sans text-xs md:text-sm font-bold text-[#000000] mb-4 uppercase tracking-wider">
                          Servicios Especializados:
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                          {(sector.services || []).slice(0, 4).map((service, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.8 + idx * 0.1, duration: 0.4 }}
                              className="flex items-start gap-3"
                            >
                              <div className="w-2 h-2 bg-[#e65649] rounded-full mt-2 flex-shrink-0"></div>
                              <span className="font-sans text-sm md:text-base text-[#2D2D3D]">{service}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                    </div>
                  </motion.div>
                </div>

                {/* Connecting Line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.5, duration: 0.8 }}
                  className={`absolute top-1/2 transform -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#e65649]/20 to-transparent ${
                    index % 2 === 0 ? 'left-0' : 'right-0'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Advantage */}
      <section className="py-20 lg:py-24 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#000000] mb-4">
              Ventaja Competitiva
            </h2>
            <p className="font-sans text-lg text-[#2D2D3D] max-w-3xl mx-auto font-normal text-justify">
              Nuestro enfoque multidisciplinario nos distingue en el mercado legal.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Comprensión Técnica',
                description: 'Entendemos los aspectos de ingeniería detrás de cada proyecto. Hablamos el lenguaje técnico de nuestros clientes.',
              },
              {
                title: 'Experiencia Institucional',
                description: 'Trayectoria comprobada en entidades del Estado y empresas líderes en sectores regulados.',
              },
              {
                title: 'Visión Integral',
                description: 'Análisis que integra aspectos legales, técnicos, regulatorios y financieros para decisiones informadas.',
              },
            ].map((advantage, index) => (
              <motion.div
                key={advantage.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.8 }}
                className="bg-gray-50 border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:border-[#e65649]/20 transition-all"
              >
                <div className="w-12 h-12 bg-[#e65649] mx-auto mb-6 flex items-center justify-center">
                  <span className="font-display text-2xl font-bold text-white">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="font-sans text-xl font-semibold text-[#000000] mb-4">
                  {advantage.title}
                </h3>

                <p className="font-sans text-[#2D2D3D] font-normal leading-relaxed">
                  {advantage.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#000000] border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">
              ¿Su Proyecto Requiere Expertise Técnico-Legal?
            </h2>
            <p className="font-sans text-xl text-gray-300 mb-10 font-normal">
              Conversemos sobre cómo nuestra experiencia multidisciplinaria puede agregar valor a su organización.
            </p>
            <Link
              to="/contacto"
              className="inline-block px-10 py-4 bg-[#e65649] text-white font-sans font-semibold hover:bg-[#8B1810] transition-colors"
            >
              Contactar al Equipo
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
