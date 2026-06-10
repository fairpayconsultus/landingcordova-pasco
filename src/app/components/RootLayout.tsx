import { Outlet, Link, useLocation } from "react-router";
import { Mail, Phone, MapPin, Clock, Scale, User, Linkedin, Facebook, Instagram, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import WhatsAppButton from "./WhatsAppButton";

const servicios = [
  'Derecho Administrativo',
  'Defensa de Funcionarios Públicos',
  'Derecho Laboral',
  'Disputas y Arbitrajes',
  'Gestión Contractual',
  'Gestión Legal y Documental',
  'Derecho Corporativo',
];

export function RootLayout() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Scroll hacia arriba cuando cambia la ruta
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Cerrar menú móvil cuando navega
    setIsMobileMenuOpen(false);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Función para manejar clic en navegación y hacer scroll hacia arriba
  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { path: "/", label: "Inicio" },
    { path: "/nosotros", label: "Nosotros" },
    { path: "/abogados", label: "Abogados" },
    { path: "/servicios", label: "Servicios" },
    { path: "/sectores", label: "Sectores" },
    { path: "/blog", label: "Blog" },
    { path: "/contacto", label: "Contacto" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <Link
              to="/"
              onClick={handleNavClick}
              className="flex items-center justify-center gap-3 group h-full"
            >
              <img
                src="/logo.png"
                alt="Córdova & Pasco logo"
                className="h-14 w-auto"
              />
              <div className="flex flex-col justify-center">
                <span className="font-display font-semibold text-[#000000] text-lg lg:text-xl leading-tight">
                  Córdova & Pasco
                </span>
                <span className="font-sans text-xs text-[#6B6B7B] tracking-wider uppercase">
                  Asociados
                </span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={handleNavClick}
                  className={`font-sans text-sm font-medium tracking-wide transition-colors relative group ${
                    location.pathname === link.path
                      ? "text-[#e65649]"
                      : "text-[#000000] hover:text-[#e65649]"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-[#e65649] transition-all ${
                      location.pathname === link.path
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#000000] hover:text-[#e65649] transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={handleNavClick}
                  className={`px-6 py-4 font-sans text-sm font-medium border-b border-gray-100 transition-colors ${
                    location.pathname === link.path
                      ? "text-[#e65649] bg-[#e65649]/5"
                      : "text-[#000000] hover:text-[#e65649] hover:bg-[#e65649]/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* CTA Section */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a0f0a 50%, #3d2620 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
            <path d="M0,0 Q300,100 600,0 T1200,0 L1200,200 L0,200 Z" stroke="#e65649" strokeWidth="1" fill="none" opacity="0.3" />
            <path d="M100,0 Q400,100 700,0 T1300,0" stroke="#e65649" strokeWidth="1" fill="none" opacity="0.2" />
            <path d="M-100,0 Q200,100 500,0 T1100,0" stroke="#e65649" strokeWidth="1" fill="none" opacity="0.15" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-start gap-6 flex-1">
              <div className="w-12 h-12 text-[#e65649] flex-shrink-0">
                <Scale className="w-full h-full" />
              </div>
              <div>
                <h3 className="font-display text-xl lg:text-2xl font-bold text-white mb-2">
                  ¿Buscas <span className="text-[#e65649]">respaldo legal</span> para tu organización?
                </h3>
                <p className="font-sans text-sm lg:text-base text-gray-400 font-light">
                  Nuestro equipo está listo para asesorarte con soluciones legales estratégicas.
                </p>
              </div>
            </div>
            <Link
              to="/contacto"
              onClick={handleNavClick}
              className="flex items-center gap-2 px-6 lg:px-8 py-3 border-2 border-[#e65649] text-[#e65649] font-sans font-semibold hover:bg-[#e65649] hover:text-white transition-colors flex-shrink-0 whitespace-nowrap"
            >
              CONTÁCTANOS
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#000000] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
          {/* Main Grid - Four Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">

            {/* Column 1 - Firma */}
            <div>
              <h2 className="font-display font-bold text-white text-xl leading-tight mb-1">
                Córdova & Pasco
              </h2>
              <p className="font-sans text-xs text-gray-500 tracking-wider uppercase mb-4 pb-4 border-b border-white/10">
                Asociados
              </p>
              <p className="font-sans text-gray-400 text-sm leading-relaxed font-light mb-6">
                Rigor técnico, solidez jurídica y visión estratégica al servicio de empresas e instituciones del más alto nivel.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-[#e65649] hover:text-[#e65649] transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-[#e65649] hover:text-[#e65649] transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-[#e65649] hover:text-[#e65649] transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Column 2 - Contacto */}
            <div>
              <h3 className="font-sans font-semibold text-white text-sm mb-6 tracking-wide uppercase">
                Contacto
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-[#e65649] flex-shrink-0 mt-0.5" />
                  <div className="font-sans text-sm text-gray-300 font-light leading-relaxed">
                    Jr. Cruz del sur N°140,<br />
                    Of. 405 - Santiago de Surco
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-[#e65649] flex-shrink-0 mt-0.5" />
                  <span className="font-sans text-sm text-gray-300 font-light">983 861 874</span>
                </div>
                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-[#e65649] flex-shrink-0 mt-0.5" />
                  <span className="font-sans text-sm text-gray-300 font-light">contacto@cp-asociados.pe</span>
                </div>
              </div>
            </div>

            {/* Column 3 - Áreas de Práctica */}
            <div>
              <h3 className="font-sans font-semibold text-white text-sm mb-6 tracking-wide uppercase">
                Áreas de Práctica
              </h3>
              <ul className="space-y-3">
                {servicios.map((servicio) => (
                  <li key={servicio}>
                    <Link
                      to="/servicios"
                      onClick={handleNavClick}
                      className="font-sans text-sm text-gray-400 font-light hover:text-[#e65649] transition-colors flex items-center gap-2"
                    >
                      <span className="text-[#e65649]">›</span> {servicio}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 - CTA */}
            <div className="flex flex-col">
              <div className="flex gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#e65649] flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-3 leading-snug">
                ¿Necesitas asesoría legal especializada?
              </h3>
              <p className="font-sans text-sm text-gray-400 font-light mb-6">
                Agenda una consulta con nuestro equipo.
              </p>
              <Link
                to="/contacto"
                onClick={handleNavClick}
                className="flex items-center gap-2 px-4 py-2 border-2 border-[#e65649] text-[#e65649] font-sans font-semibold hover:bg-[#e65649] hover:text-white transition-colors w-fit text-sm"
              >
                AGENDAR CONSULTA
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 font-sans text-xs text-gray-500 font-light">
              <p>© 2026 Córdova & Pasco Asociados. Todos los derechos reservados.</p>
              <div className="flex gap-4">
                <Link to="#" onClick={handleNavClick} className="hover:text-white transition-colors">Política de Privacidad</Link>
                <span>|</span>
                <Link to="#" onClick={handleNavClick} className="hover:text-white transition-colors">Términos y Condiciones</Link>
              </div>
              <p>
                En alianza con <span className="text-white font-medium">Consultus Group</span>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
