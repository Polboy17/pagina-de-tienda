import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setEmail(user.email || '');
      setRole(user.role || 'user');
      setAvatarUrl(user.avatar_url || '');
      setPassword('');
      setConfirmPassword('');
      setPasswordError('');
    } else {
      setFullName('');
      setEmail('');
      setRole('user');
      setAvatarUrl('');
      setPassword('');
      setConfirmPassword('');
      setPasswordError('');
    }
  }, [user]);

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
      setAvatarUrl(response.data.url);
      toast({ title: 'Imagen subida', description: 'Avatar actualizado correctamente.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Error al subir la imagen: ' + error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    setPasswordError('');
    const userData = { full_name: fullName, email, role, avatar_url: avatarUrl };
    if (password) {
      userData.password = password;
    }
    onSave(userData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? 'Editar Usuario' : 'Crear Usuario'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Nombre Completo</label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Rol</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border rounded-md bg-background/70 text-sm"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Avatar URL</label>
            <Input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="URL de tu avatar"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Subir Avatar</label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Contraseña {user ? '(dejar en blanco para no cambiar)' : ''}</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={user ? '••••••••' : ''}
              {...(!user && { required: true })}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Confirmar Contraseña</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={user ? '••••••••' : ''}
              {...(!user && { required: true })}
            />
            {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={uploading}>Guardar</Button>
            <Button variant="outline" onClick={onClose} type="button" disabled={uploading}>Cancelar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
