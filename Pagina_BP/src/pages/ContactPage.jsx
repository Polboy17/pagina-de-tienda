import React from 'react';

const ContactPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Contacto</h1>
      <p className="text-lg">
        Puedes contactarnos a través de los siguientes medios:
      </p>
      <ul className="list-disc list-inside mt-2">
        <li>Teléfono: +51 123 456 789</li>
        <li>Email: contacto@boticasalud.com</li>
        <li>Dirección: Av. Salud 123, Ciudad</li>
      </ul>
      <p className="mt-4">
        También puedes enviarnos un mensaje a través de nuestro formulario de contacto en línea.
      </p>
    </div>
  );
};

export default ContactPage;
