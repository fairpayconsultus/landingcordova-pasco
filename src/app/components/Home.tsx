import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import { Scale, FileText, Users, Gavel, Shield, Briefcase, Building2, ArrowRight, Search, Filter } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { AbogadosSearch } from './AbogadosSearch';
import { fetchStrapiList, getImageUrl, fetchPaginaConfig } from '../../lib/strapi';
import { CATEGORY_LABELS } from '../../lib/strapi-types';
import type { TeamMember, HeroSlide, BlogPost, PaginaConfig, Sector } from '../../lib/strapi-types';

// Datos LEGACY para fallback
const TEAM_MEMBERS_LEGACY = [
  {
    id: 1,
    name: 'Omar E. Córdova Paredes',
    role: 'Socio Director',
    image: '/Omar.png',
    experience: '12+ años de experiencia',
    practiceAreas: ['Derecho Administrativo', 'Energía', 'Control Gubernamental'],
  },
  {
    id: 2,
    name: 'Jorge Pasco',
    role: 'Socio',
    image: '/Jorge Pasco.jpeg',
    experience: '10+ años de experiencia',
    practiceAreas: ['Derecho Administrativo', 'Defensa de Funcionarios', 'Gestión Contractual'],
  },
  {
    id: 3,
    name: 'Alejandro Castillo',
    role: 'Socio',
    image: '/Alejandro Castillo.jpeg',
    experience: '8+ años de experiencia en Arbitraje',
    practiceAreas: ['Arbitraje', 'Contratos', 'Resolución de Controversias'],
  },
  {
    id: 4,
    name: 'Diego Larico',
    role: 'Asociado Senior',
    image: '/Diego Larico.jpeg',
    experience: '7+ años de experiencia en Derecho Corporativo',
    practiceAreas: ['Derecho Corporativo', 'M&A', 'Due Diligence'],
  },
  {
    id: 5,
    name: 'Mayra Ormea',
    role: 'Asociada Senior',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
    experience: '10+ años de experiencia en Derecho Laboral',
    practiceAreas: ['Derecho Laboral', 'Relaciones Laborales', 'Compliance Laboral'],
  },
];

// Componente para conteo animado
function AnimatedCounter({ value, duration = 2000 }: { value: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    
    let start = 0;
    const end = parseInt(value.replace(/\D/g, ''));
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [isVisible, value, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      onAnimationComplete={() => setIsVisible(true)}
    >
      {value.includes('%') ? `${count}%` : value.includes('+') ? `+${count}` : count}
    </motion.div>
  );
}

const services = [
  {
    icon: Shield,
    title: 'Derecho Administrativo y Control Gubernamental',
    description: 'Soporte técnico-legal especializado en fiscalizaciones, auditorías y compliance regulatorio.',
  },
  {
    icon: Gavel,
    title: 'Defensa de Funcionarios Públicos',
    description: 'Representación y soporte legal integral en procedimientos sancionadores.',
  },
  {
    icon: Users,
    title: 'Derecho Laboral y Relaciones Colectivas',
    description: 'Asesoría jurídica laboral integral, negociación colectiva y litigio.',
  },
  {
    icon: Scale,
    title: 'Disputas, Arbitrajes y Litigios',
    description: 'Resolución estratégica de controversias contractuales y técnicas.',
  },
  {
    icon: FileText,
    title: 'Gestión Contractual y Compliance',
    description: 'Gestión integral del ciclo de vida contractual y cumplimiento normativo.',
  },
  {
    icon: Briefcase,
    title: 'Gestión Legal y Documental',
    description: 'Documentación estratégica, due diligence y gestión documental ISO.',
  },
  {
    icon: Building2,
    title: 'Derecho Corporativo y Societario',
    description: 'Asesoría integral en gobierno corporativo y operaciones societarias.',
  },
];

const differentiators = [
  {
    title: 'Enfoque Integrado',
    description: 'Nuestros servicios interactúan y se potencian mutuamente bajo una sola gobernanza estratégica.',
  },
  {
    title: 'Profundidad Sectorial',
    description: 'Experiencia directa en energía, oil & gas, agroindustria, APPs y sector público.',
  },
  {
    title: 'Equipos Multidisciplinarios',
    description: 'Ingenieros, abogados y economistas garantizan una perspectiva integral en cada caso.',
  },
  {
    title: 'Experiencia Institucional',
    description: 'Nuestros socios han ocupado posiciones estratégicas en entidades del Estado.',
  },
  {
    title: 'Resultados Medibles',
    description: 'Cada intervención genera impacto cuantificable: reducción de riesgo y protección de intereses.',
  },
  {
    title: 'Confidencialidad Absoluta',
    description: 'Operamos bajo los más altos estándares de reserva, independencia y ética profesional.',
  },
];

export function Home() {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paginaConfig, setPaginaConfig] = useState<PaginaConfig | null>(null);

  useEffect(() => {
    Promise.all([
      fetchStrapiList<HeroSlide>('/hero-slides', 'filters[isActive][$eq]=true&sort=order:asc'),
      fetchStrapiList<TeamMember>('/team-members', 'sort=order:asc&pagination[limit]=3'),
      fetchStrapiList<BlogPost>('/blog-posts', 'filters[featured][$eq]=true&sort=publishedDate:desc&pagination[limit]=3'),
      fetchStrapiList<Sector>('/sectors', 'sort=order:asc'),
      fetchPaginaConfig(),
    ])
      .then(([slides, members, posts, sectorsList, config]) => {
        setHeroSlides(slides);
        setTeamMembers(members);
        setFeaturedPosts(posts);
        setSectors(sectorsList);
        setPaginaConfig(config);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
    }, 5000); // Cambio cada 5 segundos

    return () => clearInterval(interval);
  }, [heroSlides]);

  return (
    <div className="w-full bg-white">
      {/* Hero Section - Enhanced & Fully Responsive with Image Slider */}
      <section className="relative h-[calc(100vh-5rem)] lg:h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden bg-[#000000]">
        {/* Background Image Slider */}
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {heroSlides.length > 0 && (
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <ImageWithFallback
                  src={getImageUrl(heroSlides[currentImageIndex]?.image)}
                  alt="Background"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subtle Overlay for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center">

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-4 flex justify-center"
            >
              <img
                src="/logo.png"
                alt="Córdova & Pasco Logo"
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"
              />
            </motion.div>

            {/* Main Heading with Stagger Animation */}
            <div className="mb-2 px-2">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-1"
              >
                Córdova & Pasco
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              >
                <span className="text-white">Asociados</span>
              </motion.div>
            </div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-3 px-4"
            >
              <div className="inline-block max-w-full">
                <p className="font-kanit text-base sm:text-lg md:text-xl lg:text-2xl text-[#e65649] font-semibold mb-1.5">
                  Legal Partners
                </p>
                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#e65649] to-transparent" />
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="font-sans text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-3 max-w-3xl mx-auto font-light leading-snug px-4"
            >
              Estudio boutique especializado en asesoría jurídica de alta complejidad para el sector público y privado.
              Canal estratégico jurídico de <span className="text-white font-medium">Consultus Group</span>.
            </motion.p>

            {/* Sectors Pills - Responsive */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-wrap justify-center gap-1.5 px-4"
            >
              {sectors.map((sector, index) => (
                <motion.div
                  key={sector.slug}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                >
                  <Link
                    to={`/sectores#sector-${sector.slug}`}
                    className="inline-block px-2 sm:px-3 py-1 bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 font-sans text-xs font-medium hover:bg-[#e65649]/20 hover:border-[#e65649] hover:text-white transition-all"
                  >
                    {sector.name}
                  </Link>
                </motion.div>
              ))}
            </motion.div>


          </div>
        </div>

        {/* Slider Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-20 hidden"
        >
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`transition-all duration-300 ${
                index === currentImageIndex
                  ? 'w-8 h-1.5 bg-[#e65649]'
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60'
              } rounded-full`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                {paginaConfig?.imagenAcerca && (
                  <ImageWithFallback
                    src={getImageUrl(paginaConfig.imagenAcerca)}
                    alt="Professional Team"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h2 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-display text-4xl lg:text-5xl font-bold text-[#000000] mb-6"
              >
                Acerca del Estudio
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="font-sans text-lg text-[#2D2D3D] leading-relaxed mb-6 font-normal text-justify"
              >
                Somos un estudio boutique de abogados con sede en Lima, Perú, especializado en brindar
                asesoría jurídica de alta complejidad en diversas materias legales.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="font-sans text-lg text-[#2D2D3D] leading-relaxed mb-6 font-normal text-justify"
              >
                Nuestro enfoque combina la rigurosidad técnica de los grandes estudios jurídicos con la
                cercanía, agilidad y compromiso personalizado que solo un estudio boutique puede ofrecer.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="font-sans text-lg text-[#2D2D3D] leading-relaxed mb-8 font-normal text-justify"
              >
                Operamos como <span className="font-semibold text-[#000000]">canal estratégico de los servicios
                legales de Consultus Group</span>, combinando la profundidad analítica de una firma de
                consultoría de primer nivel con la solidez jurídica de un estudio legal especializado.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Link
                  to="/nosotros"
                  className="inline-flex items-center gap-2 text-[#e65649] font-sans font-semibold hover:gap-4 transition-all"
                >
                  Conocer más sobre nosotros
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline & Differentiators Section */}
      <section className="py-20 lg:py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#000000] mb-4">
              Más de 25 años de expertise institucional
            </h2>
            <p className="font-sans text-xl text-[#2D2D3D] max-w-3xl mx-auto font-light">
              Un estudio boutique forjado en las entrañas del Estado, transformado en asesor de primer nivel para el sector privado.
            </p>
          </motion.div>

          {/* Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {/* Milestone 1 */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-[#e65649] to-[#8B1810] rounded-3xl p-8 text-white h-full hover:shadow-2xl transition-all">
                <div className="absolute -top-6 left-8 bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg border-4 border-[#e65649]">
                  <span className="font-display text-2xl font-bold text-[#e65649]">25+</span>
                </div>
                <h3 className="font-display text-2xl font-bold mb-4 mt-6">Años de Trayectoria</h3>
                <p className="font-sans text-white/90 leading-relaxed">
                  Desde la experiencia institucional en Contraloría, JNJ y Procuraduría hacia la asesoría privada especializada.
                </p>
              </div>
            </motion.div>

            {/* Milestone 2 */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-[#2D2D3D] to-[#000000] rounded-3xl p-8 text-white h-full hover:shadow-2xl transition-all">
                <div className="absolute -top-6 left-8 bg-[#e65649] rounded-full w-16 h-16 flex items-center justify-center shadow-lg border-4 border-white">
                  <span className="font-display text-2xl font-bold text-white">9</span>
                </div>
                <h3 className="font-display text-2xl font-bold mb-4 mt-6">Sectores Especializados</h3>
                <p className="font-sans text-white/90 leading-relaxed">
                  Energía, Oil & Gas, APPs, Minería, Infraestructura, Agroindustria y más. Expertise en industrias reguladas.
                </p>
              </div>
            </motion.div>

            {/* Milestone 3 */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-[#e65649]/10 to-[#e65649]/5 rounded-3xl p-8 border-2 border-[#e65649] h-full hover:shadow-2xl hover:border-[#e65649]/80 transition-all">
                <div className="absolute -top-6 left-8 bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg border-4 border-[#e65649]">
                  <span className="font-display text-2xl font-bold text-[#e65649]">7</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-[#000000] mb-4 mt-6">Prácticas Legales</h3>
                <p className="font-sans text-[#2D2D3D] leading-relaxed">
                  Desde Derecho Administrativo hasta Corporativo. Cobertura integral y multidisciplinaria de servicios legales.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Differentiators */}
          <div className="bg-gradient-to-r from-[#e65649] via-[#8B1810] to-[#e65649] rounded-3xl p-12 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'linear-gradient(45deg, white 25%, transparent 25%, transparent 75%, white 75%, white), linear-gradient(45deg, white 25%, transparent 25%, transparent 75%, white 75%, white)',
              backgroundSize: '40px 40px',
              backgroundPosition: '0 0, 20px 20px'
            }} />

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <h3 className="font-display text-3xl lg:text-4xl font-bold text-white mb-12 text-center">
                ¿Por qué somos diferentes?
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                      <span className="text-2xl">🧠</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-white text-lg mb-2">Enfoque Multidisciplinario</h4>
                    <p className="font-sans text-white/90 text-sm leading-relaxed">
                      Abogados + Ingenieros + Economistas. Perspectiva integral que entiende la realidad operativa más allá de lo legal.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                      <span className="text-2xl">🏛️</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-white text-lg mb-2">Experiencia Institucional</h4>
                    <p className="font-sans text-white/90 text-sm leading-relaxed">
                      Nuestros socios han dirigido procedimientos en CGR, JNJ y Procuraduría. Conocimiento insider del aparato estatal.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                      <span className="text-2xl">⚙️</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-white text-lg mb-2">Expertise Sectorial Profundo</h4>
                    <p className="font-sans text-white/90 text-sm leading-relaxed">
                      Especialización comprobada en energía, O&G, minería, APPs e infraestructura. No generales, especialistas.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                      <span className="text-2xl">🎯</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-white text-lg mb-2">Boutique con Poder</h4>
                    <p className="font-sans text-white/90 text-sm leading-relaxed">
                      Agilidad y cercanía de un estudio pequeño, con recursos y alcance de Consultus Group. Lo mejor de ambos mundos.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-[#000000] to-[#2D2D3D] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(#e65649 1px, transparent 1px), linear-gradient(90deg, #e65649 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <motion.h2 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-display text-4xl lg:text-5xl font-bold text-white mb-4"
            >
              Nuestros Servicios
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-sans text-lg text-gray-300 max-w-3xl mx-auto font-normal"
            >
              Portafolio integral de siete prácticas legales especializadas, articuladas bajo una
              gobernanza estratégica única.
              Soluciones jurídicas integrales para el sector público y privado.
            </motion.p>
          </motion.div>

          {/* Services Timeline */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {services.slice(0, 4).map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="relative mb-12 last:mb-0"
              >
                {/* Timeline line */}
                {index < services.length - 1 && (
                  <div className="absolute left-12 top-32 w-1 h-20 bg-gradient-to-b from-[#e65649] to-transparent"></div>
                )}

                {/* Service Card */}
                <div className={`flex gap-8 items-start ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}>
                  {/* Timeline Dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15, duration: 0.5, type: "spring" }}
                    className="flex-shrink-0 relative z-10"
                  >
                    <div className="w-28 h-28 bg-gradient-to-br from-[#e65649] to-[#8B1810] rounded-full flex items-center justify-center shadow-2xl border-4 border-[#2D2D3D]">
                      <div className="flex flex-col items-center">
                        <span className="font-sans text-xs font-bold text-white/80 uppercase tracking-wider">Servicio</span>
                        <span className="font-display text-3xl font-bold text-white">{String(index + 1).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Content Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15, duration: 0.6 }}
                    className="flex-1 pt-4"
                  >
                    <div className="bg-white/95 backdrop-blur-sm border-2 border-white/40 rounded-2xl p-8 hover:shadow-2xl hover:border-[#e65649]/50 transition-all">
                      {/* Icon */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-[#e65649] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <service.icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-2xl font-bold text-[#000000] mb-3">
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p className="font-sans text-[#2D2D3D] leading-relaxed font-normal mb-6">
                        {service.description}
                      </p>

                      {/* Link */}
                      <Link
                        to="/servicios"
                        className="inline-flex items-center gap-2 text-[#e65649] font-sans font-semibold hover:gap-4 transition-all"
                      >
                        Ver detalles
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-center mt-12"
          >
            <Link
              to="/servicios"
              className="inline-flex items-center gap-2 px-10 py-4 bg-[#e65649] text-white font-sans font-semibold hover:bg-[#8B1810] transition-colors"
            >
              Ver Portafolio Completo
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Separador */}
      <div className="border-y border-gray-200"></div>

      {/* Why Choose Us */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <motion.h2 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-display text-4xl lg:text-5xl font-bold text-[#000000] mb-4"
            >
              ¿Por Qué Elegirnos?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-sans text-lg text-[#2D2D3D] max-w-3xl mx-auto font-normal"
            >
              Diferenciadores que nos posicionan como la mejor opción para asesoría jurídica especializada.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {differentiators.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: index % 3 === 0 ? -100 : index % 3 === 1 ? 100 : 0 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.8 }}
                className="bg-gray-50 border border-gray-200 p-8 hover:shadow-lg hover:border-[#e65649]/20 transition-all"
              >
                <div className="w-12 h-1 bg-[#e65649] mb-6" />
                <h3 className="font-sans text-xl font-semibold text-[#000000] mb-4">
                  {item.title}
                </h3>
                <p className="font-sans text-[#2D2D3D] leading-relaxed font-normal">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Separador */}
      <div className="border-y border-gray-200"></div>

      {/* Blog Preview Section */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#000000] mb-4">
              Blog Legal
            </h2>
            <p className="font-sans text-lg text-[#2D2D3D] max-w-3xl mx-auto font-normal">
              Análisis jurídico y perspectivas sobre las últimas tendencias regulatorias en el sector legal peruano.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.8 }}
                className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-[#e65649]/20 transition-all"
              >
                {/* Image */}
                <div className="aspect-[16/9] overflow-hidden">
                  <ImageWithFallback
                    src={getImageUrl(post.image) || '/blog.png'}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category */}
                  <span className="inline-block px-3 py-1 bg-[#e65649]/10 text-[#e65649] font-sans text-xs font-semibold rounded-full mb-3">
                    {CATEGORY_LABELS[post.category as any] || post.category}
                  </span>

                  {/* Title */}
                  <h3 className="font-display text-xl font-bold text-[#000000] mb-3 leading-tight">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="font-sans text-[#2D2D3D] leading-relaxed mb-4 font-normal text-sm">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                    <div className="flex items-center gap-3">
                      {post.author && <span>{post.author.name}</span>}
                      {post.publishedDate && (
                        <span>
                          {new Date(post.publishedDate).toLocaleDateString('es-PE', {
                            day: 'numeric',
                            month: 'short',
                            year: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                    {post.readTime && <span>{post.readTime} min</span>}
                  </div>

                  {/* Read More Link */}
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-[#e65649] font-sans font-semibold text-sm hover:gap-4 transition-all"
                  >
                    Leer más
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-center"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-10 py-4 bg-[#000000] text-white font-sans font-semibold hover:bg-[#e65649] transition-colors"
            >
              Ver todos los artículos
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Separador */}
      <div className="border-y border-gray-200"></div>

      {/* Abogados Search Section */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <motion.h2 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-display text-4xl lg:text-5xl font-bold text-[#000000] mb-4"
            >
              Nuestro Equipo
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-sans text-lg text-[#2D2D3D] max-w-3xl mx-auto font-normal"
            >
              Encuentra al especialista ideal para tus necesidades legales específicas.
            </motion.p>
          </motion.div>

          {/* Search Form */}
          <AbogadosSearch 
            onSearch={(searchTerm, practiceArea, industry, category) => {
              // Construir URL con parámetros de búsqueda
              const params = new URLSearchParams();
              if (searchTerm) params.append('search', searchTerm);
              if (practiceArea !== 'Todas') params.append('practiceArea', practiceArea);
              if (industry !== 'Todas') params.append('industry', industry);
              if (category !== 'Todos') params.append('category', category);
              
              const url = `/abogados${params.toString() ? '?' + params.toString() : ''}`;
              window.location.href = url;
            }}
            className="mb-16"
          />

          {/* Featured Lawyers Preview */}
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl font-bold text-[#000000] mb-2">
              Abogados Destacados
            </h3>
            <p className="font-sans text-gray-600">
              Conozca a nuestros socios directores
            </p>
          </div>

          {/* Small Lawyer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {teamMembers.slice(0, 3).map((lawyer, index) => (
              <motion.div
                key={lawyer.slug}
                initial={{ opacity: 0, x: index % 3 === 0 ? -100 : index % 3 === 1 ? 100 : 0 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.8 }}
                className="bg-[#000000]/95 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden hover:shadow-xl hover:bg-[#000000] transition-all"
              >
                <div className="flex items-start p-4">
                  {/* Small Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 mr-4">
                    <ImageWithFallback
                      src={getImageUrl(lawyer.photo) || '/Omar.png'}
                      alt={lawyer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left">
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 bg-[#e65649] text-white font-sans text-xs font-semibold rounded-full">
                        {lawyer.role}
                      </span>
                    </div>
                    <h4 className="font-display text-lg font-bold text-white mb-1">
                      {lawyer.name}
                    </h4>
                    <p className="font-sans text-xs text-gray-300 mb-2">
                      {lawyer.experience || lawyer.role}
                    </p>
                    {/* Practice Areas */}
                    <div className="flex flex-wrap gap-1">
                      {(lawyer.practiceAreas || []).slice(0, 2).map((area, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-[#e65649]/20 text-white font-sans text-xs rounded"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center"
          >
            <Link
              to="/abogados"
              className="inline-flex items-center justify-center gap-2 px-12 py-4 bg-[#000000] border-2 border-white/20 text-white font-sans font-semibold hover:bg-white hover:text-[#000000] transition-colors"
            >
              Ver Todos los Abogados
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
