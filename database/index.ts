export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
};

export type Category = {
  id: string;
  name: string;
  image: string;
};

// Simulating Firestore "products" collection
export const PRODUCTS_COLLECTION: Product[] = [
  {
    id: '1',
    name: 'Puma RS-X³ Puzzle',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    category: 'Shoes',
    description: 'The RS-X³ is a celebration of the original RS family, but with a modern, futuristic twist. The puzzle-inspired design features layers of colors and textures.',
  },
  {
    id: '2',
    name: 'Adidas NMD_R1',
    price: 11999,
    image: 'https://images.unsplash.com/photo-1587563871167-1ee797312ca7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    category: 'Shoes',
    description: 'Streamlined and modern, these NMD shoes combine 80s racing heritage with modern materials. The breathable knit upper rides on a responsive Boost midsole.',
  },
  {
    id: '3',
    name: 'Essentials Hoodie',
    price: 6499,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    category: 'Apparel',
    description: 'A premium heavy-weight hoodie with a relaxed fit. clean minimal branding and superior comfort.',
  },
  {
    id: '4',
    name: 'Urban Backpack',
    price: 4499,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    category: 'Accessories',
    description: 'Durable, stylish, and functional. This backpack features multiple compartments and a sleek design perfect for city life.',
  },
  {
    id: '5',
    name: 'Nike Air Force 1',
    price: 9999,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    category: 'Shoes',
    description: 'The legend lives on in the Nike Air Force 1, a modern take on the icon that blends classic style with fresh, crisp details.',
  },
  {
    id: '6',
    name: 'Minimalist Watch',
    price: 12499,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    category: 'Accessories',
    description: 'A sleek, minimalist watch that goes with everything. Features a genuine leather strap and a durable stainless steel case.',
  },
  {
    id: '7',
    name: 'Denim Jacket',
    price: 7999,
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    category: 'Apparel',
    description: 'A classic denim jacket that never goes out of style. Made from high-quality denim that gets better with every wear.',
  },
  {
    id: '8',
    name: 'Running Cap',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    category: 'Accessories',
    description: 'Lightweight and breathable, this cap is perfect for running or just keeping the sun out of your eyes.',
  },
  {
    id: '9',
    name: 'Graphic T-Shirt',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    category: 'Apparel',
    description: 'Make a statement with this bold graphic t-shirt. Soft cotton jersey ensures all-day comfort.',
  },
  {
    id: '10',
    name: 'Leather Sneakers',
    price: 10999,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    category: 'Shoes',
    description: 'Premium leather sneakers that bridge the gap between casual and dressy. Handcrafted with attention to detail.',
  },
  {
    id: '11',
    name: 'Classic Sunglasses',
    price: 8499,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    category: 'Accessories',
    description: 'Timeless sunglasses design with UV protection. The perfect accessory for sunny days.',
  },
  {
    id: '12',
    name: 'Tech Fleece Joggers',
    price: 6999,
    image: 'https://images.unsplash.com/photo-1584865288642-42923c53b1e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    category: 'Apparel',
    description: 'Modern joggers featuring Tech Fleece for warmth without the bulk. Tapered fit for a streamlined look.',
  },
  // Adding a broken image item to test hidding logic
  {
    id: '13',
    name: 'Hidden Product',
    price: 100,
    image: 'https://invalid-url.com/image.jpg',
    category: 'Shoes',
    description: 'This should not be visible',
  }
];

// Simulating Firestore "categories" collection
export const CATEGORIES_COLLECTION: Category[] = [
  { id: 'shoes', name: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
  { id: 'apparel', name: 'Apparel', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
  { id: 'accessories', name: 'Accessories', image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
];
