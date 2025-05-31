import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    avatar_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('pharmaUser'));
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        // Fetch profile data from backend API
        const response = await fetch(`http://localhost:4002/api/users/${user.id}`);
        if (!response.ok) {
          throw new Error('Error al obtener el perfil');
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [toast]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await axios.post('http://localhost:4002/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile((prev) => ({ ...prev, avatar_url: response.data.url }));
      toast({ title: 'Imagen subida', description: 'Avatar actualizado correctamente.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Error al subir la imagen: ' + error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('pharmaUser'));
    if (!user) {
      toast({ title: 'Error', description: 'Usuario no autenticado', variant: 'destructive' });
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`http://localhost:4002/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
        }),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar el perfil');
      }
      toast({ title: 'Éxito', description: 'Perfil actualizado correctamente', variant: 'default' });
      // Actualizar localStorage con el nuevo avatar_url y nombre
      const storedUser = JSON.parse(localStorage.getItem('pharmaUser'));
      if (storedUser) {
        storedUser.avatarUrl = profile.avatar_url;
        storedUser.name = profile.full_name;
        localStorage.setItem('pharmaUser', JSON.stringify(storedUser));
      }
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Mi Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <form className="space-y-6" onSubmit={handleSave}>
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                  Nombre Completo
                </label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={profile.full_name || ''}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo Electrónico
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email || ''}
                  disabled
                />
              </div>
              <div>
                <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700">
                  URL de Avatar
                </label>
                <Input
                  id="avatar_url"
                  name="avatar_url"
                  type="text"
                  value={profile.avatar_url || ''}
                  onChange={handleChange}
                  placeholder="URL de tu avatar"
                />
              </div>
              <div>
                <label htmlFor="avatar_upload" className="block text-sm font-medium text-gray-700">
                  Subir Avatar
                </label>
                <Input
                  id="avatar_upload"
                  name="avatar_upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </div>
              <Button type="submit" disabled={loading || uploading} className="w-full">
                Guardar Cambios
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
