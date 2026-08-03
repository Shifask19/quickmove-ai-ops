import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useStore } from '../store/useStore';
import { relocationStatusMap, priorityMap, formatDate, daysUntil, formatCurrency, getNextAction } from '../lib/utils';

const STAGES = ['All', 'Inquiry', 'Onboarding', 'Property Search', 'Property Finalized', 'Move Planning', 'Packing & Moving', 'Utility Setup', 'Address Change', 'Post-Move Support', 'Completed'];
const statusValues = ['all', 'inquiry', 'onboarding', 'property_search', 'property_finalized', 'move_planning', 'packing_moving', 'utility_setup', 'address_change', 'post_move_support', 'completed'];

export function Relocations() {
  const { relocations } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [coordFilter, setCoordFilter] = useState('all');

  const coordinators = [...new Set(relocations.map(r => r.assignedCoordinatorName))];

  const filtered = relocations.filter(r => {
    const matchSearch = r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.fromCity.toLowerCase().includes(search.toLowerCase()) ||
      r.toCity.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || r.priority === priorityFilter;
    const matchCoord = coordFilter === 'all' || r.assignedCoordinatorName === coordFilter;
    return matchSearch && matchStatus && matchPriority && matchCoord;
  });

  // Pipeline view by stage
  const pipeline = statusValues.slice(1, -1).map(s => ({
    status: s,
    label: relocationStatusMap[s as keyof typeof relocationStatusMap]?.label ?? s,
    items: relocations.filter(r => r.status === s),
  })).filter(p => p.items.length > 0);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopNav title="Relocations" subtitle={`${filtered.length} relocations`} />
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-5">

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-48">
            <Search size={15} className="text-slate-400" />
            <input placeholder="Search customer, city..." value={search} onChange={e => setSearch(e.target.value)}
              className="text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none flex-1 bg-transparent" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {STAGES.map((s, i) => <option key={s} value={statusValues[i]}>{s}</option>)}
          </select>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select value={coordFilter} onChange={e => setCoordFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="all">All Coordinators</option>
            {coordinators.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <Button icon={<Plus size={15} />} onClick={() => navigate('/relocations/new')}>New Relocation</Button>
        </div>

        {/* Pipeline Summary */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {pipeline.map(p => {
            const s = relocationStatusMap[p.status as keyof typeof relocationStatusMap];
            return (
              <button key={p.status} onClick={() => setStatusFilter(p.status)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium whitespace-nowrap transition-colors ${
                  statusFilter === p.status ? 'bg-indigo-600 text-white border-indigo-600' : `${s.bg} ${s.color} border-transparent hover:border-slate-200`
                }`}>
                {p.label}
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${statusFilter === p.status ? 'bg-indigo-500 text-white' : 'bg-white/60'}`}>
                  {p.items.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Relocations Table */}
        <Card padding="none">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-900">{filtered.length} Results</span>
          </div>
          <div className="divide-y divide-slate-50">
            {filtered.map(r => {
              const status = relocationStatusMap[r.status];
              const priority = priorityMap[r.priority];
              const daysLeft = daysUntil(r.moveDate);
              return (
                <div key={r.id} className="px-5 py-4 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/relocations/${r.id}`)}>
                  <div className="flex items-start gap-4">
                    <Avatar name={r.customerName} size="md" />
                    <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-900 text-sm">{r.customerName}</span>
                          <Badge label={priority.label} color={priority.color} bg={priority.bg} dot dotColor={priority.dot} />
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{r.fromCity} → {r.toCity}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge label={status.label} color={status.color} bg={status.bg} />
                        </div>
                        <div className="mt-2">
                          <ProgressBar value={r.completionPercentage} showLabel />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-400">Coordinator</p>
                        <p className="text-sm font-medium text-slate-700">{r.assignedCoordinatorName}</p>
                        <p className="text-xs text-slate-400 mt-2">Next Action</p>
                        <p className="text-xs text-slate-600 italic">{getNextAction(r.status)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">{formatCurrency(r.estimatedBudget)}</p>
                        <p className="text-xs text-slate-400">Budget</p>
                        <p className={`text-sm font-semibold mt-2 ${daysLeft < 0 ? 'text-red-600' : daysLeft < 7 ? 'text-amber-600' : 'text-slate-700'}`}>
                          {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d to move`}
                        </p>
                        <p className="text-xs text-slate-400">{formatDate(r.moveDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-slate-400">No relocations match your filters.</div>
          )}
        </Card>
      </div>
    </div>
  );
}
