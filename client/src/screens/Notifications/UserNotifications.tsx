import React from 'react';
import { ArrowLeft, Bell, BellOff, CheckCircle, Trash2, Calendar, MailOpen } from 'lucide-react';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { notificationServices, NotificationItem } from '@/src/services/notificationService';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@/src/context/NotificationContext';

export const UserNotifications = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchMyNotifications();
  }, []);

  const fetchMyNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationServices.getMy();
      if (res.data) setNotifications(res.data);
    } catch (e) {
      console.error(e);
      showNotification("Lỗi tải thông báo", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    try {
      await notificationServices.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </Button>
          <h2 className="text-xl font-black">Thông báo</h2>
        </div>
        <div className="size-10 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
          <Bell size={20} />
        </div>
      </header>

      {/* List */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto no-scrollbar">
        {loading ? (
          <div className="text-center py-20 flex flex-col items-center gap-3">
            <div className="size-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Đang tải...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center gap-4">
            <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300">
              <BellOff size={40} />
            </div>
            <div>
              <p className="text-slate-900 dark:text-white font-black text-lg">Hộp thư trống</p>
              <p className="text-sm text-slate-400">Bạn hiện không có lời nhắn nào mới.</p>
            </div>
          </div>
        ) : (
          notifications.map((notif) => (
            <Card
              key={notif.id}
              onClick={() => handleMarkAsRead(notif.id, notif.is_read)}
              className={`p-5 border-none bg-white dark:bg-slate-900 shadow-sm transition-all cursor-pointer relative overflow-hidden group active:scale-95 ${!notif.is_read ? 'border-l-4 border-l-emerald-500' : ''
                }`}
            >
              {!notif.is_read && (
                <div className="absolute top-0 right-0 p-2">
                  <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                </div>
              )}

              <div className="flex gap-4">
                <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${notif.is_read ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  }`}>
                  {notif.is_read ? <MailOpen size={24} /> : <Bell size={24} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm font-black truncate ${notif.is_read ? 'text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-bold ml-2">
                      {new Date(notif.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed line-clamp-2 ${notif.is_read ? 'text-slate-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {notif.message}
                  </p>

                  {notif.is_read && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                      <CheckCircle size={12} className="text-emerald-500" />
                      <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Đã xem</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
