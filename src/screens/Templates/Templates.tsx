import React from 'react';
import { ArrowLeft, Search, Calendar, Utensils, ClipboardCheck } from 'lucide-react';
import { Button } from '@/src/components/Button';
import { Card } from '@/src/components/Card';

export const Templates = () => {
  const templates = [
    {
      id: '1',
      title: 'Diet Week',
      desc: 'Balanced nutrition for weight management',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
      days: 7,
      meals: 21,
      popular: true,
    },
    {
      id: '2',
      title: 'Budget Student Menu',
      desc: 'Affordable and easy to cook recipes',
      image: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=800&auto=format&fit=crop',
      days: 5,
      meals: 15,
    },
    {
      id: '3',
      title: 'Home Cooked Classics',
      desc: 'Traditional favorites for the whole family',
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=800&auto=format&fit=crop',
      days: 3,
      meals: 9,
    }
  ];

  return (
    <div className="flex flex-col h-full pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <Button variant="secondary" size="icon">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold tracking-tight">Meal Templates</h1>
          <Button variant="secondary" size="icon">
            <Search size={20} />
          </Button>
        </div>
        
        {/* Categories */}
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {['All', 'Healthy', 'Quick', 'Budget', 'Family'].map((cat, i) => (
            <button
              key={cat}
              className={`flex flex-col items-center shrink-0 px-2 pb-2 text-sm font-bold transition-all border-b-4 ${
                i === 0 ? 'border-emerald-500 text-slate-900 dark:text-white' : 'border-transparent text-slate-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
        {templates.map((template) => (
          <Card key={template.id} className="p-0 overflow-hidden group transition-all hover:shadow-md">
            <div className="h-48 w-full relative">
              <img 
                src={template.image} 
                alt={template.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {template.popular && (
                <span className="absolute top-4 right-4 bg-emerald-500/90 text-slate-900 text-xs font-bold px-2 py-1 rounded-full">
                  Popular
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold">{template.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{template.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {template.days} days
                </div>
                <div className="flex items-center gap-1">
                  <Utensils size={14} />
                  {template.meals} meals
                </div>
              </div>
              <Button className="w-full gap-2">
                <ClipboardCheck size={20} />
                Apply to Week
              </Button>
            </div>
          </Card>
        ))}
        <div className="h-16" />
      </main>
    </div>
  );
};
