import React from 'react';
import { ArrowLeft, Check, Edit2, PersonStanding, Wallet, Utensils, X, Plus } from 'lucide-react';
import { Button } from '@/src/components/Button';
import { userServices } from '@/src/services/apiService';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@/src/context/NotificationContext';

export const Profile = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [updating, setUpdating] = React.useState(false);

  // State cục bộ cho Form
  const [formData, setFormData] = React.useState({
    name: '',
    height: '',
    weight: '',
    grocery_limit: 1500000
  });

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId') || '00000000-0000-0000-0000-000000000000';
      const res = await userServices.getUserProfile(userId);
      if (res.data) {
        setProfile(res.data);
        setFormData({
          name: res.data.name || '',
          height: res.data.height || '',
          weight: res.data.weight || '',
          grocery_limit: parseFloat(res.data.grocery_limit) || 1500000
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const res = await userServices.updateProfile(userId, formData);
      if (res.success) {
        showNotification("Cập nhật thông tin thành công!", "success");
        setProfile(res.data);
      }
    } catch (error: any) {
      showNotification("Lỗi khi cập nhật: " + error.message, "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/auth');
  };

  return (
    <div className="flex flex-col min-h-screen pb-24 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex items-center justify-between p-4 sticky top-0 bg-white dark:bg-slate-950 z-10 border-b border-slate-100 dark:border-slate-800">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </Button>
        <h2 className="text-lg font-bold">Hồ sơ người dùng</h2>
        <Button 
          variant="secondary" 
          size="icon" 
          className="bg-emerald-500/10 text-emerald-500 disabled:opacity-50"
          onClick={handleUpdate}
          disabled={updating}
        >
          {updating ? (
             <div className="size-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Check size={20} />
          )}
        </Button>
      </header>

      <div className="flex-1 px-4 py-6 space-y-8">
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <div className="size-28 rounded-full bg-slate-100 animate-pulse" />
            <div className="h-6 w-32 bg-slate-100 animate-pulse rounded" />
          </div>
        ) : (
          <>
            {/* Profile Info */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="size-28 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-5xl font-black shadow-xl shadow-emerald-500/20">
                  {formData.name?.[0] || 'U'}
                </div>
                <button className="absolute bottom-0 right-0 bg-emerald-500 text-white p-2.5 rounded-2xl shadow-lg border-2 border-white dark:border-slate-950 hover:scale-110 active:scale-90 transition-all">
                  <Edit2 size={16} />
                </button>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{profile?.name}</h3>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest opacity-60">Thành viên Premium</p>
              </div>
            </div>

            {/* Personal Info Form */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <PersonStanding size={20} className="text-emerald-500" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Thông tin cá nhân</h3>
              </div>
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1">Họ và tên</p>
                  <input 
                    className="w-full h-14 rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-5 outline-none focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1.5">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1">Chiều cao (cm)</p>
                    <input 
                      type="number"
                      className="w-full h-14 rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-5 outline-none focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold" 
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1">Cân nặng (kg)</p>
                    <input 
                      type="number"
                      className="w-full h-14 rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-5 outline-none focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold" 
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Budget Settings */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Wallet size={20} className="text-emerald-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Thiết lập ngân sách</h3>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-3xl border-2 border-slate-50 dark:border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Hạn mức chi tiêu mỗi tháng</p>
              <p className="text-emerald-500 font-black">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(formData.grocery_limit)}</p>
            </div>
            <input 
              type="range" 
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
              min="500000" 
              max="5000000" 
              step="100000"
              value={formData.grocery_limit}
              onChange={(e) => setFormData({ ...formData, grocery_limit: parseInt(e.target.value) })}
            />
            <div className="flex justify-between mt-3 text-[10px] text-slate-400 uppercase font-black tracking-widest">
              <span>500k</span>
              <span>5tr</span>
            </div>
          </div>
        </section>

        {/* Taste Preferences */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Utensils size={20} className="text-emerald-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Khẩu vị & Dị ứng</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1 mb-2">Dị ứng thực phẩm</p>
              <div className="flex flex-wrap gap-2">
                {['Đậu phộng', 'Hải sản'].map(item => (
                  <span key={item} className="px-4 py-2 bg-emerald-500/10 text-emerald-500 border-2 border-emerald-500/5 rounded-2xl text-xs font-bold flex items-center gap-2">
                    {item} <X size={14} className="cursor-pointer opacity-50 hover:opacity-100" />
                  </span>
                ))}
                <button className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 text-slate-400 rounded-2xl text-xs font-bold flex items-center gap-2 border-2 border-dashed border-slate-100 dark:border-slate-800">
                  <Plus size={14} /> Thêm mới
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="pt-6">
          <Button 
            variant="outline" 
            className="w-full h-14 rounded-2xl border-red-100 text-red-500 hover:bg-red-50 gap-2 mb-4 font-bold border-2"
            onClick={handleLogout}
          >
            Đăng xuất tài khoản
          </Button>
        </div>
      </div>
    </div>
  );
};
