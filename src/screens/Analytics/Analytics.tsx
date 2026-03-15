import React from 'react';
import { ArrowLeft, Calendar, TrendingUp, Lightbulb, Utensils, Store } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { MOCK_MEALS } from '@/src/constants';
import { formatCurrency } from '@/src/utils';

const data = [
  { name: 'Mon', value: 30 },
  { name: 'Tue', value: 45 },
  { name: 'Wed', value: 35 },
  { name: 'Thu', value: 60 },
  { name: 'Fri', value: 25 },
  { name: 'Sat', value: 55 },
  { name: 'Sun', value: 40 },
];

export const Analytics = () => {
  return (
    <div className="flex flex-col h-full pb-20">
      {/* Header */}
      <header className="flex items-center justify-between p-4 sticky top-0 bg-white dark:bg-slate-950 z-10">
        <Button variant="ghost" size="icon">
          <ArrowLeft size={24} />
        </Button>
        <h2 className="text-lg font-bold">Cost Analytics</h2>
        <Button variant="ghost" size="icon">
          <Calendar size={20} />
        </Button>
      </header>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-950 px-4">
        <div className="flex border-b border-slate-100 dark:border-slate-800 gap-8">
          {['Weekly', 'Monthly', 'Yearly'].map((tab, i) => (
            <button
              key={tab}
              className={`pb-3 pt-4 text-sm font-bold transition-all border-b-[3px] ${
                i === 0 ? 'border-emerald-500 text-slate-900 dark:text-white' : 'border-transparent text-slate-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Summary Chart */}
        <Card className="p-6">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Spending</p>
          <div className="flex items-baseline gap-2">
            <h1 className="text-4xl font-bold tracking-tight">$428.50</h1>
            <span className="text-red-500 text-sm font-semibold flex items-center">
              <TrendingUp size={14} className="mr-1" />
              12.4%
            </span>
          </div>
          
          <div className="mt-8 h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} 
                />
                <Tooltip />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Comparison */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Cooking vs. Eating Out</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Utensils size={16} className="text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Home</span>
              </div>
              <p className="text-2xl font-bold">$154.20</p>
              <p className="text-[10px] text-slate-500">Avg. $8.50 / meal</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-slate-500">
                <Store size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Out</span>
              </div>
              <p className="text-2xl font-bold">$274.30</p>
              <p className="text-[10px] text-slate-500">Avg. $32.10 / meal</p>
            </div>
          </div>

          {/* Savings Insight */}
          <div className="p-4 rounded-xl bg-slate-900 dark:bg-emerald-500/20 flex items-center gap-4">
            <div className="size-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
              <Lightbulb size={20} className="text-slate-900" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Potential Savings</p>
              <p className="text-slate-300 text-xs">Switching 2 dinners to home cooking could save you $48/week.</p>
            </div>
          </div>
        </div>

        {/* Top Spenders */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Top Spenders</h3>
            <button className="text-emerald-500 text-sm font-bold">See All</button>
          </div>
          <div className="space-y-3">
            {MOCK_MEALS.map((meal) => (
              <Card key={meal.id} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <img src={meal.image} className="size-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <p className="text-sm font-bold">{meal.name}</p>
                    <p className="text-xs text-slate-500">Ingredient • Grocery Store</p>
                  </div>
                </div>
                <p className="text-sm font-bold">{formatCurrency(meal.price * 5)}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
