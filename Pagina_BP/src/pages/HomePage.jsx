
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShoppingBag, Pill, Users, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card className="h-full text-center glassmorphism-card p-2 hover:shadow-2xl transition-shadow">
      <CardHeader>
        <div className="mx-auto bg-gradient-to-br from-primary to-secondary text-white rounded-full p-4 w-fit">
          {React.createElement(icon, { size: 32 })}
        </div>
        <CardTitle className="mt-4 text-xl text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-foreground/80">{description}</CardDescription>
      </CardContent>
    </Card>
  </motion.div>
);

const HomePage = () => {
  return (
    <div className="space-y-16">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative text-center py-20 md:py-32 rounded-xl overflow-hidden bg-gradient-to-br from-primary/80 via-secondary/80 to-accent/80"
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div className="relative z-10 container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Bienvenido a <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">Botica Salud</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg md:text-xl text-primary-foreground mb-10 max-w-2xl mx-auto"
          >
            Tu bienestar es nuestra pasión. Encuentra todo lo que necesitas para cuidar de ti y tu familia.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link to="/products">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 rounded-full shadow-lg transform hover:scale-105 transition-transform">
                Explorar Productos <ShoppingBag className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold gradient-text">¿Por qué elegirnos?</h2>
          <p className="text-muted-foreground mt-2">Descubre los beneficios de confiar en Botica Salud.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Pill}
            title="Amplia Gama de Productos"
            description="Desde medicamentos recetados hasta productos de cuidado personal y vitaminas."
            delay={0.1}
          />
          <FeatureCard
            icon={Users}
            title="Atención Personalizada"
            description="Nuestro equipo de farmacéuticos expertos está listo para asesorarte."
            delay={0.2}
          />
          <FeatureCard
            icon={Zap}
            title="Servicio Rápido y Confiable"
            description="Procesamos tus pedidos con eficiencia para que recibas lo que necesitas a tiempo."
            delay={0.3}
          />
        </div>
      </section>
      
      <section className="py-16 bg-muted rounded-xl">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">Anuncios Destacados</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="glassmorphism-card p-6"
            >
              <img  alt="Promoción de vitaminas" className="rounded-lg mb-4 w-full h-64 object-cover" src="https://images.unsplash.com/photo-1701201879927-0db1d1a36fe6" />
              <h3 className="text-xl font-semibold text-foreground mb-2">¡Refuerza tus defensas!</h3>
              <p className="text-foreground/80 mb-4">Descuentos especiales en toda nuestra línea de vitaminas y suplementos.</p>
              <Button variant="secondary">Ver Ofertas</Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="glassmorphism-card p-6"
            >
              <img  alt="Productos de cuidado de la piel" className="rounded-lg mb-4 w-full h-64 object-cover" src="https://images.unsplash.com/photo-1655865556841-f394b54b8ec4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Cuidado de la Piel Premium</h3>
              <p className="text-foreground/80 mb-4">Descubre nuestra selección de productos dermatológicos para una piel radiante.</p>
              <Button variant="secondary">Descubrir</Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold gradient-text mb-4">Categorías Populares</h2>
          <p className="text-muted-foreground mb-8">Encuentra rápidamente lo que buscas.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {['Medicamentos', 'Vitaminas', 'Cuidado Personal', 'Bebés y Mamás', 'Primeros Auxilios'].map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link to={`/products?category=${category.toLowerCase().replace(' ', '-')}`}>
                  <Card className="hover:shadow-xl transition-shadow cursor-pointer bg-gradient-to-br from-primary/10 to-secondary/10">
                    <CardContent className="p-6">
                      <p className="font-semibold text-primary">{category}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
  