import { PRODUCTS_COLLECTION, CATEGORIES_COLLECTION, Product, Category } from './index';

// Simulating a service layer that communicates with a DB
export const Database = {
  getProducts: async (): Promise<Product[]> => {
    // Simulate network delay
    // await new Promise(resolve => setTimeout(resolve, 500)); 
    return PRODUCTS_COLLECTION;
  },

  getCategories: async (): Promise<Category[]> => {
    return CATEGORIES_COLLECTION;
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    return PRODUCTS_COLLECTION.find(p => p.id === id);
  },

  getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
    return PRODUCTS_COLLECTION.filter(p => p.category.toLowerCase() === categoryId.toLowerCase());
  }
};
