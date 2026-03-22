import React from 'react';
import { Menu, Search, Plus, Leaf, Fish, Pill, Package, CheckCircle, Trash2, Camera, Loader2, X as LucideX } from 'lucide-react';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { MOCK_INGREDIENTS } from '@/src/constants';
import { formatCurrency, fileToBase64 } from '@/src/utils';
import { pantryServices, PantryIngredient } from '@/src/services/pantryService';
import { useNotification } from '@/src/context/NotificationContext';

export const Pantry = () => {
  const { showNotification } = useNotification();
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(null);

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
  
  // State quản lý danh mục
  const [showCatModal, setShowCatModal] = React.useState(false);
  const [newCatName, setNewCatName] = React.useState('');
  const [editingCatId, setEditingCatId] = React.useState<string | null>(null);

  // State cho Quét hóa đơn
  const [isScanning, setIsScanning] = React.useState(false);
  const [scannedItems, setScannedItems] = React.useState<{ description: string, quantity: number, unit_price: number, total_amount: number, selected: boolean }[]>([]);
  const [showScanModal, setShowScanModal] = React.useState(false);

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

  const handleAddCategory = async () => {
    if (!newCatName) return;
    try {
      if (editingCatId) {
        await pantryServices.updateCategory(editingCatId, newCatName);
        showNotification("Cập nhật danh mục thành công", "success");
      } else {
        await pantryServices.createCategory(newCatName);
        showNotification("Thêm danh mục thành công", "success");
      }
      setNewCatName('');
      setEditingCatId(null);
      fetchCategories();
    } catch (error) {
      showNotification("Lỗi quản lý danh mục", "error");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("Xóa danh mục này có thể ảnh hưởng đến nguyên liệu hiện có. Bạn chắc chứ?")) {
      try {
        await pantryServices.deleteCategory(id);
        if (selectedCategoryId === id) setSelectedCategoryId(null);
        fetchCategories();
        showNotification("Đã xóa danh mục", "success");
      } catch (error) {
        showNotification("Lỗi khi xóa danh mục", "error");
      }
    }
  };

  const handleScanReceipt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsScanning(true);
      const base64 = await fileToBase64(file);
      const res = await pantryServices.scanReceipt(base64);
      
      if (res.data) {
        setScannedItems(res.data.map(item => ({ ...item, selected: true })));
        setShowScanModal(true);
      } else {
        showNotification("Không tìm thấy thông tin trên hóa đơn", "warning");
      }
    } catch (error) {
      console.error(error);
      showNotification("Lỗi khi quét hóa đơn", "error");
    } finally {
      setIsScanning(false);
    }
  };

  const handleImportScanned = async () => {
    const selectedItems = scannedItems.filter(i => i.selected);
    if (selectedItems.length === 0) return;

    try {
      setSubmitting(true);
      // Giả định: Các món quét được sẽ được thêm vào danh mục "Chưa phân loại" hoặc yêu cầu chọn?
      // Để đơn giản, tôi sẽ thêm vào danh mục đầu tiên tìm thấy hoặc mặc định.
      const defaultCat = categoriesList[0]?.id;
      
      for (const item of selectedItems) {
        await pantryServices.addCustomIngredient({
          name: item.description,
          categoryId: defaultCat || '',
          price: item.unit_price,
          amount: `${item.quantity} unit`,
          image: ''
        });
      }

      showNotification(`Đã thêm ${selectedItems.length} nguyên liệu vào kho`, "success");
      setShowScanModal(false);
      fetchIngredients();
    } catch (error) {
      showNotification("Lỗi khi nhập dữ liệu", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredIngredients = selectedCategoryId 
    ? ingredients.filter(ing => ing.categoryId === selectedCategoryId)
    : ingredients;

  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('veg') || lower.includes('rau')) return <Leaf size={14} />;
    if (lower.includes('meat') || lower.includes('thịt') || lower.includes('cá')) return <Fish size={14} />;
    if (lower.includes('spice') || lower.includes('gia vị')) return <Pill size={14} />;
    return <Package size={14} />;
  };

  const currentCategoryName = selectedCategoryId 
    ? categoriesList.find(c => c.id === selectedCategoryId)?.name || 'Kho nguyên liệu'
    : 'Kho nguyên liệu';

  return (
    <div className="flex flex-col h-full pb-20">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-950 z-10">
        <label className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer hover:bg-emerald-500/10 transition-colors">
          {isScanning ? <Loader2 size={24} className="animate-spin text-emerald-500" /> : <Camera size={24} className="text-slate-600 dark:text-slate-400" />}
          <input type="file" accept="image/*" className="hidden" onChange={handleScanReceipt} disabled={isScanning} />
        </label>
        <h2 className="text-lg font-bold">Kho nguyên liệu</h2>
        <Button onClick={() => setShowModal(true)} variant="secondary" size="icon" className="bg-emerald-500 text-white hover:bg-emerald-600">
          <Plus size={20} />
        </Button>
      </header>

      {/* Categories Toolbar */}
      <div className="flex items-center gap-2 p-4 pt-2">
        <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`flex h-9 shrink-0 items-center justify-center gap-2 rounded-full px-5 transition-all text-xs font-bold ${
              !selectedCategoryId ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}
          >
            <Package size={14} />
            Tất cả
          </button>
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`flex h-9 shrink-0 items-center justify-center gap-2 rounded-full px-5 transition-all text-xs font-bold ${
                selectedCategoryId === cat.id ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {getCategoryIcon(cat.name)}
              <span className="capitalize">{cat.name}</span>
            </button>
          ))}
        </div>
        <button 
          onClick={() => setShowCatModal(true)}
          className="size-9 shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-emerald-500 transition-colors"
          title="Quản lý danh mục"
        >
          <Menu size={16} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-2 space-y-4">
        <div className="flex items-center justify-between mt-2">
          <h3 className="text-xl font-bold">{currentCategoryName}</h3>
          <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
            {filteredIngredients.length} món
          </span>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-10 text-slate-500">Đang tải trữ lượng nguyên liệu...</div>
          ) : filteredIngredients.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              {selectedCategoryId ? 'Không có nguyên liệu nào trong danh mục này.' : 'Kho nguyên liệu trống.'}
            </div>
          ) : filteredIngredients.map((ing) => (
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
              
              <div className="relative z-[50]">
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
                  <div className="absolute z-[100] top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                    {categoriesList.length > 0 ? categoriesList.map(cat => (
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
                    )) : (
                      <div className="p-3 text-sm text-slate-500 italic">Chưa có danh mục nào</div>
                    )}
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
                    placeholder="vd: 1kg, 100g, 1 bó..."
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
      {/* Modal Quản lý Danh mục */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-sm p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Quản lý danh mục</h3>
              <button onClick={() => { setShowCatModal(false); setEditingCatId(null); setNewCatName(''); }} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <LucideX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  placeholder="Tên danh mục mới..."
                  className="flex-1 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-sm placeholder:text-slate-400 focus:ring-2 ring-emerald-500/20"
                />
                <button 
                  onClick={handleAddCategory}
                  className="size-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  {editingCatId ? <CheckCircle size={24} /> : <Plus size={24} />}
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-2 no-scrollbar">
                {categoriesList.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl group border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                    <span className="font-bold text-slate-700 dark:text-slate-200">{cat.name}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setEditingCatId(cat.id); setNewCatName(cat.name); }}
                        className="p-2 text-slate-400 hover:text-emerald-500"
                      >
                        <Menu size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-2 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal Kết quả Quét Hóa Đơn */}
      {showScanModal && (
        <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Dữ liệu từ hóa đơn</h3>
                <p className="text-xs text-slate-400">Chọn nguyên liệu bạn muốn thêm vào kho</p>
              </div>
              <button onClick={() => setShowScanModal(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <LucideX size={20} />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto space-y-3 pr-2 no-scrollbar mb-6">
              {scannedItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                    item.selected ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-50 dark:bg-slate-800/50 border-transparent'
                  }`}
                  onClick={() => {
                    const newItems = [...scannedItems];
                    newItems[idx].selected = !newItems[idx].selected;
                    setScannedItems(newItems);
                  }}
                >
                  <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-colors ${
                    item.selected ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
                  }`}>
                    {item.selected && <CheckCircle size={12} className="text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{item.description}</p>
                    <p className="text-[10px] text-slate-500">
                      {item.quantity} x {formatCurrency(item.unit_price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-700 dark:text-slate-200">
                      {formatCurrency(item.total_amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="ghost" onClick={() => setShowScanModal(false)}>Hủy</Button>
              <Button 
                onClick={handleImportScanned}
                disabled={submitting || scannedItems.filter(i => i.selected).length === 0}
                className="bg-emerald-500 text-white font-bold"
              >
                {submitting ? 'Đang nhập...' : `Thêm (${scannedItems.filter(i => i.selected).length})`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
