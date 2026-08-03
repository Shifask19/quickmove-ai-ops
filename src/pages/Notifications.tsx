import { Bell, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useStore } from '../store/useStore';
import { timeAgo, priorityMap } from '../lib/utils';

const typeIcon: Record<string, string> = {
  overdue_task: '⏰',
  missing_document: '📄',
  scheduling_conflict: '⚡',
  move_reminder: '📦',
  utility_pending: '🔌',
  customer_attention: '🚨',
  stage_completed: '✅',
  general: 'ℹ️',
};

export function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useStore();
  const navigate = useNavigate();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopNav title="Notifications" subtitle={`${unread} unread`} />
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-4">

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <span className="text-sm text-slate-600">{notifications.length} total notifications</span>
          </div>
          {unread > 0 && (
            <Button variant="ghost" size="sm" icon={<CheckCheck size={14} />} onClick={markAllNotificationsRead}>
              Mark all read
            </Button>
          )}
        </div>

        <Card padding="none">
          <div className="divide-y divide-slate-50">
            {notifications
              .sort((a, b) => (a.read ? 1 : -1) || b.createdAt.localeCompare(a.createdAt))
              .map(n => {
                const pm = priorityMap[n.priority];
                return (
                  <div
                    key={n.id}
                    className={`px-5 py-4 flex items-start gap-4 cursor-pointer hover:bg-slate-50 transition-colors ${!n.read ? 'bg-indigo-50/30' : ''}`}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.relatedType === 'relocation' && n.relatedId) navigate(`/relocations/${n.relatedId}`);
                      else if (n.relatedType === 'task') navigate('/tasks');
                    }}
                  >
                    <div className="text-2xl shrink-0 mt-0.5">{typeIcon[n.type] ?? 'ℹ️'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-semibold ${n.read ? 'text-slate-600' : 'text-slate-900'}`}>{n.title}</span>
                        <Badge label={pm.label} color={pm.color} bg={pm.bg} />
                        {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />}
                      </div>
                      <p className="text-sm text-slate-600 mt-0.5">{n.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.read && (
                      <Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); markNotificationRead(n.id); }}
                        className="shrink-0 text-xs text-slate-400">
                        Mark read
                      </Button>
                    )}
                  </div>
                );
              })}
          </div>
          {notifications.length === 0 && (
            <div className="py-16 text-center">
              <Bell size={48} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400">No notifications</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
