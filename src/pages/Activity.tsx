import { useState } from 'react';
import { Activity as ActivityIcon, Search } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Card } from '../components/ui/Card';
import { useStore } from '../store/useStore';
import { activityEvents } from '../data/mockData';
import { formatDateTime } from '../lib/utils';

const typeColor: Record<string, string> = {
  stage_change: 'bg-indigo-500',
  task: 'bg-amber-500',
  document: 'bg-blue-500',
  note: 'bg-slate-400',
  booking: 'bg-violet-500',
  utility: 'bg-teal-500',
  system: 'bg-slate-300',
};

const typeIcon: Record<string, string> = {
  stage_change: '🔄',
  task: '✅',
  document: '📄',
  note: '📝',
  booking: '🚚',
  utility: '🔌',
  system: '⚙️',
};

export function Activity() {
  const { relocations } = useStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = activityEvents
    .filter(e => {
      const matchSearch = e.customerName.toLowerCase().includes(search.toLowerCase()) ||
        e.action.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'all' || e.type === typeFilter;
      return matchSearch && matchType;
    })
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopNav title="Activity Timeline" subtitle="All operations activity" />
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-5">

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-48">
            <Search size={15} className="text-slate-400" />
            <input placeholder="Search activity..." value={search} onChange={e => setSearch(e.target.value)}
              className="text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none flex-1 bg-transparent" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="all">All Types</option>
            <option value="stage_change">Stage Changes</option>
            <option value="task">Tasks</option>
            <option value="booking">Bookings</option>
            <option value="utility">Utilities</option>
            <option value="document">Documents</option>
            <option value="note">Notes</option>
          </select>
        </div>

        {/* Timeline */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <ActivityIcon size={48} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400">No activity found.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200" />
            <div className="space-y-4">
              {filtered.map((event) => {
                const relo = relocations.find(r => r.id === event.relocationId);
                return (
                  <div key={event.id} className="flex gap-4 relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 z-10 border-2 border-white shadow-sm ${typeColor[event.type] || 'bg-slate-300'} bg-opacity-20`}>
                      {typeIcon[event.type]}
                    </div>
                    <Card className="flex-1" hover>
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{event.action}</p>
                          <p className="text-sm text-slate-600 mt-0.5">{event.description}</p>
                          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            <span className="text-xs text-indigo-600 font-medium">{event.customerName}</span>
                            {relo && <span className="text-xs text-slate-400">{relo.fromCity} → {relo.toCity}</span>}
                            <span className="text-xs text-slate-400">by {event.performedBy}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 shrink-0">{formatDateTime(event.timestamp)}</p>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
