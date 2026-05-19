import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { fetchStrapiList, getImageUrl } from '../../lib/strapi';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { BlogPost } from '../../lib/strapi-types';

export default function BlogPostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetchStrapiList<BlogPost>('/blog-posts', `filters[slug][$eq]=${slug}&populate=*`)
      .then(results => {
        setPost(results[0] || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-6 inline-block"
          >
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#e65649] rounded-full"></div>
          </motion.div>
          <p className="font-sans text-gray-600">Cargando artículo...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-2xl mx-auto px-6">
          <h1 className="font-display text-3xl font-bold text-[#000000] mb-4">
            Artículo no encontrado
          </h1>
          <p className="font-sans text-gray-600 mb-8">
            El artículo que buscas no existe o ha sido removido.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#e65649] text-white font-sans font-semibold hover:bg-[#8B1810] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Blog
          </Link>
        </div>
      </div>
    );
  }

  const publishedDate = post.publishedDate
    ? new Date(post.publishedDate).toLocaleDateString('es-PE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '';

  return (
    <div className="w-full bg-white">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <ImageWithFallback
              src={getImageUrl(post.image) || '/blog.png'}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-2 bg-[#e65649] text-white font-sans text-sm font-semibold rounded-full mb-4">
              {post.category}
            </span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>
            <p className="font-sans text-lg text-gray-200 max-w-2xl mx-auto">
              {post.excerpt}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Metadata */}
      <motion.section
        className="py-8 bg-[#F8F9FA] border-b border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-6 justify-between"
          >
            <div className="flex flex-wrap gap-6">
              {publishedDate && (
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5 text-[#e65649]" />
                <span className="font-sans text-sm">{publishedDate}</span>
              </div>
              )}

              {post.author && (
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-5 h-5 text-[#e65649]" />
                <span className="font-sans text-sm">{post.author.name}</span>
              </div>
              )}

              {post.readTime && (
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5 text-[#e65649]" />
                <span className="font-sans text-sm">{post.readTime} min de lectura</span>
              </div>
              )}
            </div>

            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-[#e65649] hover:text-[#8B1810] transition-colors font-sans font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al blog
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Contenido */}
      <motion.section
        className="py-20 bg-white"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <article className="max-w-4xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg max-w-none
              prose-headings:font-display prose-headings:text-[#000000]
              prose-h1:text-4xl prose-h1:mb-12 prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-10 prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-8
              prose-p:font-sans prose-p:text-[#2D2D3D] prose-p:leading-relaxed prose-p:mb-8 prose-p:mt-4
              prose-a:text-[#e65649] hover:prose-a:text-[#8B1810]
              prose-strong:text-[#000000] prose-strong:font-semibold
              prose-em:text-[#2D2D3D]
              prose-code:bg-gray-100 prose-code:text-[#e65649] prose-code:px-2 prose-code:py-1 prose-code:rounded
              prose-pre:bg-gray-900 prose-pre:text-white
              prose-blockquote:border-[#e65649] prose-blockquote:text-[#2D2D3D]
              prose-ul:text-[#2D2D3D] prose-ul:mb-6 prose-ol:text-[#2D2D3D] prose-ol:mb-6
              prose-li:marker:text-[#e65649]
              prose-img:rounded-lg prose-img:shadow-lg
            "
          >
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-6 last:mb-0">{children}</p>,
                h2: ({ children }) => <h2 className="mt-12 mb-6">{children}</h2>,
                h3: ({ children }) => <h3 className="mt-8 mb-4">{children}</h3>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-6">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-6">{children}</ol>,
                li: ({ children }) => <li className="mb-2">{children}</li>,
              }}
            >
              {post.content || ''}
            </ReactMarkdown>
          </motion.div>
        </article>
      </motion.section>

      {/* CTA */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-3xl font-bold text-[#000000] mb-4">
              ¿Necesita asesoría legal?
            </h2>
            <p className="font-sans text-lg text-[#2D2D3D] mb-8 max-w-2xl mx-auto">
              Contáctenos para discutir cómo podemos ayudarlo con sus necesidades legales.
            </p>
            <Link
              to="/contacto"
              className="inline-block px-8 py-3 bg-[#e65649] text-white font-sans font-semibold hover:bg-[#8B1810] transition-colors"
            >
              Contáctenos
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
