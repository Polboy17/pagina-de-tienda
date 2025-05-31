import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useToast } from "@/components/ui/use-toast";
import { fetchProducts, fetchCategories } from '@/lib/apiClient';
import ProductCard from '@/components/products/ProductCard';
import FilterPanel from '@/components/products/FilterPanel';
import { Button } from '@/components/ui/button';
import { Filter as FilterIcon } from 'lucide-react';


const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const productsData = await fetchProducts();
      setProducts(productsData);
      setFilteredProducts(productsData);

      const categoriesData = await fetchCategories();
      // Remove duplicate categories by id
      const uniqueCategories = categoriesData.reduce((acc, current) => {
        if (!acc.find(cat => cat.id === current.id)) {
          acc.push(current);
        }
        return acc;
      }, []);
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error al cargar datos",
        description: `No se pudieron obtener los datos. ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let tempProducts = products;

    if (searchTerm) {
      tempProducts = tempProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      tempProducts = tempProducts.filter(product =>
        product.category && selectedCategories.includes(product.category.name)
      );
    }
    
    tempProducts = tempProducts.filter(product =>
      parseFloat(product.price) >= priceRange[0] && parseFloat(product.price) <= priceRange[1]
    );

    setFilteredProducts(tempProducts);
  }, [searchTerm, selectedCategories, priceRange, products]);

  const handleCategoryChange = (categoryName) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-160px)]"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">Nuestros Productos</h1>
        <p className="text-lg text-muted-foreground">Encuentra productos de la mejor calidad para ti y tu familia.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8">
        <FilterPanel 
          categories={categories}
          selectedCategories={selectedCategories}
          handleCategoryChange={handleCategoryChange}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        <main className="flex-1">
          <div className="flex justify-end mb-4 md:hidden">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <FilterIcon className="mr-2 h-4 w-4" /> {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </Button>
          </div>
          {filteredProducts.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6" // Adjusted to 3 columns for XL
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 min-h-[300px] flex flex-col justify-center items-center">
              <Search size={64} className="mx-auto text-muted-foreground opacity-50 mb-6" />
              <p className="text-2xl text-muted-foreground">No se encontraron productos.</p>
              <p className="text-foreground/70">Intenta ajustar tus filtros o revisa más tarde.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;