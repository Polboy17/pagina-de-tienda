import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Search, X } from 'lucide-react';

const FilterPanel = ({ categories, selectedCategories, handleCategoryChange, priceRange, setPriceRange, searchTerm, setSearchTerm, showFilters, setShowFilters }) => (
  <motion.aside 
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className={`md:w-1/4 lg:w-1/5 p-6 bg-card rounded-xl shadow-lg md:block ${showFilters ? 'block fixed inset-0 z-40 bg-background overflow-y-auto md:static md:inset-auto md:z-auto md:overflow-visible' : 'hidden'}`}
  >
    <div className="flex justify-between items-center mb-6 md:mb-4">
      <h2 className="text-2xl font-semibold text-primary">Filtros</h2>
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowFilters(false)}>
        <X />
      </Button>
    </div>
    
    <div className="space-y-6">
      <div>
        <Label htmlFor="product-search-filter" className="text-lg font-medium">Buscar</Label>
        <div className="relative mt-2">
          <Input
            id="product-search-filter"
            type="text"
            placeholder="Nombre del producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/80"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Categorías</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {categories.map(category => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`filter-category-${category.id}`}
                checked={selectedCategories.includes(category.name)}
                onCheckedChange={() => handleCategoryChange(category.name)}
              />
              <Label htmlFor={`filter-category-${category.id}`} className="font-normal cursor-pointer">{category.name}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Rango de Precios</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={500}
          step={5}
          className="my-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>S/. {priceRange[0]}</span>
          <span>S/. {priceRange[1]}</span>
        </div>
      </div>
    </div>
  </motion.aside>
);

export default FilterPanel;