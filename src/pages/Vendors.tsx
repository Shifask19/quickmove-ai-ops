import { useState } from 'react';
import { Truck, Star, Phone, MapPin, Search, CheckCircle, XCircle } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useStore } from '../store/useStore';
import { formatDate, formatCurrency, bookingStatusMap } from '../lib/utils';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} className={i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} />
      ))}
      <span className="text-xs font-medium text-slate-600 ml-1">{rating}</span>
    </div>
  );
}

export function Vendors() {
  const { vendors, vendorBookings } = useStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [availFilter, setAvailFilter] = useState('all');

  const filtered = vendors.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.city.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || v.type === typeFilter;
    const matchAvail = availFilter === 'all' || (availFilter === 'available' ? v.available : !v.available);
    return matchSearch && matchType && matchAvail;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopNav title="Vendors & Movers" subtitle={`${vendors.length} vendors in network`} />
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-5">

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-48">
            <Search size={15} className="text-slate-400" />
            <input placeholder="Search by name or city..." value={search} onChange={e => setSearch(e.target.value)}
              className="text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none flex-1 bg-transparent" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="all">All Types</option>
            <option value="both">Packers & Movers</option>
            <option value="movers">Movers Only</option>
            <option value="packers">Packers Only</option>
          </select>
          <select value={availFilter} onChange={e => setAvailFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="all">All Availability</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        {/* Vendor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(v => {
            const bookings = vendorBookings.filter(b => b.vendorId === v.id);
            const typeLabel = v.type === 'both' ? 'Packers & Movers' : v.type === 'movers' ? 'Movers Only' : 'Packers Only';
            return (
              <Card key={v.id} hover>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Truck size={18} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{v.name}</p>
                      <p className="text-xs text-slate-500">{typeLabel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {v.available ? (
                      <span className="flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium">
                        <CheckCircle size={11} /> Available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded-full font-medium">
                        <XCircle size={11} /> Booked
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin size={12} className="shrink-0" />{v.city}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Phone size={12} className="shrink-0" />{v.phone}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <StarRating rating={v.rating} />
                  <span className="text-xs text-slate-400">{v.totalJobs} jobs done</span>
                </div>

                {v.notes && <p className="text-xs text-amber-700 mt-2 italic">{v.notes}</p>}

                {bookings.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-600 mb-1.5">Bookings</p>
                    {bookings.map(b => {
                      const bs = bookingStatusMap[b.status];
                      return (
                        <div key={b.id} className="flex items-center justify-between py-1">
                          <span className="text-xs text-slate-700">{b.customerName}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">{formatDate(b.bookingDate)}</span>
                            <Badge label={bs.label} color={bs.color} bg={bs.bg} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Bookings Table */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">All Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Vendor</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Booking Date</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Quote</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {vendorBookings.map(b => {
                  const bs = bookingStatusMap[b.status];
                  return (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-slate-800">{b.customerName}</td>
                      <td className="px-5 py-3 text-slate-600">{b.vendorName}</td>
                      <td className="px-5 py-3 text-slate-600">{formatDate(b.bookingDate)}</td>
                      <td className="px-5 py-3 font-semibold text-slate-800">{formatCurrency(b.quote)}</td>
                      <td className="px-5 py-3"><Badge label={bs.label} color={bs.color} bg={bs.bg} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
