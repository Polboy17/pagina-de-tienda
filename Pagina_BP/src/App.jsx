import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { supabase } from '@/lib/supabaseClient';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

const HomePage = lazy(() => import('@/pages/HomePage'));
const ProductsPage = lazy(() => import('@/pages/ProductsPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage')); // Placeholder for now
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userRole, setUserRole] = React.useState(null);

  React.useEffect(() => {
    const checkUser = () => {
      const user = JSON.parse(localStorage.getItem('pharmaUser'));
      if (user && user.role) {
        setUserRole(user.role);
      }
      setIsLoading(false);
    };
    checkUser();
  }, []);

  if (isLoading) {
    return <div className="flex h-screen w-screen items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  if (userRole !== 'admin') {
    return <NotFoundPage />;
  }
  return children;
};


function App() {
  const location = useLocation();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.access_token) {
        localStorage.setItem('pharmaUserToken', session.access_token);
      } else {
        localStorage.removeItem('pharmaUserToken');
        localStorage.removeItem('pharmaUser');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.access_token) {
          localStorage.setItem('pharmaUserToken', session.access_token);
          if (session.user) {
            const { data: userProfile, error: profileError } = await supabase
              .from('user_profiles')
              .select('full_name, avatar_url, role')
              .eq('id', session.user.id)
              .single();
            if (userProfile) {
              localStorage.setItem('pharmaUser', JSON.stringify({ 
                id: session.user.id, 
                email: session.user.email, 
                name: userProfile.full_name,
                avatarUrl: userProfile.avatar_url,
                role: userProfile.role 
              }));
            } else {
              localStorage.setItem('pharmaUser', JSON.stringify({ 
                id: session.user.id, 
                email: session.user.email,
                role: 'user' // Default role if profile fetch fails
              }));
            }
          }
        } else {
          localStorage.removeItem('pharmaUserToken');
          localStorage.removeItem('pharmaUser');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center"><LoadingSpinner size="lg" /></div>}>
          <Routes location={location} key={location.pathname}>
            <Route element={<MainLayout />}>
              <Route index path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} /> 
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </AnimatePresence>
    </ErrorBoundary>
  );
}

export default App;
