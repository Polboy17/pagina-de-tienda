import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, e) => {
    const quantity = parseInt(e.target.value, 10);
    if (!isNaN(quantity) && quantity > 0) {
      updateQuantity(productId, quantity);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.quantity * parseFloat(item.price), 0);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Carrito de Compras</h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-lg mb-4">Tu carrito está vacío.</p>
          <Button onClick={() => navigate('/products')}>Ver Productos</Button>
        </div>
      ) : (
        <>
          <table className="w-full border-collapse mb-6">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-2">Producto</th>
                <th className="text-left py-2">Precio</th>
                <th className="text-left py-2">Cantidad</th>
                <th className="text-left py-2">Subtotal</th>
                <th className="text-left py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2">S/.{parseFloat(item.price).toFixed(2)}</td>
                  <td className="py-2">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e)}
                      className="w-20"
                    />
                  </td>
                  <td className="py-2">S/.{(item.quantity * parseFloat(item.price)).toFixed(2)}</td>
                  <td className="py-2">
                    <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.id)} aria-label="Eliminar producto">
                      <Trash size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center">
            <p className="text-xl font-semibold">Total: S/.{totalPrice.toFixed(2)}</p>
            <div className="space-x-4">
              <Button variant="outline" onClick={clearCart}>Vaciar Carrito</Button>
              <Button onClick={() => alert('Funcionalidad de pago no implementada aún')}>Proceder al Pago</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
