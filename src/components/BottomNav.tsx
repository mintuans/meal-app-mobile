import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Utensils, BarChart2, Wallet, User } from 'lucide-react';
import { cn } from '@/src/utils';
import { useLocation } from 'react-router-dom';

export const BottomNav = () => {
  const location = useLocation();
  if (location.pathname === '/auth') return null;

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Utensils, label: 'Meals', path: '/planner' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: Wallet, label: 'Budget', path: '/pantry' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-50 max-w-md mx-auto">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-emerald-500" : "text-slate-400 dark:text-slate-500"
            )
          }
        >
          <item.icon size={24} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
