import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LogIn, UserPlus } from 'lucide-react';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:4002/api/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('pharmaUserToken', token);
      localStorage.setItem('pharmaUser', JSON.stringify(user));

      toast({
        title: "Inicio de Sesión Exitoso",
        description: `Bienvenido de nuevo, ${user.full_name || user.email}.`,
        variant: "default",
      });

      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Error de Autenticación",
        description: error.response?.data?.error || "Correo electrónico o contraseña incorrectos.",
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
              <LogIn size={32} />
            </div>
            <CardTitle className="text-3xl font-bold gradient-text">Iniciar Sesión</CardTitle>
            <CardDescription className="text-foreground/80">Accede a tu cuenta para continuar.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/80"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/80"
                />
              </div>
              <Button type="submit" className="w-full text-lg py-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground" disabled={isSubmitting}>
                {isSubmitting ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <Link to="/forgot-password">
              <Button variant="link" className="text-sm text-primary">¿Olvidaste tu contraseña?</Button>
            </Link>
            <p className="text-sm text-center text-foreground/80">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                Regístrate aquí <UserPlus className="inline h-4 w-4" />
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;