import React from 'react';
import { Menu, Search, Plus, Leaf, Fish, Pill, Package } from 'lucide-react';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { MOCK_INGREDIENTS } from '@/src/constants';
import { formatCurrency, fileToBase64 } from '@/src/utils';
import { pantryServices, PantryIngredient } from '@/src/services/pantryService';
import { useNotification } from '@/src/context/NotificationContext';
import { X as LucideX, Camera } from 'lucide-react';

export const Pantry = () => {
  const { showNotification } = useNotification();
  const categories = [
    { icon: Leaf, label: 'Vegetables', active: true },
    { icon: Fish, label: 'Meat' },
    { icon: Pill, label: 'Spices' },
    { icon: Package, label: 'Dry Goods' },
  ];

  const [ingredients, setIngredients] = React.useState<PantryIngredient[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  // State cho Modal
  const [showModal, setShowModal] = React.useState(false);
  const [categoriesList, setCategoriesList] = React.useState<{id: string, name: string}[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    categoryId: '',
    categoryName: '',
    price: '',
    amount: '',
    image: ''
  });
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    fetchIngredients();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await pantryServices.getCategories();
      if(res.data) setCategoriesList(res.data);
    } catch (e) {
      console.error("Lỗi lấy danh mục:", e);
    }
  };

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const response = await pantryServices.getPantryList();
      if (response && response.data) {
        setIngredients(response.data);
      } else {
        // Fallback or empty state
        setIngredients([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải nguyên liệu:', error);
      // Fallback
      setIngredients(MOCK_INGREDIENTS as any);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStock = async (ing: PantryIngredient) => {
    // Optimistic UI update
    const newStatus = !ing.inStock;
    setIngredients(prev => 
      prev.map(item => item.id === ing.id ? { ...item, inStock: newStatus } : item)
    );

    try {
      await pantryServices.toggleStockStatus(ing.id, newStatus);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      // Revert if failed
      setIngredients(prev => 
        prev.map(item => item.id === ing.id ? { ...item, inStock: ing.inStock } : item)
      );
    }
  };

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.name || !formData.categoryId) return showNotification("Vui lòng nhập tên và chọn danh mục!", "warning");

    try {
      setSubmitting(true);
      await pantryServices.addCustomIngredient({
        name: formData.name,
        categoryId: formData.categoryId,
        price: parseFloat(formData.price) || 0,
        amount: formData.amount || '1 unit',
        image: formData.image
      });
      
      // Reset & Refresh
      setFormData({ name: '', categoryId: '', categoryName: '', price: '', amount: '', image: '' });
      setShowModal(false);
      fetchIngredients();
      showNotification("Thêm nguyên liệu thành công!", "success");
    } catch (error) {
      console.error('Lỗi khi thêm nguyên liệu:', error);
      showNotification("Có lỗi xảy ra khi thêm nguyên liệu.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full pb-20">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-950 z-10">
        <Button variant="ghost" size="icon">
          <Menu size={24} />
        </Button>
        <h2 className="text-lg font-bold">Manage Pantry</h2>
        <Button variant="secondary" size="icon">
          <Search size={20} />
        </Button>
      </header>

      {/* Categories */}
      <div className="flex gap-3 p-4 overflow-x-auto no-scrollbar whitespace-nowrap">
        {categories.map((cat) => (
          <button
            key={cat.label}
            className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-all ${
              cat.active ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <cat.icon size={16} />
            <p className="text-sm font-semibold">{cat.label}</p>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-2 space-y-4">
        <div className="flex items-center justify-between mt-2">
          <h3 className="text-xl font-bold">Vegetables</h3>
          <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
            Market Trends: Stable
          </span>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-10 text-slate-500">Đang tải trữ lượng nguyên liệu...</div>
          ) : ingredients.length === 0 ? (
            <div className="text-center py-10 text-slate-500">Kho nguyên liệu trống hoặc đang trong Database.</div>
          ) : ingredients.map((ing) => (
            <Card key={ing.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <img 
                  src={ing.image || 'https://via.placeholder.com/150'} 
                  alt={ing.name} 
                  className="size-16 rounded-lg object-cover shadow-inner"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="text-base font-bold leading-tight">{ing.name}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
                    {formatCurrency(ing.price)} <span className="text-xs font-normal">/ {ing.amount}</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase">In Stock</p>
                <button 
                  onClick={() => handleToggleStock(ing)}
                  className={`relative h-8 w-14 rounded-full p-1 transition-colors ${
                    ing.inStock ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  <div className={`h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                    ing.inStock ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </Card>
          ))}
        </div>

        <div className="py-10 text-center">
          <Button 
            onClick={() => setShowModal(true)}
            variant="secondary" 
            className="bg-emerald-500/10 text-emerald-500 gap-2 rounded-full"
          >
            <Plus size={20} />
            Thêm nguyên liệu mới
          </Button>
        </div>
      </div>

      {/* Modal Thêm Nguyên Liệu */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Thêm nguyên liệu mới</h3>
            <form onSubmit={handleAddIngredient} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="flex flex-col items-center gap-2 mb-4">
                <div className="size-24 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden relative group">
                  {formData.image ? (
                    <>
                      <img src={formData.image} alt="preview" className="size-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, image: ''})}
                        className="absolute top-1 right-1 size-6 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg"
                      >
                        <LucideX size={14} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <Camera size={24} className="mx-auto text-slate-400" />
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Tải ảnh</p>
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
                        setFormData({...formData, image: base64});
                      }
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tên nguyên liệu</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                  placeholder="Ví dụ: Rau muống..."
                />
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium mb-1">Danh mục</label>
                <div 
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className={formData.categoryName ? 'text-slate-900 dark:text-white' : 'text-slate-400'}>
                    {formData.categoryName || '-- Chọn danh mục --'}
                  </span>
                  <div className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-60 top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                    {categoriesList.map(cat => (
                      <div 
                        key={cat.id}
                        className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-700 last:border-0"
                        onClick={() => {
                          setFormData({...formData, categoryId: cat.id, categoryName: cat.name});
                          setIsDropdownOpen(false);
                        }}
                      >
                        {cat.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Giá (vnđ)</label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Đơn vị</label>
                  <input 
                    type="text" 
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                    placeholder="bó, kg, túi..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="flex-1"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                  disabled={submitting}
                >
                  {submitting ? 'Đang lưu...' : 'Lưu lại'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
