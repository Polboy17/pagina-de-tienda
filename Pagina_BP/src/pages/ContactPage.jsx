import React from 'react';
import { Link } from 'react-router-dom'; // Si usas React Router

const ContactPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Contacto</h1>
      <p className="text-lg">
        Puedes contactarnos a través de los siguientes medios:
      </p>
      <ul className="list-disc list-inside mt-2">
        <li>Teléfono: +51 981 560 339</li>
        <li>Email: comercial_cinco_estrellas@gmail.com</li>
        <li>Dirección: Jr. Montevideo 883, Stand: 158</li>
      </ul>
      <p className="mt-4">
        También puedes enviarnos un mensaje a través de nuestro{' '}
        <Link to="/formulario" className="text-blue-600 hover:underline">
          formulario de contacto en línea
        </Link>.
      </p>
    </div>
  );
};

export default ContactPage;
