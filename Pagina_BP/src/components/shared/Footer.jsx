
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Stethoscope } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 text-white mb-4">
              
              <span className="text-xl font-bold">Comercial Cinco Estrellas</span>
            </Link>
            <p className="text-sm">
              Tu comodidad y bienestar son nuestra prioridad. Ofrecemos ropa interior de calidad pensada para ti.
            </p>
          </div>
          <div>
            <p className="font-semibold text-white mb-3">Enlaces Rápidos</p>
            <ul className="space-y-2">
              <li><Link to="/products" className="hover:text-primary transition-colors">Productos</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">Sobre Nosotros</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contacto</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">Preguntas Frecuentes</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white mb-3">Legal</p>
            <ul className="space-y-2">
              <li><Link to="/terms" className="hover:text-primary transition-colors">Términos y Condiciones</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Política de Privacidad</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white mb-3">Síguenos</p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="hover:text-primary transition-colors"><Facebook size={24} /></a>
              <a href="#" aria-label="Instagram" className="hover:text-primary transition-colors"><Instagram size={24} /></a>
              <a href="#" aria-label="Twitter" className="hover:text-primary transition-colors"><Twitter size={24} /></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-primary transition-colors"><Linkedin size={24} /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; {currentYear} Comercial Cinco Estrellas. Todos los derechos reservados.</p>
          <p></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
  