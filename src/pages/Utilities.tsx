import { useState } from 'react';
import { Zap } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';
import { utilityStatusMap, utilityTypeMap, formatDate } from '../lib/utils';
import { toast } from 'sonner';
import type { UtilityStatus } from '../types';

const STATUS_FLOW: UtilityStatus[] = ['pending', 'applied', 'active'];

export function Utilities() {
  const { utilities, updateUtility, relocations } = useStore();
  const [filter, setFilter] = useState('all');

  const grouped = relocations
    .filter(r => !['completed', 'cancelled'].includes(r.status))
    .map(r => ({
      relocation: r,
      utils: utilities.filter(u => u.relocationId === r.id),
    }))
    .filter(g => g.utils.length > 0);

  function advance(utilId: string, currentStatus: UtilityStatus) {
    const idx = STATUS_FLOW.indexOf(currentStatus);
    if (idx < STATUS_FLOW.length - 1) {
      const next = STATUS_FLOW[idx + 1];
      updateUtility(utilId, { status: next, ...(next === 'active' ? { activationDate: new Date().toISOString().split('T')[0] } : { applicationDate: new Date().toISOString().split('T')[0] }) });
      toast.success(`Status updated to ${utilityStatusMap[next].label}`);
    }
  }

  const allUtils = utilities.filter(u => filter === 'all' || u.status === filter);
  const pendingCount = utilities.filter(u => u.status === 'pending').length;
  const appliedCount = utilities.filter(u => u.status === 'applied').length;
  const activeCount = utilities.filter(u => u.status === 'active').length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopNav title="Utility Setup Tracking" subtitle="Electricity • Gas • Internet • Water • LPG" />
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-5">

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Pending', count: pendingCount, color: 'text-slate-600', bg: 'bg-slate-100', status: 'pending' },
            { label: 'Applied', count: appliedCount, color: 'text-amber-700', bg: 'bg-amber-100', status: 'applied' },
            { label: 'Active', count: activeCount, color: 'text-green-700', bg: 'bg-green-100', status: 'active' },
          ].map(s => (
            <button key={s.status} onClick={() => setFilter(filter === s.status ? 'all' : s.status)}
              className={`p-4 rounded-xl border text-left transition-all ${filter === s.status ? 'border-indigo-400 bg-indigo-50' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
              <p className="text-2xl font-bold text-slate-900">{s.count}</p>
              <Badge label={s.label} color={s.color} bg={s.bg} />
            </button>
          ))}
        </div>

        {/* Per relocation view */}
        {filter === 'all' ? (
          <div className="space-y-4">
            {grouped.map(({ relocation, utils }) => {
              const progress = Math.round((utils.filter(u => u.status === 'active').length / utils.length) * 100);
              return (
                <Card key={relocation.id} padding="none">
                  <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{relocation.customerName}</p>
                      <p className="text-xs text-slate-500">{relocation.toCity} — {utils.filter(u => u.status === 'active').length}/{utils.length} utilities active</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-xs font-medium text-slate-600">{progress}%</span>
                    </div>
                  </div>
                  <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {utils.map(u => {
                      const us = utilityStatusMap[u.status];
                      const ut = utilityTypeMap[u.type];
                      const canAdvance = u.status !== 'active';
                      return (
                        <div key={u.id} className={`p-3 rounded-xl border flex flex-col gap-2 ${u.status === 'active' ? 'bg-green-50 border-green-200' : u.status === 'applied' ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{ut.icon}</span>
                            <div>
                              <p className="text-xs font-semibold text-slate-800">{ut.label}</p>
                              <p className="text-xs text-slate-500 truncate">{u.provider}</p>
                            </div>
                          </div>
                          <Badge label={us.label} color={us.color} bg="bg-transparent" />
                          {u.activationDate && <p className="text-xs text-slate-400">Active: {formatDate(u.activationDate)}</p>}
                          {u.applicationDate && !u.activationDate && <p className="text-xs text-slate-400">Applied: {formatDate(u.applicationDate)}</p>}
                          {canAdvance && (
                            <Button size="sm" variant="ghost" onClick={() => advance(u.id, u.status)} className="mt-1 text-xs px-2 py-1">
                              {u.status === 'pending' ? 'Mark Applied' : 'Mark Active'}
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase text-left">Customer</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase text-left">Utility</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase text-left">Provider</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase text-left">Status</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {allUtils.map(u => {
                    const us = utilityStatusMap[u.status];
                    const ut = utilityTypeMap[u.type];
                    return (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-slate-800">{u.customerName}</td>
                        <td className="px-5 py-3"><span className="flex items-center gap-1.5">{ut.icon} {ut.label}</span></td>
                        <td className="px-5 py-3 text-slate-600">{u.provider}</td>
                        <td className="px-5 py-3"><Badge label={us.label} color={us.color} bg={us.bg} /></td>
                        <td className="px-5 py-3">
                          {u.status !== 'active' && (
                            <Button size="sm" variant="outline" onClick={() => advance(u.id, u.status)}>
                              {u.status === 'pending' ? 'Mark Applied' : 'Mark Active'}
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}
