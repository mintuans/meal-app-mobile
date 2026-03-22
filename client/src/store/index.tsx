import React, { createContext, useContext, useState } from 'react';
import { Meal, Ingredient } from '../types';
import { MOCK_MEALS, MOCK_INGREDIENTS } from '../constants';

interface AppState {
  meals: Meal[];
  ingredients: Ingredient[];
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meals] = useState<Meal[]>(MOCK_MEALS);
  const [ingredients] = useState<Ingredient[]>(MOCK_INGREDIENTS);

  return (
    <AppContext.Provider value={{ meals, ingredients }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
};
