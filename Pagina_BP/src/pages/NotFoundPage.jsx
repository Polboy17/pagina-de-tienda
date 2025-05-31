
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] text-center p-4 bg-gradient-to-br from-red-500/10 via-orange-500/10 to-yellow-500/10">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: [0, 0.71, 0.2, 1.01]
        }}
        className="p-10 rounded-xl shadow-2xl bg-background/80 backdrop-blur-md max-w-lg w-full"
      >
        <AlertTriangle className="mx-auto h-24 w-24 text-destructive mb-6 animate-pulse" />
        <h1 className="text-6xl font-bold text-destructive mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-foreground mb-3">¡Ups! Página No Encontrada</h2>
        <p className="text-muted-foreground mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link to="/">
          <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground text-lg">
            Volver al Inicio
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
  