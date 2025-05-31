import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { PlusCircle, Edit3, Trash2, Search } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const ProductForm = ({ formData, onInputChange, categories, isEditing, onImageChange, uploading }) => {
  return (
    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
      {['name', 'sku', 'description', 'price', 'stock_quantity', 'image_url'].map(field => (
        <div key={field} className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={field} className="text-right text-foreground col-span-1">
            {field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            {(field === 'name' || field === 'price' || field === 'stock_quantity' || field === 'category_id') && <span className="text-destructive">*</span>}
          </Label>
          {field === 'description' ? (
            <textarea id={field} name={field} value={formData[field]} onChange={onInputChange} className="col-span-3 p-2 border rounded-md bg-background/70 h-24" />
          ) : field === 'image_url' ? (
            <div className="col-span-3 flex flex-col gap-2">
              <Input id={field} name={field} type="text" value={formData[field]} onChange={onInputChange} placeholder="URL de la imagen" className="bg-background/70" />
              <input type="file" accept="image/*" onChange={onImageChange} />
              {uploading && <div className="text-sm text-muted-foreground">Subiendo imagen...</div>}
              {formData[field] && <img src={formData[field]} alt="Preview" className="max-h-40 mt-2 rounded-md" />}
            </div>
          ) : (
            <Input id={field} name={field} type={field === 'price' || field === 'stock_quantity' ? 'number' : 'text'} value={formData[field]} onChange={onInputChange} className="col-span-3 bg-background/70" />
          )}
        </div>
      ))}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category_id" className="text-right text-foreground col-span-1">Categoría<span className="text-destructive">*</span></Label>
        <select id="category_id" name="category_id" value={formData.category_id} onChange={onInputChange} className="col-span-3 p-2 border rounded-md bg-background/70">
          <option value="">Selecciona una categoría</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
      </div>
    </div>
  );
};

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [productFormData, setProductFormData] = useState({
    name: '', description: '', price: '', category_id: '', stock_quantity: '', image_url: '', sku: ''
  });
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:4002/api/products');
      const data = response.data;
      setProducts(data.map(p => ({...p, category_name: p.category?.name || 'N/A'})));
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar los productos: " + error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:4002/api/categories');
      setCategories(response.data);
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar las categorías: " + error.message, variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await axios.post('http://localhost:4002/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProductFormData(prev => ({ ...prev, image_url: response.data.url }));
      toast({ title: "Éxito", description: "Imagen subida correctamente." });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo subir la imagen: " + error.message, variant: "destructive" });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!productFormData.name || !productFormData.price || !productFormData.category_id || productFormData.stock_quantity === '') {
      toast({ title: "Campos requeridos", description: "Nombre, precio, categoría y stock son obligatorios.", variant: "destructive"});
      return;
    }
    try {
      const upsertData = {
        name: productFormData.name,
        description: productFormData.description,
        price: parseFloat(productFormData.price),
        category_id: productFormData.category_id,
        stock_quantity: parseInt(productFormData.stock_quantity, 10),
        image_url: productFormData.image_url,
        sku: productFormData.sku,
      };

      let response;
      if (editingProduct) {
        response = await axios.put(`http://localhost:4002/api/products/${editingProduct.id}`, upsertData);
      } else {
        response = await axios.post('http://localhost:4002/api/products', upsertData);
      }
      
      toast({ title: "Éxito", description: `Producto ${editingProduct ? 'actualizado' : 'creado'} correctamente.` });
      setShowProductDialog(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      toast({ title: "Error", description: "No se pudo guardar el producto: " + error.message, variant: "destructive" });
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      category_id: product.category_id || '',
      stock_quantity: product.stock_quantity?.toString() || '',
      image_url: product.image_url || '',
      sku: product.sku || ''
    });
    setShowProductDialog(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) return;
    try {
      // Remove the call to inventory delete since no inventory model or endpoint exists
      await axios.delete(`http://localhost:4002/api/products/${productId}`);
      toast({ title: "Éxito", description: "Producto eliminado correctamente." });
      fetchProducts();
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar el producto: " + error.message, variant: "destructive" });
    }
  };


  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading && products.length === 0) return <div className="flex justify-center items-center min-h-[300px]"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Gestión de Productos</h2>
        <Button onClick={() => { setEditingProduct(null); setProductFormData({ name: '', description: '', price: '', category_id: '', stock_quantity: '', image_url: '', sku: '' }); setShowProductDialog(true); }} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground">
          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Producto
        </Button>
      </div>
      <div className="mb-4">
        <div className="relative max-w-sm">
          <Input 
            type="text"
            placeholder="Buscar productos por nombre o SKU..."
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {isLoading && products.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-8"><LoadingSpinner /></td></tr>
                ) : filteredProducts.length > 0 ? filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{product.sku || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{product.category_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">S/.{parseFloat(product.price).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{product.stock_quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)} className="text-blue-500 hover:text-blue-700"><Edit3 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-700 ml-2"><Trash2 className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="text-center py-8 text-muted-foreground">No se encontraron productos.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="sm:max-w-lg glassmorphism-card">
          <DialogHeader>
            <DialogTitle className="gradient-text text-2xl">{editingProduct ? 'Editar Producto' : 'Añadir Nuevo Producto'}</DialogTitle>
            <DialogDescription>Completa los detalles del producto.</DialogDescription>
          </DialogHeader>
          <ProductForm formData={productFormData} onInputChange={handleProductInputChange} categories={categories} isEditing={!!editingProduct} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProductDialog(false)}>Cancelar</Button>
            <Button onClick={handleSaveProduct} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground">Guardar Producto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;