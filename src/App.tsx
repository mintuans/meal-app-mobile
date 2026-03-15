import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { AppNavigator } from './navigation/AppNavigator';
import { AppProvider } from './store';
import { NotificationProvider } from './context/NotificationContext';

export default function App() {
  return (
    <AppProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500/30">
          {/* Mobile Container */}
          <div className="max-w-md mx-auto bg-white dark:bg-slate-900 min-h-screen relative shadow-2xl overflow-x-hidden">
            <main className="p-4 pb-24">
              <AppNavigator />
            </main>
            <BottomNav />
          </div>
        </div>
      </Router>
      </NotificationProvider>
    </AppProvider>
  );
}
