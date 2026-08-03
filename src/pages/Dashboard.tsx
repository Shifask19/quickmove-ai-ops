import { useNavigate } from 'react-router-dom';
import {
  Route, Clock, CheckSquare, CalendarClock, AlertTriangle,
  TrendingUp, Users, FileX, ArrowRight, Zap
} from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Avatar } from '../components/ui/Avatar';
import { useStore } from '../store/useStore';
import { relocationStatusMap, priorityMap, formatDate, daysUntil, formatCurrency, getNextAction } from '../lib/utils';
import { smartAlerts } from '../data/mockData';

function MetricCard({ label, value, icon, color, sub, onClick }: {
  label: string; value: number | string; icon: React.ReactNode;
  color: string; sub?: string; onClick?: () => void;
}) {
  return (
    <Card hover={!!onClick} onClick={onClick} className="flex items-start gap-4">
      <div className={`p-2.5 rounded-xl ${color}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </Card>
  );
}

export function Dashboard() {
  const { relocations, tasks, notifications } = useStore();
  const navigate = useNavigate();

  const active = relocations.filter(r => !['completed', 'cancelled'].includes(r.status));
  const delayed = relocations.filter(r => {
    const days = daysUntil(r.moveDate);
    return days < 7 && days >= 0 && !['completed', 'cancelled', 'packing_moving'].includes(r.status);
  });
  const overdueTaskCount = tasks.filter(t => t.status === 'overdue').length;
  const upcomingMoves = relocations.filter(r => {
    const d = daysUntil(r.moveDate);
    return d >= 0 && d <= 14 && !['completed', 'cancelled'].includes(r.status);
  });
  const highPriority = relocations.filter(r => (r.priority === 'high' || r.priority === 'urgent') && !['completed', 'cancelled'].includes(r.status));
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const urgentRelocations = active
    .sort((a, b) => {
      const po = { urgent: 0, high: 1, medium: 2, low: 3 };
      return po[a.priority] - po[b.priority];
    })
    .slice(0, 5);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopNav title="Dashboard" subtitle="Monday, August 3, 2026" />
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-6">

        {/* Smart Alert Banner */}
        {smartAlerts.slice(0, 2).map(alert => (
          <div
            key={alert.id}
            className={`flex items-start gap-3 p-4 rounded-xl border ${
              alert.severity === 'error'
                ? 'bg-red-50 border-red-200'
                : 'bg-amber-50 border-amber-200'
            }`}
          >
            <AlertTriangle size={18} className={alert.severity === 'error' ? 'text-red-500 mt-0.5 shrink-0' : 'text-amber-500 mt-0.5 shrink-0'} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${alert.severity === 'error' ? 'text-red-800' : 'text-amber-800'}`}>{alert.title}</p>
              <p className={`text-xs mt-0.5 ${alert.severity === 'error' ? 'text-red-600' : 'text-amber-600'}`}>{alert.message}</p>
            </div>
            <button
              onClick={() => navigate(alert.relatedType === 'relocation' ? `/relocations/${alert.relatedId}` : `/${alert.relatedType}s`)}
              className={`text-xs font-medium shrink-0 px-3 py-1.5 rounded-lg ${
                alert.severity === 'error' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              {alert.actionLabel}
            </button>
          </div>
        ))}

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard label="Active Relocations" value={active.length} icon={<Route size={20} className="text-indigo-600" />} color="bg-indigo-50" onClick={() => navigate('/relocations')} />
          <MetricCard label="Delayed / At Risk" value={delayed.length} icon={<Clock size={20} className="text-red-500" />} color="bg-red-50" sub="Move in <7 days" onClick={() => navigate('/relocations')} />
          <MetricCard label="Overdue Tasks" value={overdueTaskCount} icon={<CheckSquare size={20} className="text-amber-500" />} color="bg-amber-50" onClick={() => navigate('/tasks')} />
          <MetricCard label="Upcoming Moves" value={upcomingMoves.length} icon={<CalendarClock size={20} className="text-teal-600" />} color="bg-teal-50" sub="Next 14 days" onClick={() => navigate('/relocations')} />
          <MetricCard label="High Priority" value={highPriority.length} icon={<AlertTriangle size={20} className="text-orange-500" />} color="bg-orange-50" onClick={() => navigate('/relocations')} />
          <MetricCard label="Unread Alerts" value={unreadNotifications} icon={<TrendingUp size={20} className="text-violet-600" />} color="bg-violet-50" onClick={() => navigate('/notifications')} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Relocations */}
          <div className="lg:col-span-2">
            <Card padding="none">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">Active Relocations</h2>
                <button onClick={() => navigate('/relocations')} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                  View all <ArrowRight size={12} />
                </button>
              </div>
              <div className="divide-y divide-slate-50">
                {urgentRelocations.map(r => {
                  const status = relocationStatusMap[r.status];
                  const priority = priorityMap[r.priority];
                  const daysLeft = daysUntil(r.moveDate);
                  return (
                    <div
                      key={r.id}
                      className="px-5 py-4 hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/relocations/${r.id}`)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar name={r.customerName} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-900 text-sm">{r.customerName}</span>
                            <Badge label={priority.label} color={priority.color} bg={priority.bg} dot dotColor={priority.dot} />
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{r.fromCity} → {r.toCity}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge label={status.label} color={status.color} bg={status.bg} />
                            <span className={`text-xs font-medium ${daysLeft < 3 ? 'text-red-600' : daysLeft < 7 ? 'text-amber-600' : 'text-slate-500'}`}>
                              {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `Move in ${daysLeft}d`}
                            </span>
                          </div>
                          <div className="mt-2">
                            <ProgressBar value={r.completionPercentage} showLabel size="sm" />
                          </div>
                          <p className="text-xs text-slate-400 mt-1.5 italic">▶ {getNextAction(r.status)}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-slate-700">{formatCurrency(r.estimatedBudget)}</p>
                          <p className="text-xs text-slate-400">{formatDate(r.moveDate)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Overdue Tasks */}
            <Card padding="none">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900 text-sm">Overdue Tasks</h2>
                <button onClick={() => navigate('/tasks')} className="text-xs text-indigo-600 hover:underline">View all</button>
              </div>
              <div className="divide-y divide-slate-50">
                {tasks.filter(t => t.status === 'overdue').slice(0, 4).map(task => (
                  <div key={task.id} className="px-5 py-3 hover:bg-slate-50 cursor-pointer" onClick={() => navigate('/tasks')}>
                    <p className="text-xs font-medium text-slate-800 leading-snug">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-red-600 font-medium">{task.customerName}</span>
                      <span className="text-xs text-slate-400">• {task.assignedToName}</span>
                    </div>
                  </div>
                ))}
                {tasks.filter(t => t.status === 'overdue').length === 0 && (
                  <div className="px-5 py-6 text-center text-slate-400 text-xs">No overdue tasks 🎉</div>
                )}
              </div>
            </Card>

            {/* Quick stats */}
            <Card>
              <h2 className="font-semibold text-slate-900 text-sm mb-4">Team Workload</h2>
              <div className="space-y-3">
                {[
                  { name: 'Rahul Verma', count: 5, max: 6 },
                  { name: 'Sneha Patel', count: 4, max: 6 },
                  { name: 'Arjun Nair', count: 3, max: 6 },
                ].map(m => (
                  <div key={m.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-700">{m.name}</span>
                      <span className={`text-xs font-semibold ${m.count >= 5 ? 'text-red-600' : 'text-slate-600'}`}>{m.count} active</span>
                    </div>
                    <ProgressBar
                      value={(m.count / m.max) * 100}
                      color={m.count >= 5 ? 'bg-red-500' : m.count >= 4 ? 'bg-amber-500' : 'bg-green-500'}
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Upcoming moves */}
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <CalendarClock size={15} className="text-indigo-500" />
                <h2 className="font-semibold text-slate-900 text-sm">Upcoming Moves</h2>
              </div>
              <div className="space-y-2.5">
                {upcomingMoves.slice(0, 3).map(r => {
                  const d = daysUntil(r.moveDate);
                  return (
                    <div key={r.id} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1.5 rounded-lg" onClick={() => navigate(`/relocations/${r.id}`)}>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{r.customerName}</p>
                        <p className="text-xs text-slate-500">{r.fromCity} → {r.toCity}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-bold ${d <= 3 ? 'text-red-600' : d <= 7 ? 'text-amber-600' : 'text-indigo-600'}`}>
                          {d === 0 ? 'Today!' : `${d}d`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* All Smart Alerts */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Zap size={16} className="text-indigo-500" />
            <h2 className="font-semibold text-slate-900">Smart Operational Alerts</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {smartAlerts.map(alert => (
              <div key={alert.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-slate-50">
                <div className={`mt-0.5 shrink-0 w-2 h-2 rounded-full ${alert.severity === 'error' ? 'bg-red-500' : alert.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{alert.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{alert.message}</p>
                </div>
                <button
                  onClick={() => navigate(alert.relatedType === 'relocation' ? `/relocations/${alert.relatedId}` : alert.relatedType === 'task' ? '/tasks' : '/relocations')}
                  className="text-xs text-indigo-600 hover:underline shrink-0"
                >
                  {alert.actionLabel} →
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Daily Workload */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center gap-2 mb-3"><Users size={15} className="text-indigo-500" /><h3 className="font-semibold text-slate-900 text-sm">Total Customers</h3></div>
            <p className="text-3xl font-bold text-indigo-600">8</p>
            <p className="text-xs text-slate-500 mt-1">2 corporate, 6 individual</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 mb-3"><CheckSquare size={15} className="text-teal-500" /><h3 className="font-semibold text-slate-900 text-sm">Tasks Due Today</h3></div>
            <p className="text-3xl font-bold text-teal-600">{tasks.filter(t => t.status !== 'completed').length}</p>
            <p className="text-xs text-slate-500 mt-1">{overdueTaskCount} overdue, {tasks.filter(t => t.status === 'in_progress').length} in progress</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 mb-3"><FileX size={15} className="text-amber-500" /><h3 className="font-semibold text-slate-900 text-sm">Missing Documents</h3></div>
            <p className="text-3xl font-bold text-amber-600">4</p>
            <p className="text-xs text-slate-500 mt-1">Across 2 active relocations</p>
          </Card>
          <Card hover onClick={() => navigate('/escalations')}>
            <div className="flex items-center gap-2 mb-3"><AlertTriangle size={15} className="text-red-500" /><h3 className="font-semibold text-slate-900 text-sm">Open Escalations</h3></div>
            <p className="text-3xl font-bold text-red-600">2</p>
            <p className="text-xs text-slate-500 mt-1">1 critical, 1 high severity</p>
          </Card>
        </div>

        {/* Quick access to new features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: '💬 Intake Parser', desc: 'Convert WhatsApp → record', path: '/intake', color: 'bg-violet-50 border-violet-200' },
            { label: '🚚 Move Day', desc: 'Live move coordination', path: '/move-day', color: 'bg-amber-50 border-amber-200' },
            { label: '🏙️ City Playbooks', desc: 'Per-city vendor & rules', path: '/playbooks', color: 'bg-teal-50 border-teal-200' },
            { label: '🚨 Escalations', desc: 'Exception management', path: '/escalations', color: 'bg-red-50 border-red-200' },
          ].map(q => (
            <Card key={q.path} hover onClick={() => navigate(q.path)} className={`${q.color}`} padding="sm">
              <p className="font-semibold text-slate-800 text-sm">{q.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{q.desc}</p>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
