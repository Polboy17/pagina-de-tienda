import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Package, BarChart2, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ProductManagement from '@/components/admin/ProductManagement';
import UserManagement from '@/components/admin/UserManagement';

const StatCard = ({ title, value, icon, color, isLoading }) => (
  <Card className={`bg-gradient-to-br ${color} text-white shadow-lg`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {React.createElement(icon, { className: "h-5 w-5 opacity-80" })}
    </CardHeader>
    <CardContent>
      {isLoading ? <LoadingSpinner size="sm" className="text-white"/> : <div className="text-3xl font-bold">{value}</div>}
    </CardContent>
  </Card>
);

const PlaceholderContent = ({ title }) => (
  <div className="min-h-[400px] flex flex-col items-center justify-center bg-muted/20 rounded-lg p-8 animate-fadeIn">
    {title === "Pedidos" && <BarChart2 size={64} className="text-primary opacity-50 mb-6" />}
    {title === "Configuración" && <Settings size={64} className="text-primary opacity-50 mb-6" />}
    <h2 className="text-2xl font-semibold text-foreground mb-3">Gestión de {title}</h2>
    <p className="text-muted-foreground text-center mb-6">
      Esta sección está en desarrollo. Aquí podrás administrar {title.toLowerCase()} de tu botica.
    </p>
  </div>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ users: 0, products: 0, categories: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoadingStats(true);
      try {
        const response = await fetch('http://localhost:4002/api/stats');
        if (!response.ok) {
          throw new Error('Error al cargar estadísticas');
        }
        const data = await response.json();
        setStats({ users: data.users, products: data.products, categories: data.categories });
      } catch (error) {
        toast({ title: "Error", description: "No se pudieron cargar las estadísticas: " + error.message, variant: "destructive" });
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchStats();
  }, [toast]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text">Panel de Administración</h1>
        <p className="text-muted-foreground">Gestiona tu botica de manera eficiente.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Total Usuarios" value={stats.users} icon={Users} color="from-blue-500 to-blue-700" isLoading={isLoadingStats} />
        <StatCard title="Productos Activos" value={stats.products} icon={Package} color="from-green-500 to-green-700" isLoading={isLoadingStats} />
        <StatCard title="Categorías" value={stats.categories} icon={BarChart2} color="from-purple-500 to-purple-700" isLoading={isLoadingStats} />
        <StatCard title="Pedidos (Próximamente)" value="0" icon={Settings} color="from-orange-500 to-orange-700" isLoading={true} />
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 bg-primary/10">
          <TabsTrigger value="products" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Package className="mr-2 h-4 w-4 inline-block"/> Productos</TabsTrigger>
          <TabsTrigger value="users" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Users className="mr-2 h-4 w-4 inline-block"/> Usuarios</TabsTrigger>
          <TabsTrigger value="orders" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><BarChart2 className="mr-2 h-4 w-4 inline-block"/> Pedidos</TabsTrigger>
          <TabsTrigger value="settings" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Settings className="mr-2 h-4 w-4 inline-block"/> Configuración</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductManagement />
        </TabsContent>
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        <TabsContent value="orders">
          <PlaceholderContent title="Pedidos" />
        </TabsContent>
        <TabsContent value="settings">
          <PlaceholderContent title="Configuración" />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AdminDashboardPage;
