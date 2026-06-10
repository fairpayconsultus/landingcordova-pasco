import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mb-3 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg"
          >
            ¿Necesitas ayuda? Chatea con nosotros
            <div className="absolute top-full right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-800"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href="https://wa.me/51983861874?text=Gracias%20por%20contactar%20a%20C%C3%B3rdova%20%26%20Pasco%20Asociados.%0A%0ANuestro%20compromiso%20es%20brindarle%20asesor%C3%ADa%20legal%20estrat%C3%A9gica%2C%20eficiente%20y%20personalizada.%20Su%20mensaje%20ha%20sido%20recibido%20correctamente%20y%20ser%C3%A1%20atendido%20por%20uno%20de%20nuestros%20abogados%20a%20la%20brevedad.%0A%0AAgradecemos%20la%20oportunidad%20de%20acompa%C3%B1arlo%20en%20la%20protecci%C3%B3n%20de%20sus%20intereses."
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <MessageCircle className="w-7 h-7" strokeWidth={2.5} />
      </motion.a>
    </div>
  );
}
