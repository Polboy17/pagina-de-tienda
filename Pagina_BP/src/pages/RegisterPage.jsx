import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { UserPlus, LogIn } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Error de Contraseña",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
            // avatar_url: '', // Can be added later or set a default
          }
        }
      });

      if (error) {
        throw error;
      }
      
      if (data.user && data.user.identities && data.user.identities.length === 0) {
         toast({
          title: "Confirmación Requerida",
          description: "El usuario ya existe pero necesita confirmar su correo. Revisa tu bandeja de entrada.",
          variant: "default",
        });
        navigate('/login');
      } else if (data.user) {
        toast({
          title: "Registro Exitoso",
          description: "¡Bienvenido! Por favor, revisa tu correo para confirmar tu cuenta.",
          variant: "default",
        });
        navigate('/login'); 
      } else {
         toast({
          title: "Error de Registro",
          description: "No se pudo crear la cuenta. Inténtalo de nuevo.",
          variant: "destructive",
        });
      }

    } catch (error) {
      toast({
        title: "Error de Registro",
        description: error.message || "Ocurrió un error al registrarse.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl glassmorphism-card">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-br from-primary to-secondary text-white rounded-full p-3 w-fit mb-4">
              <UserPlus size={32} />
            </div>
            <CardTitle className="text-3xl font-bold gradient-text">Crear Cuenta</CardTitle>
            <CardDescription className="text-foreground/80">Únete a Comercial Cinco Estrellas hoy mismo.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-foreground">Nombre Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Tu Nombre Completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="bg-background/80 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-foreground">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/80 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-foreground">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-background/80 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-foreground">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-background/80 mt-1"
                />
              </div>
              <Button type="submit" className="w-full text-lg py-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground" disabled={isSubmitting}>
                {isSubmitting ? 'Registrando...' : 'Registrarse'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center">
            <p className="text-sm text-center text-foreground/80">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Inicia sesión aquí <LogIn className="inline h-4 w-4" />
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;