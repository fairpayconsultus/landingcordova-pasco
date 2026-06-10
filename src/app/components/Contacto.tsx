import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { fetchPaginaConfig, getImageUrl } from '../../lib/strapi';
import type { PaginaConfig } from '../../lib/strapi-types';

export function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    servicio: '',
    mensaje: '',
  });
  const [paginaConfig, setPaginaConfig] = useState<PaginaConfig | null>(null);

  useEffect(() => {
    fetchPaginaConfig().then(setPaginaConfig);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Gracias por su consulta. Nos pondremos en contacto a la brevedad.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] bg-[#000000] flex items-center justify-center">
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {paginaConfig?.bannerContacto && (
              <ImageWithFallback
                src={getImageUrl(paginaConfig.bannerContacto)}
                alt="Contacto Legal"
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
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">
              Contacto
            </h1>
            <p className="font-sans text-xl text-gray-300 max-w-2xl mx-auto font-normal">
              Estamos listos para analizar su caso y ofrecerle soluciones jurídicas de primer nivel.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div>
                <h2 className="font-display text-3xl font-bold text-[#000000] mb-6">
                  Información de Contacto
                </h2>
                <p className="font-sans text-[#2D2D3D] leading-relaxed font-normal mb-8 text-justify">
                  Nuestra oficina en Miraflores está estratégicamente ubicada para atender
                  a empresas e instituciones en Lima.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#e65649] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-[#000000] mb-1">Dirección</h4>
                    <p className="font-sans text-[#2D2D3D] font-normal">
                      Jr. Cruz del sur N°140,<br />
                     Of. 405 - Santiago de Surco
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#e65649] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-[#000000] mb-1">Teléfono</h4>
                    <p className="font-sans text-[#2D2D3D] font-normal">983861874</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#e65649] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-[#000000] mb-1">Email</h4>
                    <p className="font-sans text-[#2D2D3D] font-normal">contacto@cp-asociados.pe</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#e65649] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-[#000000] mb-1">Horario</h4>
                    <p className="font-sans text-[#2D2D3D] font-normal">
                      Lunes - Viernes<br />
                      8:30 AM - 5:30 PM
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="bg-gray-50 border border-gray-200 p-8 lg:p-10 hover:shadow-lg hover:border-[#e65649]/20 transition-all">
                <h3 className="font-display text-3xl font-bold text-[#000000] mb-6">
                  Solicite una Consulta
                </h3>

                {/* Confidentiality Notice */}
                <div className="mb-8 p-4 bg-white border-l-4 border-[#e65649]">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-[#e65649] flex-shrink-0 mt-0.5" />
                    <p className="font-sans text-sm text-[#2D2D3D] leading-relaxed font-normal">
                      Toda información compartida con nuestro estudio es tratada bajo estricta confidencialidad
                      profesional. Su primera consulta no genera ninguna obligación y nos permite evaluar
                      cómo podemos asistirle de la manera más efectiva.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="nombre" className="block font-sans text-sm font-semibold text-[#000000] mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        required
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-[#e65649] focus:outline-none transition-colors font-sans"
                        placeholder="Juan Pérez"
                      />
                    </div>

                    <div>
                      <label htmlFor="empresa" className="block font-sans text-sm font-semibold text-[#000000] mb-2">
                        Empresa / Institución
                      </label>
                      <input
                        type="text"
                        id="empresa"
                        name="empresa"
                        value={formData.empresa}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-[#e65649] focus:outline-none transition-colors font-sans"
                        placeholder="Nombre de la empresa"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block font-sans text-sm font-semibold text-[#000000] mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-[#e65649] focus:outline-none transition-colors font-sans"
                        placeholder="contacto@empresa.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="telefono" className="block font-sans text-sm font-semibold text-[#000000] mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        required
                        value={formData.telefono}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-[#e65649] focus:outline-none transition-colors font-sans"
                        placeholder="+51 999 999 999"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="servicio" className="block font-sans text-sm font-semibold text-[#000000] mb-2">
                      Servicio de Interés *
                    </label>
                    <select
                      id="servicio"
                      name="servicio"
                      required
                      value={formData.servicio}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-[#e65649] focus:outline-none transition-colors font-sans"
                    >
                      <option value="">Seleccione un servicio</option>
                      <option value="derecho-administrativo">Derecho Administrativo</option>
                      <option value="defensa-funcionarios">Defensa de Funcionarios Públicos</option>
                      <option value="gestion-contractual">Gestión Contractual</option>
                      <option value="derecho-laboral">Derecho Laboral</option>
                      <option value="arbitraje">Arbitraje</option>
                      <option value="gestion-documental">Gestión Documental</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="mensaje" className="block font-sans text-sm font-semibold text-[#000000] mb-2">
                      Mensaje *
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      required
                      value={formData.mensaje}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-[#e65649] focus:outline-none transition-colors font-sans resize-none"
                      placeholder="Describa brevemente su consulta o caso..."
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 bg-[#e65649] text-white font-sans font-semibold tracking-wide hover:bg-[#8B1810] transition-colors group"
                    >
                      Enviar Consulta
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <p className="font-sans text-sm text-[#2D2D3D] font-normal">
                    * Campos obligatorios. Sus datos serán tratados de manera confidencial.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-0 bg-white">
        <div className="w-full h-[500px] relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.8!2d-76.9727!3d-12.0854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c7acff2003fb%3A0x2c9c9dd9edfc65f8!2sEdificio%20TIME!5e0!3m2!1ses!2spe!4v1234567890"
            width="100%"
            height="100%"
            style={{
              border: 0,
              filter: 'grayscale(20%) contrast(105%)'
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de Córdova & Pasco Asociados"
            className="absolute inset-0"
          />
        </div>
      </section>
    </div>
  );
}
