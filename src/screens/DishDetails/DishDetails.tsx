import React from 'react';
import { ArrowLeft, Share2, ShoppingCart, Utensils, Leaf } from 'lucide-react';
import { Button } from '@/src/components/Button';
import { mealServices, MealDetail } from '@/src/services/mealService';
import { formatCurrency } from '@/src/utils';
import { useParams, useNavigate } from 'react-router-dom';

export const DishDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meal, setMeal] = React.useState<MealDetail | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (id) {
      fetchMealDetails(id);
    }
  }, [id]);

  const fetchMealDetails = async (mealId: string) => {
    try {
      setLoading(true);
      const res = await mealServices.getMealDetails(mealId);
      if (res.data) setMeal(res.data);
    } catch (e) {
      console.error("Lỗi khi lấy chi tiết món ăn:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Utensils size={48} className="text-slate-300 mb-4" />
        <p className="text-slate-500 font-medium">Không tìm thấy thông tin món ăn.</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Quay lại</Button>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md max-w-md mx-auto">
        <Button variant="secondary" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-lg font-bold">Chi tiết món ăn</h2>
        <Button variant="secondary" size="icon">
          <Share2 size={20} />
        </Button>
      </div>

      {/* Image Header */}
      <div className="pt-16">
        <div className="relative aspect-[4/3] overflow-hidden">
          {meal.image ? (
            <img 
              src={meal.image} 
              alt={meal.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
              <Utensils size={64} className="text-slate-400" />
            </div>
          )}
          <div className="absolute bottom-4 left-4">
            <span className="bg-emerald-500 px-3 py-1 rounded-full text-xs font-bold text-slate-900 uppercase tracking-wider">
              {meal.type || 'Phổ biến'}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        <h1 className="text-3xl font-bold leading-tight">{meal.name}</h1>
        
        {/* Tags */}
        <div className="flex gap-3 flex-wrap">
          {meal.tags?.map((tag) => (
            <div key={tag} className="flex h-9 items-center gap-2 rounded-full bg-emerald-500/10 px-4 border border-emerald-500/20">
              <span className="text-emerald-500 text-sm font-semibold">{tag}</span>
            </div>
          ))}
          <div className="flex h-9 items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-4">
             <span className="text-slate-500 text-sm font-semibold">{meal.kcal} Kcal</span>
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          {meal.name} là một món ăn thơm ngon, bổ dưỡng, cung cấp đầy đủ năng lượng cho bạn.
        </p>

        {/* Ingredients */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-xl font-bold">Nguyên liệu</h3>
            <span className="text-emerald-500 font-bold text-sm">Tổng: {formatCurrency(meal.price)}</span>
          </div>
          <div className="space-y-3">
            {meal.ingredients?.map((ing) => (
              <div key={ing.id} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    <Leaf size={18} />
                  </div>
                  <div>
                    <p className="font-semibold">{ing.name}</p>
                    <p className="text-xs text-slate-500">{ing.amount}</p>
                  </div>
                </div>
                <p className="font-bold text-emerald-500">{formatCurrency(ing.price)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Các bước thực hiện</h3>
          <div className="space-y-6">
            {meal.steps?.map((step, i) => {
              const parts = step.split(': ');
              const title = parts.length > 1 ? parts[0] : `Bước ${i + 1}`;
              const desc = parts.length > 1 ? parts[1] : parts[0];
              return (
                <div key={i} className="flex gap-4">
                  <div className="flex-none">
                    <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500 text-slate-900 font-bold text-sm">
                      {i + 1}
                    </div>
                  </div>
                  <div className="pt-1">
                    <p className="font-semibold mb-1">{title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-slate-950/95 border-t border-slate-200 dark:border-slate-800 max-w-md mx-auto">
        <Button className="w-full h-14 gap-2">
          <ShoppingCart size={20} />
          Thêm nguyên liệu vào giỏ hàng
        </Button>
      </div>
    </div>
  );
};
