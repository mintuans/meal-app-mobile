import React from 'react';
import { Calendar, PersonStanding, StickyNote, Sun, Utensils, Cookie, Moon, Plus } from 'lucide-react';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { MOCK_MEALS } from '@/src/constants';

export const DailyPlan = () => {
  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2 rounded-full text-emerald-500">
            <Calendar size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Monday, Oct 23</h1>
            <p className="text-xs text-slate-500">Today's Plan</p>
          </div>
        </div>
        <Button variant="secondary" size="icon">
          <PersonStanding size={20} />
        </Button>
      </header>

      {/* Nutrition Summary */}
      <Card className="p-5">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Calories Remaining</p>
            <h2 className="text-3xl font-bold">650 <span className="text-sm font-normal text-slate-400">kcal</span></h2>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-emerald-500 uppercase">75% of goal</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '75%' }} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Protein', val: '120/150g', color: 'bg-blue-400', p: 80 },
              { label: 'Carbs', val: '210/280g', color: 'bg-amber-400', p: 75 },
              { label: 'Fat', val: '65/80g', color: 'bg-rose-400', p: 81 },
            ].map((macro) => (
              <div key={macro.label} className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                  <span>{macro.label}</span>
                  <span>{macro.val}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full">
                  <div className={`${macro.color} h-full rounded-full`} style={{ width: `${macro.p}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Daily Note */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-start gap-3">
        <StickyNote size={20} className="text-emerald-500" />
        <div>
          <h4 className="text-sm font-bold">Daily Note</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">Lunch with colleagues at the Italian bistro. Need to stay within carb limit!</p>
        </div>
      </div>

      {/* Meals */}
      <div className="space-y-6">
        {[
          { icon: Sun, label: 'Breakfast', kcal: 420, color: 'text-amber-500' },
          { icon: Utensils, label: 'Lunch', kcal: 650, color: 'text-emerald-500' },
          { icon: Cookie, label: 'Snacks', kcal: 180, color: 'text-rose-400' },
          { icon: Moon, label: 'Dinner', kcal: 600, color: 'text-indigo-500' },
        ].map((section) => {
          const meal = MOCK_MEALS.find(m => m.type === section.label);
          return (
            <div key={section.label} className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <section.icon size={20} className={section.color} />
                  {section.label}
                </h3>
                <span className="text-sm font-medium text-slate-500">{section.kcal} kcal</span>
              </div>
              {meal ? (
                <Card className="flex p-3 gap-3 items-center">
                  <img src={meal.image} className="w-16 h-16 rounded object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{meal.name}</p>
                    <p className="text-xs text-slate-400">Planned for today</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-300">check_circle</span>
                </Card>
              ) : (
                <Card className="flex p-3 gap-3 items-center border-l-4 border-l-emerald-500">
                  <div className="w-16 h-16 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <Utensils size={32} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm italic text-slate-700 dark:text-slate-300">"Lunch with colleagues"</p>
                    <p className="text-xs text-slate-400">Italian Bistro (Planned)</p>
                  </div>
                  <Button size="icon" className="size-8">
                    <Plus size={16} />
                  </Button>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
