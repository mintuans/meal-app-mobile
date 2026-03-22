import { Meal, Ingredient } from './types';

export const MOCK_MEALS: Meal[] = [
  {
    id: '1',
    name: 'Avocado Sourdough',
    type: 'Breakfast',
    kcal: 340,
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop',
    completed: true,
    tags: ['Salty', 'Fast <15m', 'Healthy'],
    ingredients: [
      { id: 'i1', name: 'Fresh Basil Leaves', amount: '2 cups', price: 3.50, category: 'Vegetables', image: '' },
      { id: 'i2', name: 'Extra Virgin Olive Oil', amount: '1/2 cup', price: 2.20, category: 'Spices', image: '' },
    ],
    steps: [
      'Boil the Pasta: Bring a large pot of salted water to boil.',
      'Make the Pesto: Blend basil, garlic, pine nuts, and parmesan.',
      'Combine & Serve: Toss the warm pasta with the fresh pesto.'
    ]
  },
  {
    id: '2',
    name: 'Quinoa Power Bowl',
    type: 'Lunch',
    kcal: 520,
    price: 7.20,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
    completed: false,
    tags: ['Vegan', 'Healthy'],
  },
  {
    id: '3',
    name: 'Herb Grilled Salmon',
    type: 'Dinner',
    kcal: 410,
    price: 12.50,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop',
    completed: false,
    tags: ['High Protein', 'Italian'],
  }
];

export const MOCK_INGREDIENTS: Ingredient[] = [
  { id: '1', name: 'Organic Spinach', amount: 'bunch', price: 2.50, inStock: true, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=400&auto=format&fit=crop' },
  { id: '2', name: 'Bell Peppers', amount: 'unit', price: 1.20, inStock: false, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1566275529824-cca6d008f3da?q=80&w=400&auto=format&fit=crop' },
  { id: '3', name: 'Cherry Tomatoes', amount: '500g', price: 3.95, inStock: true, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=400&auto=format&fit=crop' },
  { id: '4', name: 'Avocados', amount: 'unit', price: 1.80, inStock: false, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=400&auto=format&fit=crop' },
];
