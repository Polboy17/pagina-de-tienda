import { API_BASE_URL } from './constants';

export async function fetchProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return await response.json();
}

export async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return await response.json();
}
