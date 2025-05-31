import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Search, PlusCircle } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EditUserModal from './EditUserModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:4002/api/users');
      setUsers(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('pharmaUser'));
      if (!currentUser) {
        toast({
          title: "Error",
          description: "No se pudo verificar el usuario actual.",
          variant: "destructive"
        });
        return;
      }
      if (userId === currentUser.id && newRole !== 'admin') {
        toast({
          title: "Acción no permitida",
          description: "No puedes cambiar tu propio rol a no administrador.",
          variant: "destructive"
        });
        fetchUsers();
        return;
      }

      await axios.put(`http://localhost:4002/api/users/${userId}`, { role: newRole });
      toast({ title: "Éxito", description: "Rol de usuario actualizado." });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol: " + error.message,
        variant: "destructive"
      });
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (updatedUser) => {
    try {
      if (editingUser) {
        // Si no se envía contraseña, no incluirla en la actualización para no sobrescribir
        const dataToSend = { ...updatedUser };
        if (!updatedUser.password) {
          delete dataToSend.password;
        }
        await axios.put(`http://localhost:4002/api/users/${editingUser.id}`, dataToSend);
        toast({ title: "Éxito", description: "Usuario actualizado correctamente." });
      } else {
        await axios.post('http://localhost:4002/api/users', updatedUser);
        toast({ title: "Éxito", description: "Usuario creado correctamente." });
      }
      setIsEditModalOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el usuario: " + error.message,
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user =>
    (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading && users.length === 0)
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <LoadingSpinner size="lg" />
      </div>
    );

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Gestión de Usuarios</h2>
        <Button onClick={() => { setEditingUser(null); setIsEditModalOpen(true); }} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground">
          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Usuario
        </Button>
      </div>
      <div className="mb-4">
        <div className="relative max-w-sm">
          <Input
            type="text"
            placeholder="Buscar usuarios por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-background/80 pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nombre Completo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Última Actualización</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {isLoading && users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8">
                      <LoadingSpinner />
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{user.full_name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="p-1 border rounded-md bg-background/70 text-sm"
                        >
                          <option value="user">Usuario</option>
                          <option value="admin">Administrador</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {new Date(user.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-gray-700"
                          title="Editar usuario"
                          onClick={() => handleEditClick(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          title="Eliminar usuario"
                          onClick={async () => {
                            if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
                              try {
                                await axios.delete(`http://localhost:4002/api/users/${user.id}`);
                                toast({ title: "Éxito", description: "Usuario eliminado correctamente." });
                                fetchUsers();
                              } catch (error) {
                                toast({
                                  title: "Error",
                                  description: "No se pudo eliminar el usuario: " + error.message,
                                  variant: "destructive"
                                });
                              }
                            }
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-muted-foreground">
                      No se encontraron usuarios.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {isEditModalOpen && (
        <EditUserModal
          user={editingUser}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
};

export default UserManagement;

