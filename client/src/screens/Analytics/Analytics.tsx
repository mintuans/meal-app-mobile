import React from 'react';
import { ArrowLeft, Calendar, TrendingUp, Lightbulb, Utensils, Store } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { MOCK_MEALS } from '@/src/constants';
import { analyticsServices, CategorySpending, AnalyticsSummary } from '@/src/services/analyticsService';
import { formatCurrency } from '@/src/utils';
import { useNavigate } from 'react-router-dom';

export const Analytics = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = React.useState('weekly');
  const [summary, setSummary] = React.useState<AnalyticsSummary | null>(null);
  const [categorySpending, setCategorySpending] = React.useState<CategorySpending[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchData();
  }, [timeframe]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, categoryRes] = await Promise.all([
        analyticsServices.getSummary(timeframe),
        analyticsServices.getSpendingByCategory()
      ]);
      if (summaryRes.data) setSummary(summaryRes.data);
      if (categoryRes.data) setCategorySpending(categoryRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const chartData = summary?.weeklyData || [];

  return (
    <div className="flex flex-col h-full pb-20">
      {/* Header */}
      <header className="flex items-center justify-between p-4 sticky top-0 bg-white dark:bg-slate-950 z-10 transition-colors">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </Button>
        <h2 className="text-xl font-black">Phân tích chi tiêu</h2>
        <Button variant="ghost" size="icon">
          <Calendar size={20} />
        </Button>
      </header>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-950 px-4 transition-colors">
        <div className="flex border-b border-slate-100 dark:border-slate-800 gap-8">
          {[
            { id: 'weekly', label: 'Weekly' },
            { id: 'monthly', label: 'Monthly' },
            { id: 'yearly', label: 'Yearly' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTimeframe(tab.id)}
              className={`pb-3 pt-4 text-sm font-bold transition-all border-b-[3px] ${
                timeframe === tab.id ? 'border-emerald-500 text-slate-900 dark:text-white' : 'border-transparent text-slate-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Summary Chart */}
        <Card className="p-6">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Tổng chi tiêu trong tuần</p>
          <div className="flex items-baseline gap-2">
            <h1 className="text-4xl font-black tracking-tight">{formatCurrency(summary?.totalSpending || 0)}</h1>
            <span className={`text-sm font-black flex items-center ${(summary?.spendingTrend || 0) > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
              <TrendingUp size={14} className="mr-1" />
              {summary?.spendingTrend}%
            </span>
          </div>

          <div className="mt-8 h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                <Tooltip 
                   formatter={(value: any) => [formatCurrency(value), 'Chi tiêu']}
                   contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        borderRadius: '16px', 
                        border: 'none',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '12px'
                   }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-black tracking-tight">Cơm nhà vs. Ăn ngoài</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20 shadow-sm shadow-emerald-500/5">
              <div className="flex items-center gap-2 mb-2">
                <Utensils size={16} className="text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Tại gia</span>
              </div>
              <p className="text-2xl font-black">{formatCurrency(summary?.homeSpending || 0)}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                 Avg. {formatCurrency((summary?.homeSpending || 0) / (timeframe === 'weekly' ? 18 : timeframe === 'monthly' ? 75 : 900))} / bữa
              </p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-slate-500">
                <Store size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Hàng quán</span>
              </div>
              <p className="text-2xl font-black">{formatCurrency(summary?.outSpending || 0)}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                 Avg. {formatCurrency((summary?.outSpending || 0) / (timeframe === 'weekly' ? 5 : timeframe === 'monthly' ? 22 : 260))} / bữa
              </p>
            </div>
          </div>

          {/* Savings Insight */}
          <div className="p-5 rounded-3xl bg-slate-900 dark:bg-emerald-500/10 flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-125 transition-transform duration-500">
              <Lightbulb size={40} className="text-emerald-500" />
            </div>
            <div className="size-12 rounded-2xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
              <Lightbulb size={24} className="text-slate-900" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-black uppercase tracking-widest mb-1">Mẹo tiết kiệm</p>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">Bạn có thể tiết kiệm khoảng <span className="text-emerald-500 font-bold">150.000đ/tuần</span> nếu chuyển 2 bữa tối ăn ngoài sang tự nấu tại nhà.</p>
            </div>
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-black tracking-tight">Chi tiêu theo danh mục</h3>
          <Card className="p-6 space-y-5 border-none shadow-sm">
            {categorySpending.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-4">Chưa có dữ liệu phân loại</p>
            ) : categorySpending.map((cat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                  <span className="text-slate-400">{cat.category}</span>
                  <span className="text-slate-900 dark:text-white">{cat.percentage}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color || '#10b981'
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <span className="text-[10px] font-bold text-slate-400">{formatCurrency(cat.amount)}</span>
                </div>
              </div>
            ))}
          </Card>
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
