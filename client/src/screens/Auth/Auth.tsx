import React from 'react';
import { Mail, Lock, User, ArrowRight, Github, Chrome, Eye, EyeOff, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/src/components/Button';
import { Card } from '@/src/components/Card';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchApi } from '@/src/services/apiService';
import { useNotification } from '@/src/context/NotificationContext';

export const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  
  const from = location.state?.from?.pathname || '/';
  const [isLogin, setIsLogin] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Xác định endpoint dựa trên chế độ Đăng nhập hay Đăng ký
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      
      const res = await fetchApi<any>(endpoint, {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (res.success && res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.user.id);
        localStorage.setItem('role', res.user.role);
        showNotification(isLogin ? "Chào mừng trở lại!" : "Đăng ký thành công!", "success");
        
        // Admin chỉ được vào màn hình admin
        if (res.user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (error: any) {
      showNotification(error.message || "Lỗi xử lý", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center px-2 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Brand Section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center size-20 rounded-[24px] bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-2xl shadow-emerald-500/20 mb-6 group transition-transform hover:scale-110 active:scale-95">
          <UtensilsCrossed size={40} className="group-hover:rotate-12 transition-transform" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">MealApp</h1>
        <p className="text-slate-500 text-sm font-medium mt-2">Quản lý bữa ăn thông minh & tiết kiệm</p>
      </div>

      <Card className="p-8 border-none shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 rounded-[32px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isLogin ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}
          </h2>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold text-[10px] opacity-70">
            {isLogin ? 'Đăng nhập để điều khiển bữa ăn' : 'Bắt đầu hành trình ăn uống khoa học'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl outline-none transition-all font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                placeholder="example@gmail.com"
                className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl outline-none transition-all font-medium"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Mật khẩu</label>
              {isLogin && (
                <button type="button" className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline">
                  Quên mật khẩu?
                </button>
              )}
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full h-14 pl-12 pr-12 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl outline-none transition-all font-medium"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button 
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25 text-white gap-2 mt-4 active:scale-95 transition-all"
          >
            {loading ? (
              <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span className="font-bold">{isLogin ? 'Đăng nhập' : 'Đăng ký tài khoản'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
          </div>
          <span className="relative px-4 bg-white dark:bg-slate-900 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hoặc với</span>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-12 rounded-xl gap-2 border-slate-200 dark:border-slate-800 shadow-sm active:scale-95 transition-all">
            <Chrome size={18} className="text-red-500" />
            <span className="text-xs font-bold">Google</span>
          </Button>
          <Button variant="outline" className="h-12 rounded-xl gap-2 border-slate-200 dark:border-slate-800 shadow-sm active:scale-95 transition-all">
            <Github size={18} className="text-slate-900 dark:text-white" />
            <span className="text-xs font-bold">Github</span>
          </Button>
        </div>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-slate-500 text-sm">
          {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 font-black text-emerald-500 hover:underline transition-all"
          >
            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
          </button>
        </p>
      </div>
    </div>
  );
};
