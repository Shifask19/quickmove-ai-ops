import { useState } from 'react';
import { Building2, Search, Bed, Bath, Maximize2, MapPin, Phone } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { useStore } from '../store/useStore';
import { formatCurrency, formatDate } from '../lib/utils';

const statusConfig = {
  shortlisted: { label: 'Shortlisted', color: 'text-blue-700', bg: 'bg-blue-100' },
  visited:     { label: 'Visited',     color: 'text-amber-700', bg: 'bg-amber-100' },
  selected:    { label: 'Selected',    color: 'text-green-700', bg: 'bg-green-100' },
  rejected:    { label: 'Rejected',    color: 'text-red-700',   bg: 'bg-red-100' },
};

export function Properties() {
  const { properties, relocations } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = properties.filter(p => {
    const r = relocations.find(r => r.id === p.relocationId);
    const matchSearch = p.address.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      (r?.customerName.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopNav title="Properties" subtitle={`${properties.length} properties tracked`} />
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-5">

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(statusConfig).map(([key, val]) => {
            const count = properties.filter(p => p.status === key).length;
            return (
              <button key={key} onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)}
                className={`p-3 rounded-xl border text-left transition-all ${statusFilter === key ? 'border-indigo-400 bg-indigo-50' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                <p className="text-2xl font-bold text-slate-900">{count}</p>
                <Badge label={val.label} color={val.color} bg={val.bg} />
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-48">
            <Search size={15} className="text-slate-400" />
            <input placeholder="Search by address, city, customer..." value={search} onChange={e => setSearch(e.target.value)}
              className="text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none flex-1 bg-transparent" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="all">All Statuses</option>
            {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <EmptyState icon={<Building2 size={48} />} title="No properties found" description="Try adjusting your search or filters." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(p => {
              const r = relocations.find(r => r.id === p.relocationId);
              const sc = statusConfig[p.status];
              return (
                <Card key={p.id} hover>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-1.5">
                        <MapPin size={13} className="text-slate-400 mt-0.5 shrink-0" />
                        <p className="text-sm font-semibold text-slate-900 leading-snug">{p.address}</p>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 ml-4">{p.city}</p>
                    </div>
                    <Badge label={sc.label} color={sc.color} bg={sc.bg} />
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Bed size={12} />{p.bedrooms} BHK</span>
                    <span className="flex items-center gap-1"><Bath size={12} />{p.bathrooms} Bath</span>
                    <span className="flex items-center gap-1"><Maximize2 size={12} />{p.area} sqft</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900">{formatCurrency(p.rent)}<span className="text-xs font-normal text-slate-400">/mo</span></span>
                    {r && <span className="text-xs text-indigo-600 font-medium">{r.customerName}</span>}
                  </div>

                  {p.brokerName && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                      <Phone size={11} />
                      <span>{p.brokerName} — {p.brokerPhone}</span>
                    </div>
                  )}

                  {p.visitDate && (
                    <p className="text-xs text-slate-400 mt-1.5">Visited: {formatDate(p.visitDate)}</p>
                  )}
                  {p.notes && <p className="text-xs text-amber-700 mt-1.5 italic">Note: {p.notes}</p>}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
