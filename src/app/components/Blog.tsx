import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { fetchStrapiList, getImageUrl, fetchPaginaConfig } from '../../lib/strapi';
import { CATEGORY_LABELS } from '../../lib/strapi-types';
import type { BlogPost, PaginaConfig } from '../../lib/strapi-types';

// Datos de ejemplo LEGACY (mantener para referencia)
const BLOG_POSTS_LEGACY = [
  {
    id: 1,
    title: 'Nuevas regulaciones en el sector energético peruano',
    excerpt: 'Análisis de las últimas disposiciones regulatorias que impactan el desarrollo de proyectos de energía renovable en el Perú.',
    author: 'Dr. Carlos Córdova',
    date: '15 de abril, 2026',
    readTime: '5 min',
    category: 'Energía',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    featured: true
  },
  {
    id: 2,
    title: 'Compliance laboral: Guía para empresas del sector privado',
    excerpt: 'Best practices y consideraciones legales para mantener el cumplimiento normativo en relaciones laborales.',
    author: 'Dra. María Pasco',
    date: '10 de abril, 2026',
    readTime: '7 min',
    category: 'Laboral',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    featured: false
  },
  {
    id: 3,
    title: 'Arbitrajes comerciales: Tendencias y casos relevantes',
    excerpt: 'Evolución jurisprudencial en materia de arbitraje comercial y su aplicación en contratos complejos.',
    author: 'Dr. Luis Mendez',
    date: '5 de abril, 2026',
    readTime: '6 min',
    category: 'Arbitraje',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    featured: false
  },
  {
    id: 4,
    title: 'Gestión de riesgos en contratos de APP',
    excerpt: 'Estrategias legales para la identificación y mitigación de riesgos en Asociaciones Público Privadas.',
    author: 'Dr. Carlos Córdova',
    date: '1 de abril, 2026',
    readTime: '8 min',
    category: 'APPs',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    featured: false
  },
  {
    id: 5,
    title: 'Due diligence legal: Aspectos clave en M&A',
    excerpt: 'Proceso de debida diligencia en fusiones y adquisiciones: enfoque práctico y consideraciones críticas.',
    author: 'Dra. María Pasco',
    date: '28 de marzo, 2026',
    readTime: '10 min',
    category: 'Corporativo',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    featured: false
  },
  {
    id: 6,
    title: 'Control gubernamental: Derechos y garantías del administrado',
    excerpt: 'Marco jurídico que protege a los administrados durante procedimientos de fiscalización y control.',
    author: 'Dr. Luis Mendez',
    date: '25 de marzo, 2026',
    readTime: '6 min',
    category: 'Administrativo',
    image: 'https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    featured: false
  }
];

const categories = ['Todos', 'Energía', 'Laboral', 'Arbitraje', 'APPs', 'Corporativo', 'Administrativo'];

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [paginaConfig, setPaginaConfig] = useState<PaginaConfig | null>(null);

  useEffect(() => {
    const params = activeCategory === 'Todos'
      ? 'sort=publishedDate:desc'
      : `sort=publishedDate:desc&filters[category][$eq]=${activeCategory}`;

    fetchStrapiList<BlogPost>('/blog-posts', params)
      .then(setBlogPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  useEffect(() => {
    fetchPaginaConfig().then(setPaginaConfig);
  }, []);

  const categories = ['Todos', 'Energia', 'Laboral', 'Arbitraje', 'Corporativo', 'Administrativo'];
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-24">
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {paginaConfig?.bannerBlog && (
              <ImageWithFallback
                src={getImageUrl(paginaConfig.bannerBlog)}
                alt="Blog Legal"
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
            <h1 className="font-display text-4xl lg:text-6xl font-bold text-white mb-6">
              Blog Legal
            </h1>
            <p className="font-sans text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
              Análisis jurídico, tendencias regulatorias y perspectives legales para empresas y profesionales del sector.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="text-center mb-8">
                <span className="inline-block px-4 py-2 bg-[#e65649] text-white font-sans text-sm font-semibold rounded-full mb-4">
                  Artículo Destacado
                </span>
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#000000] mb-4">
                  {featuredPost.title}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="aspect-[4/3] overflow-hidden rounded-lg">
                  <ImageWithFallback
                    src={getImageUrl(featuredPost.image) || '/blog.png'}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    {featuredPost.author && (
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {featuredPost.author.name}
                    </span>
                    )}
                    {featuredPost.publishedDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(featuredPost.publishedDate).toLocaleDateString('es-PE', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                    )}
                    {featuredPost.readTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime} min
                    </span>
                    )}
                  </div>

                  <p className="font-sans text-lg text-[#2D2D3D] leading-relaxed mb-6 font-normal text-justify">
                    {featuredPost.excerpt}
                  </p>

                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 text-[#e65649] font-sans font-semibold hover:gap-4 transition-all"
                  >
                    Leer artículo completo
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-20 lg:py-24 bg-[#F4F4F4]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 font-sans text-sm font-medium rounded-full transition-all ${
                  activeCategory === category
                    ? 'bg-[#000000] text-white'
                    : 'bg-white text-[#000000] border border-gray-300 hover:bg-[#000000] hover:text-white'
                }`}
              >
                {CATEGORY_LABELS[category as any] || category}
              </button>
            ))}
          </motion.div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, x: index % 3 === 0 ? -100 : index % 3 === 1 ? 100 : 0 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.8 }}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
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
                    <Link to={`/blog/${post.slug}`} className="hover:text-[#e65649] transition-colors">
                      {post.title}
                    </Link>
                  </h3>

                  {/* Excerpt */}
                  <p className="font-sans text-[#2D2D3D] leading-relaxed mb-4 font-normal text-sm">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-3">
                      {post.author && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author.name}
                      </span>
                      )}
                      {post.publishedDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.publishedDate).toLocaleDateString('es-PE', {
                          day: 'numeric',
                          month: 'short',
                          year: '2-digit'
                        })}
                      </span>
                      )}
                    </div>
                    {post.readTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime} min
                    </span>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Load More Button */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-center mt-12"
          >
            <button className="inline-flex items-center gap-2 px-10 py-4 bg-[#000000] text-white font-sans font-semibold hover:bg-[#e65649] transition-colors">
              Cargar más artículos
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 lg:py-24 bg-[#000000] border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-6">
              Mantente Informado
            </h2>
            <p className="font-sans text-xl text-gray-300 mb-10 font-light">
              Suscríbete a nuestro newsletter para recibir análisis jurídico y actualizaciones regulatorias.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white placeholder-gray-400 font-sans focus:outline-none focus:border-[#e65649] focus:bg-white/20 transition-all"
              />
              <button className="px-8 py-4 bg-[#e65649] text-white font-sans font-semibold hover:bg-[#8B1810] transition-colors">
                Suscribirse
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
