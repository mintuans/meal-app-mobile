import React from 'react';
import { ChevronLeft, MoreHorizontal, ShoppingCart } from 'lucide-react';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { MOCK_INGREDIENTS } from '@/src/constants';
import { formatCurrency } from '@/src/utils';

export const Grocery = () => {
  return (
    <div className="flex flex-col min-h-screen pb-32">
      {/* Header */}
      <header className="p-6 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
        <div className="flex items-center justify-between mb-6">
          <Button variant="secondary" size="icon">
            <ChevronLeft size={24} />
          </Button>
          <h1 className="text-xl font-bold">Weekly Grocery</h1>
          <Button variant="secondary" size="icon">
            <MoreHorizontal size={24} />
          </Button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex-none px-4 py-2 rounded-full bg-emerald-500 text-slate-900 text-sm font-semibold">
            All Items (24)
          </div>
          {['Produce', 'Dairy & Eggs', 'Pantry'].map((cat) => (
            <div key={cat} className="flex-none px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium">
              {cat}
            </div>
          ))}
        </div>
      </header>

      {/* List */}
      <main className="px-6 space-y-8 flex-grow">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Fresh Produce</h2>
            <span className="text-xs font-medium text-emerald-500">3 items</span>
          </div>
          <div className="space-y-3">
            {MOCK_INGREDIENTS.slice(0, 3).map((ing, i) => (
              <Card key={ing.id} className="flex items-center gap-4 p-4">
                <input 
                  type="checkbox" 
                  checked={i === 2}
                  className="w-6 h-6 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" 
                />
                <div className="flex-grow">
                  <p className={`font-semibold text-sm ${i === 2 ? 'line-through text-slate-400' : ''}`}>
                    {ing.name}
                  </p>
                  <p className={`text-xs ${i === 2 ? 'text-slate-400' : 'text-slate-500'}`}>
                    3 units • ~{formatCurrency(ing.price * 3)}
                  </p>
                </div>
                <img 
                  src={ing.image} 
                  alt={ing.name} 
                  className={`w-10 h-10 rounded-lg object-cover ${i === 2 ? 'grayscale opacity-50' : ''}`}
                  referrerPolicy="no-referrer"
                />
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Dairy & Proteins</h2>
            <span className="text-xs font-medium text-emerald-500">2 items</span>
          </div>
          <div className="space-y-3">
            <Card className="flex items-center gap-4 p-4">
              <input type="checkbox" className="w-6 h-6 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
              <div className="flex-grow">
                <p className="font-semibold text-sm">Greek Yogurt</p>
                <p className="text-xs text-slate-500">500g • ~$5.80</p>
              </div>
              <img src="https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=400&auto=format&fit=crop" className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto p-6 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 z-20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-slate-500 font-medium">Estimated Total</p>
            <p className="text-2xl font-bold">$28.55</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-medium">Cart Progress</p>
            <p className="text-sm font-bold text-emerald-500">1 / 6 items</p>
          </div>
        </div>
        <Button className="w-full h-14 gap-2">
          <ShoppingCart size={20} />
          Update Inventory
        </Button>
      </footer>
    </div>
  );
};
