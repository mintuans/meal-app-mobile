import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Dashboard } from '@/src/screens/Dashboard/Dashboard';
import { WeeklyPlanner } from '@/src/screens/WeeklyPlanner/WeeklyPlanner';
import { DailyPlan } from '@/src/screens/DailyPlan/DailyPlan';
import { DishDetails } from '@/src/screens/DishDetails/DishDetails';
import { Pantry } from '@/src/screens/Pantry/Pantry';
import { Grocery } from '@/src/screens/Grocery/Grocery';
import { Analytics } from '@/src/screens/Analytics/Analytics';
import { Templates } from '@/src/screens/Templates/Templates';
import { Profile } from '@/src/screens/Profile/Profile';
import { Settings } from '@/src/screens/Settings/Settings';
import { Auth } from '@/src/screens/Auth/Auth';

export const AppNavigator = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/planner" element={<WeeklyPlanner />} />
      <Route path="/daily" element={<DailyPlan />} />
      <Route path="/dish/:id" element={<DishDetails />} />
      <Route path="/pantry" element={<Pantry />} />
      <Route path="/grocery" element={<Grocery />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/templates" element={<Templates />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};
