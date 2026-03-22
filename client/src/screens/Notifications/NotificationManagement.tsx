import React from 'react';
import { Bell, User, Send, Trash2, ArrowLeft, CheckCircle, Search, Mail, MessageSquare } from 'lucide-react';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { notificationServices, NotificationItem } from '@/src/services/notificationService';
import { userServices } from '@/src/services/apiService';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@/src/context/NotificationContext';
import { formatCurrency } from '@/src/utils';

export const NotificationManagement = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  // State cho bộ lọc / tìm kiếm user
  const [searchTerm, setSearchTerm] = React.useState('');

  // State cho Form tạo mới
  const [formData, setFormData] = React.useState({
    userId: '',
    title: '',
    message: ''
  });

  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showUsers, setShowUsers] = React.useState(false);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [notifRes, usersRes] = await Promise.all([
        notificationServices.getAll(),
        userServices.getAllUsers()
      ]);
      if (notifRes.data) setNotifications(notifRes.data);
      if (usersRes.data) setUsers(usersRes.data);
    } catch (e) {
      console.error(e);
      showNotification("Lỗi khi tải dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userId || !formData.title || !formData.message) {
      showNotification("Vui lòng nhập đầy đủ thông tin", "warning");
      return;
    }

    try {
      setSubmitting(true);
      await notificationServices.create({
        user_id: formData.userId,
        title: formData.title,
        message: formData.message
      });
      showNotification("Gửi thông báo thành công!", "success");
      setShowCreateModal(false);
      setFormData({ userId: '', title: '', message: '' });
      fetchData();
    } catch (e) {
      showNotification("Lỗi khi gửi thông báo", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Xóa thông báo này?")) {
      try {
        await notificationServices.delete(id);
        setNotifications(prev => prev.filter(n => n.id !== id));
        showNotification("Đã xóa thông báo", "success");
      } catch (e) {
        showNotification("Lỗi khi xóa", "error");
      }
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </Button>
          <h2 className="text-xl font-black">Quản lý Thông báo</h2>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-4 text-xs font-bold flex items-center gap-2"
        >
          <Send size={14} />
          Gửi mới
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto no-scrollbar">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Đang tải danh sách thông báo...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 text-slate-400">Chưa có thông báo nào được gửi.</div>
        ) : notifications.map((notif) => (
          <Card key={notif.id} className="p-4 border-l-4 border-emerald-500">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{notif.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                    Tới: {notif.recipient_name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(notif.created_at).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(notif.id)}
                className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {notif.message}
            </p>
            {notif.is_read && (
              <div className="flex items-center gap-1 mt-2">
                <CheckCircle size={10} className="text-emerald-500" />
                <span className="text-[9px] text-emerald-500 font-bold uppercase">Đã đọc</span>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Modal Tạo đề xuất / Gửi thông báo */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-md p-6 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-xl font-black mb-4">Gửi thông báo tùy chỉnh</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Chọn User */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1">Người nhận</label>
                <div className="relative">
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none">
                    <Search size={18} className="text-slate-400" />
                    <input
                      type="text"
                      placeholder="Tìm theo tên hoặc email..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowUsers(true);
                      }}
                      onFocus={() => setShowUsers(true)}
                      className="flex-1 bg-transparent outline-none text-sm"
                    />
                  </div>

                  {showUsers && searchTerm && (
                    <div className="absolute z-[10] top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl max-h-40 overflow-y-auto no-scrollbar">
                      {filteredUsers.map(u => (
                        <div
                          key={u.id}
                          onClick={() => {
                            setFormData({ ...formData, userId: u.id });
                            setSearchTerm(u.name);
                            setShowUsers(false);
                          }}
                          className={`p-3 border-b dark:border-slate-700 last:border-0 hover:bg-emerald-500/5 cursor-pointer ${formData.userId === u.id ? 'bg-emerald-500/10' : ''
                            }`}
                        >
                          <p className="text-sm font-bold">{u.name}</p>
                          <p className="text-[10px] text-slate-400">{u.email}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1">Tiêu đề</label>
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <Mail size={18} className="text-slate-400" />
                  <input
                    type="text"
                    placeholder="VD: Cập nhật thực đơn mới"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1">Nội dung</label>
                <div className="flex gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <MessageSquare size={18} className="text-slate-400 mt-1" />
                  <textarea
                    rows={4}
                    placeholder="Nhập nội dung thông báo..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="flex-1 bg-transparent outline-none text-sm resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowCreateModal(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-emerald-500 text-white font-bold"
                >
                  {submitting ? "Đang gửi..." : "Gửi thông báo"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
