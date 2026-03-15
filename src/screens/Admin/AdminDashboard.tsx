import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Trash2, Shield, User, Power, LogOut, ChevronRight, X, Calendar, Activity, Mail, Scale, Ruler, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { ConfirmModal } from '@/src/components/ConfirmModal';
import { fetchApi } from '@/src/services/apiService';
import { useNotification } from '@/src/context/NotificationContext';
import { formatDateVN } from '@/src/utils';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
}

export const AdminDashboard = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
    type: 'warning'
  });
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchApi<any>('/users');
      if (res.success) {
        setUsers(res.data);
      }
    } catch (error: any) {
      showNotification(error.message || 'Lỗi tải danh sách người dùng', 'error');
      // Nếu không phải admin, có lẽ sẽ bị lỗi 403
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user: UserData) => {
    const action = user.is_active ? 'khóa' : 'mở khóa';

    setConfirmConfig({
      isOpen: true,
      title: `${action === 'khóa' ? 'Khóa' : 'Mở khóa'} tài khoản`,
      message: `Bạn có chắc muốn ${action} tài khoản ${user.email}? Người dùng sẽ ${action === 'khóa' ? 'không thể' : 'có thể'} đăng nhập vào hệ thống.`,
      type: action === 'khóa' ? 'danger' : 'info',
      onConfirm: async () => {
        try {
          const res = await fetchApi<any>(`/users/${user.id}`, {
            method: 'PUT',
            body: JSON.stringify({
              name: user.name,
              is_active: !user.is_active
            })
          });
          if (res.success) {
            showNotification(`Đã ${!user.is_active ? 'mở khóa' : 'khóa'} tài khoản thành công`, 'success');
            loadUsers();
            setSelectedUser(prev => prev?.id === user.id ? ({ ...prev, is_active: !user.is_active }) : prev);
          }
        } catch (error: any) {
          showNotification(error.message || 'Lỗi cập nhật trạng thái', 'error');
        } finally {
          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleDeleteUser = async (id: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Xóa vĩnh viễn',
      message: 'Hành động này không thể hoàn tác. Mọi dữ liệu liên quan đến người dùng này sẽ bị xóa sạch khỏi hệ thống.',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetchApi<any>(`/users/${id}`, { method: 'DELETE' });
          if (res.success) {
            showNotification('Đã xóa người dùng thành công', 'success');
            loadUsers();
            setSelectedUser(null);
          }
        } catch (error: any) {
          showNotification(error.message || 'Lỗi khi xóa người dùng', 'error');
        } finally {
          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/auth');
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Admin Header */}
      <div className="p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Quản lý người dùng</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admin Dashboard</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={22} />
          </button>
        </div>

        {/* Search & Actions */}
        <div className="flex gap-3">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Tìm theo tên, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 ring-emerald-500/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="p-6 grid grid-cols-2 gap-4">
        <Card className="p-4 bg-emerald-500 text-white border-none shadow-lg shadow-emerald-500/20">
          <p className="text-xs font-bold opacity-80 uppercase">Tổng User</p>
          <p className="text-2xl font-black mt-1">{users.length}</p>
        </Card>
        <Card className="p-4 bg-white dark:bg-slate-900 border-none">
          <p className="text-xs font-bold text-slate-400 uppercase">Đang hoạt động</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{users.filter(u => u.is_active).length}</p>
        </Card>
      </div>

      {/* User List */}
      <div className="px-6 pb-6 flex-1 space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Danh sách tài khoản</h3>

        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-3xl" />
          ))
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center">
            <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <User size={32} />
            </div>
            <p className="text-slate-500 font-medium">Không tìm thấy người dùng nào</p>
          </div>
        ) : filteredUsers.map((user) => (
          <Card
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`p-4 border-none shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-95 ${!user.is_active ? 'bg-slate-100 dark:bg-slate-800/50 grayscale' : 'bg-white dark:bg-slate-900 border-l-4 border-l-emerald-500'}`}
          >
            <div className="flex items-start gap-4">
              <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${user.role === 'admin' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {user.role === 'admin' ? <Shield size={24} /> : <User size={24} />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-white truncate">{user.name}</h4>
                  {user.role === 'admin' && <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase rounded">Admin</span>}
                  {!user.is_active && <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-500 text-[8px] font-black uppercase rounded">Bị khóa</span>}
                </div>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-slate-400 italic flex items-center gap-1">
                    <Calendar size={10} /> {formatDateVN(user.created_at)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-center" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => handleToggleStatus(user)}
                  className={`size-10 rounded-xl flex items-center justify-center transition-colors ${user.is_active ? 'bg-slate-100 text-slate-400 hover:bg-rose-500 hover:text-white' : 'bg-rose-500 text-white hover:bg-rose-600'}`}
                  title={user.is_active ? 'Khóa' : 'Mở khóa'}
                >
                  <Power size={18} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[40px] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className={`size-16 rounded-[24px] flex items-center justify-center ${selectedUser.role === 'admin' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {selectedUser.role === 'admin' ? <Shield size={32} /> : <User size={32} />}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">{selectedUser.name}</h2>
                    <p className="text-sm text-slate-400 font-medium">{selectedUser.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Shield size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Quyền hạn</span>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white capitalize">{selectedUser.role}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Activity size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Trạng thái</span>
                  </div>
                  <p className={`font-bold ${selectedUser.is_active ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {selectedUser.is_active ? 'Đang hoạt động' : 'Đã khóa'}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Calendar size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Ngày tham gia</span>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white">{formatDateVN(selectedUser.created_at)}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Wallet size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Hạn mức chi</span>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white">{(selectedUser as any).grocery_limit?.toLocaleString() || 0}đ</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleToggleStatus(selectedUser)}
                  className={`flex-1 h-14 rounded-2xl border-2 font-bold ${selectedUser.is_active ? 'border-rose-100 dark:border-rose-500/20 text-rose-500' : 'border-emerald-100 dark:border-emerald-500/20 text-emerald-500'}`}
                >
                  <Power size={18} className="mr-2" />
                  {selectedUser.is_active ? 'Khóa tài khoản' : 'Mở khóa'}
                </Button>
                <Button
                  onClick={() => handleDeleteUser(selectedUser.id)}
                  className="size-14 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border-none"
                >
                  <Trash2 size={24} />
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Popup */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        confirmText="Đồng ý"
        cancelText="Hủy bỏ"
      />
    </div>
  );
};
