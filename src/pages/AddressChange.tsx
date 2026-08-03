import { useState } from 'react';
import { MapPin, CheckCircle2, Clock, Circle } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useStore } from '../store/useStore';
import { formatDate } from '../lib/utils';
import { toast } from 'sonner';

const CATEGORIES = ['All', 'Government ID', 'Banking', 'Insurance', 'Employment', 'Online Services'];

export function AddressChange() {
  const { addressChangeItems, updateAddressItem, relocations } = useStore();
  const [catFilter, setCatFilter] = useState('All');

  const grouped = relocations
    .filter(r => !['completed', 'cancelled'].includes(r.status))
    .map(r => ({
      relocation: r,
      items: addressChangeItems.filter(a => a.relocationId === r.id),
    }))
    .filter(g => g.items.length > 0);

  function advance(itemId: string, current: string) {
    const next = current === 'pending' ? 'submitted' : 'completed';
    updateAddressItem(itemId, {
      status: next as 'submitted' | 'completed',
      ...(next === 'submitted' ? { submittedDate: new Date().toISOString().split('T')[0] } : { completedDate: new Date().toISOString().split('T')[0] }),
    });
    toast.success(`Address change marked as ${next}`);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopNav title="Address Change Checklist" subtitle="Track all institution updates" />
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-5">

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCatFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${catFilter === cat ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
              {cat}
            </button>
          ))}
        </div>

        {grouped.map(({ relocation, items }) => {
          const filtered = catFilter === 'All' ? items : items.filter(i => i.category === catFilter);
          if (filtered.length === 0) return null;

          const completed = items.filter(i => i.status === 'completed').length;
          const progress = Math.round((completed / items.length) * 100);

          return (
            <Card key={relocation.id} padding="none">
              <div className="px-5 py-4 border-b border-slate-100">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">{relocation.customerName}</p>
                    <p className="text-xs text-slate-500">New address: {relocation.toCity}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{completed}/{items.length} completed</span>
                    <div className="w-24">
                      <ProgressBar value={progress} showLabel />
                    </div>
                  </div>
                </div>
              </div>

              {/* Group by category */}
              {Object.entries(
                filtered.reduce<Record<string, typeof filtered>>((acc, item) => {
                  (acc[item.category] = acc[item.category] || []).push(item);
                  return acc;
                }, {})
              ).map(([category, catItems]) => (
                <div key={category} className="px-5 py-4 border-b border-slate-50 last:border-b-0">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{category}</p>
                  <div className="space-y-2">
                    {catItems.map(item => (
                      <div key={item.id} className="flex items-center gap-3 group">
                        <div className="shrink-0">
                          {item.status === 'completed' && <CheckCircle2 size={18} className="text-green-500" />}
                          {item.status === 'submitted' && <Clock size={18} className="text-amber-500" />}
                          {item.status === 'pending' && <Circle size={18} className="text-slate-300" />}
                        </div>
                        <span className={`flex-1 text-sm ${item.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                          {item.institution}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge
                            label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            color={item.status === 'completed' ? 'text-green-700' : item.status === 'submitted' ? 'text-amber-700' : 'text-slate-500'}
                            bg={item.status === 'completed' ? 'bg-green-100' : item.status === 'submitted' ? 'bg-amber-100' : 'bg-slate-100'}
                          />
                          {item.completedDate && <span className="text-xs text-slate-400">{formatDate(item.completedDate)}</span>}
                          {item.status !== 'completed' && (
                            <Button size="sm" variant="ghost" onClick={() => advance(item.id, item.status)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                              {item.status === 'pending' ? 'Mark Submitted' : 'Mark Complete'}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Card>
          );
        })}

        {grouped.length === 0 && (
          <div className="text-center py-16">
            <MapPin size={48} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500">No address change items found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
