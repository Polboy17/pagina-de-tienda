import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

const StarRating = ({ rating }) => {
  const numRating = parseFloat(rating);
  if (isNaN(numRating) || numRating < 0 || numRating > 5) return null;

  const fullStars = Math.floor(numRating);
  const halfStar = numRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`} className="text-yellow-400">★</span>)}
      {halfStar && <span className="text-yellow-400">☆</span>}
      {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="text-gray-300">☆</span>)}
      <span className="ml-2 text-sm text-muted-foreground">({numRating.toFixed(1)})</span>
    </div>
  );
};

const ProductCard = ({ product }) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
    className="h-full"
  >
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col glassmorphism-card">
      <CardHeader className="p-0 relative">
        <img
          src={
            product.image_url
              ? product.image_url.startsWith('/uploads')
                ? `http://localhost:4002${product.image_url}?t=${new Date(product.updatedAt).getTime()}`
                : product.image_url
              : '/placeholder-images/medicine-placeholder.png'
          }
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.stock_quantity !== null && product.stock_quantity <= 10 && (
          <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${product.stock_quantity === 0 ? 'bg-destructive text-destructive-foreground' : 'bg-yellow-500 text-white'}`}>
            {product.stock_quantity === 0 ? 'Agotado' : `Pocas unidades: ${product.stock_quantity}`}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg mb-1 truncate text-foreground">{product.name}</CardTitle>
        {product.rating !== null && <StarRating rating={product.rating} />}
        <CardDescription className="text-sm mt-2 h-16 overflow-hidden text-ellipsis text-foreground/80">{product.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t border-white/20">
        <p className="text-xl font-semibold text-primary">S/.{parseFloat(product.price).toFixed(2)}</p>
        <Button size="sm" variant="default" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground" disabled={product.stock_quantity === 0}>
          <ShoppingCart className="mr-2 h-4 w-4" /> {product.stock_quantity === 0 ? 'No Disponible' : 'Añadir'}
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
);

export default ProductCard;