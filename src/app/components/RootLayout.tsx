import { Outlet, Link, useLocation } from "react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import WhatsAppButton from "./WhatsAppButton";

export function RootLayout() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Scroll hacia arriba cuando cambia la ruta
    window.scrollTo({ top: 0, behavior: "smooth" });

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
            <button className="md:hidden p-2 text-[#000000]">
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
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#000000] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="flex flex-col">
                  <span className="font-display font-semibold text-white text-xl leading-tight">
                    Córdova & Pasco
                  </span>
                  <span className="font-sans text-xs text-gray-400 tracking-wider uppercase">
                    Asociados
                  </span>
                </div>
              </div>
              <p className="font-sans text-gray-300 text-sm leading-relaxed max-w-md font-light">
                Rigor técnico, solidez jurídica y visión estratégica al servicio
                de empresas e instituciones del más alto nivel.
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-sans font-semibold text-white mb-4 tracking-wide">
                Contacto
              </h4>
              <div className="space-y-3 font-sans text-sm text-gray-300 font-light">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-[#e65649] flex-shrink-0" />
                  <span>
                    Av. Mariscal la mar 326,
                    <br />
                    Of. 216, Miraflores
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#e65649] flex-shrink-0" />
                  <span>966170074</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#e65649] flex-shrink-0" />
                  <span>contacto@cp-asociados.pe</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-sans font-semibold text-white mb-4 tracking-wide">
                Enlaces
              </h4>
              <ul className="space-y-2 font-sans text-sm text-gray-300 font-light">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      onClick={handleNavClick}
                      className="hover:text-[#e65649] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 font-sans text-sm text-gray-400">
              <p className="font-light">
                © 2026 Córdova & Pasco Asociados. Todos los derechos reservados.
              </p>
              <p className="font-light">
                En alianza con{" "}
                <span className="text-white font-medium">Consultus Group</span>
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
