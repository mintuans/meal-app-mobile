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
import { AdminDashboard } from '@/src/screens/Admin/AdminDashboard';
import { ProtectedRoute } from '@/src/components/ProtectedRoute';

export const AppNavigator = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      
      {/* Các route yêu cầu đăng nhập */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/planner" element={<ProtectedRoute><WeeklyPlanner /></ProtectedRoute>} />
      <Route path="/daily" element={<ProtectedRoute><DailyPlan /></ProtectedRoute>} />
      <Route path="/dish/:id" element={<ProtectedRoute><DishDetails /></ProtectedRoute>} />
      <Route path="/pantry" element={<ProtectedRoute><Pantry /></ProtectedRoute>} />
      <Route path="/grocery" element={<ProtectedRoute><Grocery /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      
      {/* Route dành riêng cho Admin */}
      <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
    </Routes>
  );
};
