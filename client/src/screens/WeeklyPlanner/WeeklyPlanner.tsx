import React from 'react';
import { Calendar, MoreVertical, GripVertical, CheckCircle, Sparkles, PlusCircle, Utensils, Plus, X, Trash2, Search, Check, UtensilsCrossed } from 'lucide-react';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { mealServices, MealDetail } from '@/src/services/mealService';
import { pantryServices } from '@/src/services/pantryService';
import { mealPlanServices, MealPlanItem } from '@/src/services/mealPlanService';
import { formatCurrency, fileToBase64 } from '@/src/utils';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@/src/context/NotificationContext';
import { Camera, X as LucideX } from 'lucide-react';

export const WeeklyPlanner = () => {
  const navigate = useNavigate();
  const timelineRef = React.useRef<HTMLDivElement>(null);
  const { showNotification } = useNotification();
  const [plannedMeals, setPlannedMeals] = React.useState<MealPlanItem[]>([]);
  const [allReadyMeals, setAllReadyMeals] = React.useState<MealDetail[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedDateStr, setSelectedDateStr] = React.useState(new Date().toISOString().split('T')[0]);

  const days = React.useMemo(() => {
    const now = new Date();
    // Lấy Thứ 2 đầu tuần hiện tại
    const dayOfWeek = now.getDay(); // 0 (CN) -> 6 (T7)
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      return {
        label: i === 6 ? 'CN' : `T${i + 2}`,
        date: d.getDate(),
        fullDate: iso,
        active: iso === selectedDateStr
      };
    });
  }, [selectedDateStr]);

  // State cho Modal tạo/sửa món (Recipe Definition)
  const [showModal, setShowModal] = React.useState(false);

  // State cho Modal chọn món đã có (Meal Picker)
  const [showPickerModal, setShowPickerModal] = React.useState(false);
  const [pickerTarget, setPickerTarget] = React.useState<{ section: string, date: string } | null>(null);

  const [isEditing, setIsEditing] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [mealTypes, setMealTypes] = React.useState<{ id: string, name: string }[]>([]);
  const [allIngredients, setAllIngredients] = React.useState<{ id: string, name: string, price: number }[]>([]);
  const [submitting, setSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: '',
    typeId: '',
    typeName: '',
    kcal: '',
    tags: '',
    ingredients: [] as { id: string, name: string, amount: string, price: number, basePrice: number, baseUnit: string }[],
    steps: [] as string[]
  });

  const [searchIng, setSearchIng] = React.useState('');
  const [showIngDropdown, setShowIngDropdown] = React.useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = React.useState(false);

  React.useEffect(() => {
    fetchData();
    loadLookups();
  }, [selectedDateStr]);

  React.useEffect(() => {
    // Cuộn đến ngày đang chọn khi mount
    if (timelineRef.current) {
      const activeElement = timelineRef.current.querySelector('.bg-emerald-500');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      }
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Lấy cả kế hoạch và danh sách món ăn sẵn có
      const [planRes, allMealsRes] = await Promise.all([
        mealPlanServices.getPlans(selectedDateStr, selectedDateStr),
        mealServices.getAllMeals()
      ]);
      if (planRes.data) setPlannedMeals(planRes.data);
      if (allMealsRes.data) setAllReadyMeals(allMealsRes.data);
    } catch (e) {
      console.error("Lỗi khi tải dữ liệu:", e);
    } finally {
      setLoading(false);
    }
  };

  const loadLookups = async () => {
    try {
      const [typesRes, ingRes] = await Promise.all([
        mealServices.getMealTypes(),
        pantryServices.getAllIngredients()
      ]);
      if (typesRes.data) setMealTypes(typesRes.data);
      if (ingRes.data) setAllIngredients(ingRes.data as any);
    } catch (e) {
      console.error("Lỗi khi tải dữ liệu cấu hình:", e);
    }
  };

  const fetchMeals = fetchData; // Alias cho các chỗ gọi cũ

  const handleEditRecipe = async (e: React.MouseEvent, mealId: string) => {
    e.stopPropagation();
    try {
      setLoading(true);
      const res = await mealServices.getMealDetails(mealId);
      if (res.data) {
        const fullMeal = res.data;
        setFormData({
          name: fullMeal.name,
          typeId: mealTypes.find(t => t.name === fullMeal.type)?.id || '',
          typeName: fullMeal.type,
          kcal: fullMeal.kcal.toString(),
          tags: fullMeal.tags.join(', '),
          ingredients: fullMeal.ingredients?.map(ing => ({
            id: ing.id,
            name: ing.name,
            amount: ing.amount,
            price: ing.price,
            basePrice: ing.basePrice || ing.price, // Fallback nếu chưa có
            baseUnit: ing.baseUnit || '1 unit'
          })) || [],
          steps: fullMeal.steps || [],
          image: fullMeal.image || ''
        });
        setEditingId(fullMeal.id);
        setIsEditing(true);
        setShowModal(true);
      }
    } catch (error) {
      showNotification("Lỗi khi tải thông tin món ăn", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (e: React.MouseEvent, planId: string) => {
    e.stopPropagation();
    if (window.confirm("Bỏ món này khỏi kế hoạch?")) {
      try {
        await mealPlanServices.removeFromPlan(planId);
        fetchData();
      } catch (error) {
        alert("Lỗi khi xóa kế hoạch");
      }
    }
  };

  const handleToggleComplete = async (e: React.MouseEvent, planId: string, currentStatus: boolean) => {
    e.stopPropagation();
    try {
      await mealPlanServices.toggleComplete(planId, !currentStatus);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const calculatePrice = (basePrice: number, baseUnitStr: string, usedAmountStr: string) => {
    try {
      const getNum = (s: string) => {
        const match = s.toString().match(/(\d+\.*\d*)/);
        return match ? parseFloat(match[0]) : 1;
      };
      const getUnit = (s: string) => {
        const match = s.toString().match(/[a-zA-Z\u00C0-\u1EF9]+/);
        return match ? match[0].toLowerCase() : '';
      };

      let baseVal = getNum(baseUnitStr || '1 unit');
      let baseUnit = getUnit(baseUnitStr || 'unit');
      let usedVal = getNum(usedAmountStr || '0');
      let usedUnit = getUnit(usedAmountStr || '');

      // Nếu không có đơn vị ở phần sử dụng, giả định dùng chung đơn vị với gốc
      if (!usedUnit) usedUnit = baseUnit;

      const toBase = (val: number, unit: string) => {
        if (['kg', 'kí', 'ký'].includes(unit)) return val * 1000;
        if (['l', 'lít'].includes(unit)) return val * 1000;
        if (['lạng'].includes(unit)) return val * 100;
        return val;
      };

      const finalBase = toBase(baseVal, baseUnit);
      const finalUsed = toBase(usedVal, usedUnit);

      if (finalBase === 0) return basePrice;
      return (finalUsed / finalBase) * basePrice;
    } catch (e) {
      return basePrice;
    }
  };

  const handleUpdateIngredientAmount = (id: string, newAmount: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map(ing => {
        if (ing.id === id) {
          return { 
            ...ing, 
            amount: newAmount,
            price: calculatePrice(ing.basePrice, ing.baseUnit, newAmount)
          };
        }
        return ing;
      })
    }));
  };

  const handleAddToPlan = async (mealId: string) => {
    if (!pickerTarget) return;
    try {
      const typeId = mealTypes.find(t => t.name === pickerTarget.section)?.id;
      if (!typeId) return;

      await mealPlanServices.addToPlan({
        mealId,
        planDate: pickerTarget.date,
        mealTypeId: typeId
      });
      setShowPickerModal(false);
      fetchData();
    } catch (error) {
      showNotification("Lỗi khi thêm vào kế hoạch", "error");
    }
  };

  const handleAddIngredient = (ing: any) => {
    if (formData.ingredients.find(item => item.id === ing.id)) return;
    const defaultAmount = '100g';
    const initialPrice = calculatePrice(ing.price, ing.unit || '1 unit', defaultAmount);
    
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { 
        id: ing.id, 
        name: ing.name, 
        amount: defaultAmount, 
        price: initialPrice,
        basePrice: ing.price,
        baseUnit: ing.unit || '1 unit'
      }]
    });
    setSearchIng('');
    setShowIngDropdown(false);
  };

  const handleRemoveIngredient = (id: string) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter(item => item.id !== id)
    });
  };

  const handleAddStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, '']
    });
  };

  const handleUpdateStep = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData({ ...formData, steps: newSteps });
  };

  const handleRemoveStep = (index: number) => {
    setFormData({
      ...formData,
      steps: formData.steps.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.typeId) {
      showNotification("Vui lòng nhập tên món và loại bữa ăn", "warning");
      return;
    }

    try {
      setSubmitting(true);
      // Tính toán giá sơ bộ (Sử dụng parseFloat để tránh lỗi cộng chuỗi)
      const totalPrice = formData.ingredients.reduce((sum, item) => sum + parseFloat(item.price as any || 0), 0);

      const payload = {
        name: formData.name,
        typeId: formData.typeId,
        kcal: parseInt(formData.kcal) || 0,
        price: totalPrice,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        steps: formData.steps.filter(s => s.trim()),
        ingredients: formData.ingredients,
        image: formData.image
      };

      if (isEditing && editingId) {
        await mealServices.updateMeal(editingId, payload);
        showNotification("Cập nhật món ăn thành công!", "success");
      } else {
        await mealServices.createMeal(payload);
        showNotification("Tạo món ăn thành công!", "success");
      }

      setShowModal(false);
      resetForm();
      fetchMeals();
    } catch (e) {
      showNotification(isEditing ? "Lỗi khi cập nhật món ăn" : "Lỗi khi tạo món ăn", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', typeId: '', typeName: '', kcal: '', tags: '', ingredients: [], steps: [], image: ''
    });
    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-500">
            <Calendar size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Weekly Planner</h1>
        </div>
        <Button variant="secondary" size="icon">
          <MoreVertical size={20} />
        </Button>
      </header>

      {/* Horizontal Timeline */}
      <div ref={timelineRef} className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-1">
        {days.map((day) => (
          <button
            key={day.fullDate}
            onClick={() => setSelectedDateStr(day.fullDate)}
            className={`flex flex-col items-center justify-center min-w-[64px] py-4 rounded-2xl transition-all duration-300 ${day.active
                ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 scale-105'
                : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700'
              }`}
          >
            <span className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${day.active ? 'opacity-80' : 'text-slate-400'}`}>
              {day.label}
            </span>
            <span className="text-xl font-black">{day.date}</span>
            {day.active && <div className="mt-1 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
          </button>
        ))}
      </div>

      {/* Planning Feed */}
      <div className="space-y-6">
        {['Bữa sáng', 'Bữa trưa', 'Bữa tối', 'Ăn nhẹ'].map((section) => {
          const plan = plannedMeals.find(p => p.type_name === section);
          return (
            <section key={section}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">{section}</h3>
                {plan && <span className="text-xs font-medium text-emerald-500">Scheduled</span>}
              </div>

              {loading ? (
                <div className="h-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
              ) : plan ? (
                <Card
                  className={`flex items-center gap-4 p-4 cursor-pointer hover:border-emerald-500/50 transition-colors ${plan.is_completed ? 'opacity-60 bg-slate-50' : ''}`}
                  onClick={() => navigate(`/dish/${plan.meal_id}`)}
                >
                  <div className="h-16 w-16 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    {plan.image ? (
                      <img src={plan.image} alt={plan.meal_name} className="size-full object-cover" />
                    ) : (
                      <UtensilsCrossed size={24} className="text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold truncate ${plan.is_completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {plan.meal_name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                        {plan.kcal} kcal
                      </span>
                      <p className="text-xs font-semibold text-emerald-500">{formatCurrency(plan.estimated_price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleEditRecipe(e, plan.meal_id)}
                      className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"
                    >
                      <PlusCircle size={18} className="rotate-45" />
                    </button>
                    <button
                      onClick={(e) => handleDeletePlan(e, plan.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      onClick={(e) => handleToggleComplete(e, plan.id, plan.is_completed)}
                      className={`p-2 rounded-full transition-colors ${plan.is_completed ? 'text-emerald-500 bg-emerald-50' : 'text-slate-300'}`}
                    >
                      <CheckCircle size={24} />
                    </button>
                  </div>
                </Card>
              ) : (
                <div
                  className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
                  onClick={() => {
                    setPickerTarget({ section, date: selectedDateStr });
                    setShowPickerModal(true);
                  }}
                >
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <Plus size={24} className="text-emerald-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-500">Thêm món vào {section}</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">Chọn từ thực đơn có sẵn</p>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-24 right-6 z-30">
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="h-14 w-14 rounded-full shadow-2xl bg-emerald-500 hover:bg-emerald-600 border-4 border-white dark:border-slate-900 p-0"
        >
          <Plus size={32} />
        </Button>
      </div>

      {/* MODAL THÊM/SỬA MÓN ĂN MỚI */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />

          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold">{isEditing ? 'Chỉnh sửa món ăn' : 'Tạo món ăn mới'}</h2>
                <p className="text-sm text-slate-500">{isEditing ? 'Cập nhật lại công thức của bạn' : 'Thêm công thức nấu ăn của bạn'}</p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
              {/* Image Upload */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-full h-40 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden relative group">
                  {formData.image ? (
                    <>
                      <img src={formData.image} alt="meal-preview" className="size-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute top-2 right-2 size-8 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg"
                      >
                        <LucideX size={18} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <Camera size={32} className="mx-auto text-slate-400" />
                      <p className="text-xs font-bold text-slate-400 mt-2 uppercase">Chọn ảnh cho món ăn</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const base64 = await fileToBase64(file);
                        setFormData({ ...formData, image: base64 });
                      }
                    }}
                  />
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên món ăn*</label>
                  <input
                    required
                    type="text"
                    placeholder="Ví dụ: Phở bò, Cơm tấm..."
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                  />
                </div>

                <div className="relative z-[50]">
                  <label className="block text-sm font-medium mb-1">Loại bữa ăn*</label>
                  <div
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center cursor-pointer"
                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  >
                    <span className={formData.typeName ? 'text-slate-900 dark:text-white' : 'text-slate-400'}>
                      {formData.typeName || '-- Chọn loại bữa --'}
                    </span>
                    <Plus size={16} className={showTypeDropdown ? 'rotate-45' : ''} />
                  </div>
                  {showTypeDropdown && (
                    <div className="absolute z-[100] top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
                      {mealTypes.length > 0 ? mealTypes.map(type => (
                        <div
                          key={type.id}
                          className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-slate-900 dark:text-white"
                          onClick={() => {
                            setFormData({ ...formData, typeId: type.id, typeName: type.name });
                            setShowTypeDropdown(false);
                          }}
                        >
                          {type.name}
                        </div>
                      )) : (
                        <div className="p-3 text-sm text-slate-500 italic">Không có dữ liệu</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Kcal (ước tính)</label>
                    <input
                      type="number"
                      placeholder="500"
                      value={formData.kcal}
                      onChange={e => setFormData({ ...formData, kcal: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tags</label>
                    <input
                      type="text"
                      placeholder="Healthy, Quick"
                      value={formData.tags}
                      onChange={e => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Ingredients Section */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">Nguyên liệu thành phần</h3>
                  <span className="text-xs text-slate-500">{formData.ingredients.length} món</span>
                </div>

                {/* Search Ingredients */}
                <div className="relative z-[40]">
                  <div className="flex items-center gap-2 p-2 border border-emerald-500/30 rounded-xl bg-emerald-500/5">
                    <Search size={18} className="text-emerald-500 ml-2" />
                    <input
                      type="text"
                      placeholder="Tìm và thêm nguyên liệu..."
                      value={searchIng}
                      onChange={e => {
                        setSearchIng(e.target.value);
                        setShowIngDropdown(true);
                      }}
                      onFocus={() => setShowIngDropdown(true)}
                      className="flex-1 p-2 bg-transparent outline-none text-sm"
                    />
                  </div>

                  {showIngDropdown && searchIng && (
                    <div className="absolute z-[100] top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl max-h-40 overflow-y-auto">
                      {allIngredients.filter(i => i.name.toLowerCase().includes(searchIng.toLowerCase())).length > 0 ? 
                        allIngredients.filter(i => i.name.toLowerCase().includes(searchIng.toLowerCase())).map(ing => (
                        <div
                          key={ing.id}
                          className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-sm flex justify-between text-slate-900 dark:text-white"
                          onClick={() => handleAddIngredient(ing)}
                        >
                          <span>{ing.name}</span>
                          <span className="text-emerald-500">{formatCurrency(ing.price)}</span>
                        </div>
                      )) : (
                        <div className="p-3 text-sm text-slate-500 italic">Không tìm thấy kết quả</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Ingredients List */}
                <div className="space-y-3">
                  {formData.ingredients.length > 0 ? formData.ingredients.map(ing => (
                    <div key={ing.id} className="flex gap-4 items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-emerald-500/30 transition-all">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate text-slate-900 dark:text-white">{ing.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <input 
                            type="text"
                            value={ing.amount}
                            onChange={(e) => handleUpdateIngredientAmount(ing.id, e.target.value)}
                            className="w-20 p-1 text-xs rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-center"
                            placeholder="vd: 100g"
                          />
                          <span className="text-[10px] text-slate-400 italic">/{ing.baseUnit}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-emerald-500 text-sm">{formatCurrency(ing.price)}</p>
                          <p className="text-[9px] text-slate-400 uppercase tracking-tighter">Giá ước tính</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleRemoveIngredient(ing.id)}
                          className="p-1 px-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-6 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl">
                      <p className="text-xs text-slate-400">Chưa có nguyên liệu nào được chọn</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Steps Section */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">Các bước thực hiện</h3>
                  <Button type="button" variant="secondary" size="sm" onClick={handleAddStep} className="h-8 py-0">
                    <Plus size={14} className="mr-1" /> Thêm bước
                  </Button>
                </div>
                <div className="space-y-3">
                  {formData.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <span className="bg-emerald-500 text-white size-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-2">
                        {idx + 1}
                      </span>
                      <textarea
                        className="flex-1 p-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent min-h-[60px]"
                        placeholder="Mô tả bước thực hiện..."
                        value={step}
                        onChange={e => handleUpdateStep(idx, e.target.value)}
                      />
                      <button type="button" onClick={() => handleRemoveStep(idx)} className="text-slate-400 p-1 mt-2">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="sticky bottom-0 pt-4 bg-white dark:bg-slate-900">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-14 rounded-2xl shadow-xl shadow-emerald-500/20"
                >
                  {submitting ? 'Đang lưu...' : isEditing ? 'Cập nhật món ăn' : 'Lưu món ăn mới'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEAL PICKER MODAL (Chọn món đã có) */}
      {showPickerModal && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setShowPickerModal(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Chọn món cho {pickerTarget?.section}</h3>
                <p className="text-xs text-slate-500">Thực đơn của bạn ({allReadyMeals.length} món)</p>
              </div>
              <button onClick={() => setShowPickerModal(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/20">
              {allReadyMeals.map(meal => (
                <Card
                  key={meal.id}
                  className="p-3 flex items-center gap-3 border-transparent hover:border-emerald-500/50 transition-all cursor-pointer group"
                  onClick={() => handleAddToPlan(meal.id)}
                >
                  <div className="size-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                    {meal.image ? (
                      <img src={meal.image} alt={meal.name} className="size-full object-cover" />
                    ) : (
                      <UtensilsCrossed size={24} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 dark:text-white truncate">{meal.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{meal.type} • {meal.kcal} kcal</p>
                    <p className="text-xs font-bold text-emerald-500 mt-1">{formatCurrency(meal.price)}</p>
                  </div>
                  <div className="size-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all">
                    <Check size={20} className="text-transparent group-hover:text-white" />
                  </div>
                </Card>
              ))}
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="secondary"
                className="w-full h-12 rounded-xl gap-2 text-emerald-500 border-emerald-100"
                onClick={() => {
                  setShowPickerModal(false);
                  resetForm();
                  const type = mealTypes.find(t => t.name === pickerTarget?.section);
                  if (type) setFormData(prev => ({ ...prev, typeId: type.id, typeName: type.name }));
                  setShowModal(true);
                }}
              >
                <Plus size={18} />
                Tạo món mới hoàn toàn
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
