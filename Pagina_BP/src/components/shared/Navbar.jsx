
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { NAV_LINKS } from '@/lib/constants';
import { Stethoscope, ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCart } from '@/contexts/CartContext';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();

  useEffect(() => {
    const token = localStorage.getItem('pharmaUserToken');
    const userData = localStorage.getItem('pharmaUser');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }

    // Listen to localStorage changes to update user info dynamically
    const handleStorageChange = (event) => {
      if (event.key === 'pharmaUser') {
        const newUserData = event.newValue ? JSON.parse(event.newValue) : null;
        if (newUserData) {
          setIsLoggedIn(true);
          setUser(newUserData);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('pharmaUserToken');
    localStorage.removeItem('pharmaUser');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="sticky top-0 z-50 bg-gradient-to-r from-primary to-secondary shadow-lg"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2 text-primary-foreground hover:opacity-90 transition-opacity">
            <Stethoscope size={36} />
            <span className="text-2xl font-bold">Botica Salud</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-primary-foreground hover:text-accent transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn && user?.role === 'admin' && (
               <Link
                to="/admin"
                className="text-primary-foreground hover:text-accent transition-colors font-medium"
              >
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20" onClick={() => navigate('/cart')} aria-label="Carrito de compras">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {cartCount}
                </span>
              )}
            </Button>
            {isLoggedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary-foreground">
                       <AvatarImage src={user.avatarUrl || ""} alt={user.name || "Usuario"} />
                       <AvatarFallback className="bg-accent text-accent-foreground">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name || "Usuario"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                   {user.role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Panel Admin</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-primary-foreground hover:bg-white/20">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-primary/90 backdrop-blur-sm pb-4"
        >
          <div className="flex flex-col items-center space-y-4 pt-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-primary-foreground hover:text-accent transition-colors font-medium text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn && user?.role === 'admin' && (
               <Link
                to="/admin"
                className="text-primary-foreground hover:text-accent transition-colors font-medium text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
  