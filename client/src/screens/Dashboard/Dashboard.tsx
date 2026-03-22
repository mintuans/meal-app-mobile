import React from 'react';
import { Bell, PlusCircle, Receipt, Lightbulb, CheckCircle, Circle, ArrowRight, TrendingUp, Sparkles, UtensilsCrossed } from 'lucide-react';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { userServices } from '@/src/services/apiService';
import { mealPlanServices, MealPlanItem } from '@/src/services/mealPlanService';
import { notificationServices, NotificationItem } from '@/src/services/notificationService';
import { formatCurrency } from '@/src/utils';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = React.useState<any>(null);
  const [todayMeals, setTodayMeals] = React.useState<MealPlanItem[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const dateFormatted = today.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const userId = localStorage.getItem('userId') || '00000000-0000-0000-0000-000000000000';

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, plansRes, notifRes] = await Promise.all([
        userServices.getUserProfile(userId),
        mealPlanServices.getPlans(todayStr, todayStr),
        notificationServices.getMy()
      ]);
      
      if (profileRes.data) setProfile(profileRes.data);
      if (plansRes.data) setTodayMeals(plansRes.data);
      if (notifRes.data) {
        setUnreadCount(notifRes.data.filter((n: any) => !n.is_read).length);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalKcal = todayMeals.reduce((sum, item) => sum + (parseFloat(item.kcal as any) || 0), 0);
  const totalCost = todayMeals.reduce((sum, item) => sum + (parseFloat(item.estimated_price as any) || 0), 0);
  const budgetLimit = profile?.grocery_limit || 1500000;
  const percentUsed = Math.min(Math.round((totalCost / budgetLimit) * 100), 100);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Premium Header */}
      <header className="flex items-center justify-between">
        <div 
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => navigate('/profile')}
        >
          <div className="relative group-active:scale-95 transition-transform">
            <div className="size-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <span className="material-symbols-outlined text-2xl">person</span>
            </div>
            <div className="absolute -bottom-1 -right-1 size-4 bg-emerald-500 border-2 border-slate-50 dark:border-slate-900 rounded-full" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest opacity-70">Chào buổi sáng,</p>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-500 transition-colors">
              {profile?.name || 'Người dùng'}
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/notifications')}
            className="rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-visible"
          >
            <Bell size={20} className="text-slate-600 dark:text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 size-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-slate-50 dark:border-slate-900 shadow-lg shadow-rose-500/20 animate-bounce">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </div>
      </header>
      {/* Stats Quick Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-500 p-5 rounded-[28px] text-white shadow-xl shadow-emerald-500/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
            <TrendingUp size={80} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Calo hôm nay</p>
          <p className="text-2xl font-black mt-1">
            {totalKcal.toLocaleString('vi-VN')} <span className="text-xs font-medium">kcal</span>
          </p>
          <div className="mt-4 flex items-center gap-1.5 bg-white/20 w-fit px-2 py-1 rounded-full backdrop-blur-md">
            <Sparkles size={12} />
            <span className="text-[10px] font-bold">Mục tiêu: 1,800</span>
          </div>
        </div>
        <div className="bg-slate-900 dark:bg-white p-5 rounded-[28px] text-white dark:text-slate-900 shadow-xl shadow-slate-900/10 relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Tổng tiền hôm nay</p>
          <p className="text-2xl font-black mt-1">{formatCurrency(totalCost)}</p>
          <div className="mt-4 h-1.5 w-full bg-slate-700 dark:bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${percentUsed}%` }} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button 
          className="flex-1 h-14 rounded-2xl gap-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-none shadow-sm hover:translate-y-[-2px] transition-all"
          onClick={() => navigate('/planner')}
        >
          <div className="size-8 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center">
            <PlusCircle size={18} />
          </div>
          <span className="font-bold text-sm">Thêm món</span>
        </Button>
        <Button className="flex-1 h-14 rounded-2xl gap-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-none shadow-sm hover:translate-y-[-2px] transition-all">
          <div className="size-8 rounded-xl bg-blue-100 text-blue-500 flex items-center justify-center">
            <Receipt size={18} />
          </div>
          <span className="font-bold text-sm">Quét hóa đơn</span>
        </Button>
      </div>

      {/* Suggested Tip Overlay */}
      <div className="relative p-6 rounded-[32px] bg-gradient-to-br from-emerald-600 to-teal-700 text-white overflow-hidden shadow-lg shadow-emerald-500/20">
        <div className="absolute -right-4 -bottom-4 size-32 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex gap-5 items-start">
          <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <Lightbulb size={24} className="text-yellow-300" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">Mẹo tiết kiệm tuần này</h3>
            <p className="text-emerald-50 leading-snug mt-1 text-sm opacity-90">
              Bạn đã sử dụng {percentUsed}% ngân sách. Hãy thử các món từ thực phẩm có sẵn trong kho nhé!
            </p>
            <button className="flex items-center gap-2 mt-4 text-xs font-black uppercase tracking-widest group">
              Xem chi tiết <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Today's Menu Section */}
      <div className="space-y-5">
        <div className="flex justify-between items-end px-1">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Thực đơn hôm nay</h2>
            <p className="text-xs text-slate-500 font-medium">{dateFormatted}</p>
          </div>
          <button 
            onClick={() => navigate('/planner')}
            className="text-emerald-500 font-bold text-sm flex items-center gap-1 group"
          >
            Cả tuần <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            [1, 2].map(i => <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-[24px]" />)
          ) : todayMeals.length > 0 ? (
            todayMeals.map((plan) => (
              <Card 
                key={plan.id} 
                className="flex items-center gap-4 p-4 rounded-[28px] border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/dish/${plan.meal_id}`)}
              >
                <div className="size-20 rounded-[20px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  <UtensilsCrossed size={32} className="text-slate-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.15em]">{plan.type_name}</span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">{plan.meal_name}</h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1 text-slate-400">
                      <TrendingUp size={12} />
                      <span className="text-xs font-bold leading-none">{plan.kcal} kcal</span>
                    </div>
                    <div className="size-1 bg-slate-200 rounded-full" />
                    <p className="text-xs font-black text-slate-900 dark:text-white leading-none">
                      {formatCurrency(plan.estimated_price)}
                    </p>
                  </div>
                </div>
                <div className={`size-10 rounded-full flex items-center justify-center transition-all ${plan.is_completed ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-300'}`}>
                  {plan.is_completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-slate-400 font-medium italic">Hôm nay chưa có món nào trong kế hoạch</p>
              <Button 
                variant="ghost" 
                className="mt-4 text-emerald-500 font-bold"
                onClick={() => navigate('/planner')}
              >
                Lập kế hoạch ngay
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

