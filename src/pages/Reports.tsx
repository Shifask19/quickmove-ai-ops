import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TopNav } from '../components/layout/TopNav';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../lib/utils';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'];

export function Reports() {
  const { relocations, tasks, utilities, vendors } = useStore();

  // Relocations by status
  const byStatus = Object.entries(
    relocations.reduce<Record<string, number>>((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));

  // Monthly moves (mocked for demo)
  const monthlyData = [
    { month: 'Mar', moves: 2, revenue: 120000 },
    { month: 'Apr', moves: 3, revenue: 195000 },
    { month: 'May', moves: 4, revenue: 280000 },
    { month: 'Jun', moves: 5, revenue: 340000 },
    { month: 'Jul', moves: 6, revenue: 425000 },
    { month: 'Aug', moves: 3, revenue: 215000 },
  ];

  // Task completion
  const taskData = [
    { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length },
    { name: 'Pending', value: tasks.filter(t => t.status === 'pending').length },
    { name: 'Overdue', value: tasks.filter(t => t.status === 'overdue').length },
  ];

  // Utility activation
  const utilData = ['electricity', 'gas', 'internet', 'water', 'lpg'].map(type => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    active: utilities.filter(u => u.type === type && u.status === 'active').length,
    pending: utilities.filter(u => u.type === type && u.status !== 'active').length,
  }));

  // Vendor performance
  const vendorData = vendors.map(v => ({
    name: v.name.length > 18 ? v.name.substring(0, 18) + '…' : v.name,
    rating: v.rating,
    jobs: v.totalJobs,
  })).sort((a, b) => b.rating - a.rating);

  // Summary KPIs
  const totalRevenue = relocations.reduce((sum, r) => sum + (r.actualCost || r.estimatedBudget), 0);
  const avgBudget = Math.round(totalRevenue / relocations.length);
  const completedCount = relocations.filter(r => r.status === 'completed').length;
  const activeCount = relocations.filter(r => !['completed', 'cancelled'].includes(r.status)).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopNav title="Reports" subtitle="Operational performance overview" />
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-6">

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Pipeline Value', value: formatCurrency(totalRevenue), sub: 'All relocations' },
            { label: 'Average Deal Size', value: formatCurrency(avgBudget), sub: 'Per relocation' },
            { label: 'Active Relocations', value: activeCount, sub: 'Currently in progress' },
            { label: 'Completed This Year', value: completedCount, sub: 'Successfully closed' },
          ].map(k => (
            <Card key={k.label}>
              <p className="text-2xl font-bold text-slate-900">{k.value}</p>
              <p className="text-sm font-medium text-slate-700 mt-0.5">{k.label}</p>
              <p className="text-xs text-slate-400">{k.sub}</p>
            </Card>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader><CardTitle>Monthly Moves & Revenue</CardTitle></CardHeader>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v, n) => [n === 'revenue' ? formatCurrency(Number(v)) : v, n === 'revenue' ? 'Revenue' : 'Moves']} />
                <Bar yAxisId="left" dataKey="moves" fill="#6366f1" radius={[4,4,0,0]} name="Moves" />
                <Bar yAxisId="right" dataKey="revenue" fill="#10b981" radius={[4,4,0,0]} name="revenue" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <CardHeader><CardTitle>Relocations by Stage</CardTitle></CardHeader>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={byStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ value }) => `${value}`}>
                  {byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader><CardTitle>Task Status Breakdown</CardTitle></CardHeader>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={taskData} dataKey="value" cx="50%" cy="50%" outerRadius={75} label={({ name, value }) => `${name}: ${value}`}>
                  {taskData.map((_, i) => <Cell key={i} fill={['#10b981','#6366f1','#94a3b8','#ef4444'][i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <CardHeader><CardTitle>Utility Activation Status</CardTitle></CardHeader>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={utilData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="active" fill="#10b981" radius={[4,4,0,0]} name="Active" stackId="a" />
                <Bar dataKey="pending" fill="#fbbf24" radius={[0,0,0,0]} name="Pending" stackId="a" />
                <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Vendor table */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Vendor Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Vendor</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">City</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Rating</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Total Jobs</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {vendorData.map(v => {
                  const vendor = vendors.find(vd => vd.name.startsWith(v.name.replace('…', '')));
                  return (
                    <tr key={v.name} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-slate-800">{v.name}</td>
                      <td className="px-5 py-3 text-slate-600">{vendor?.city}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-500">★</span>
                          <span className="font-semibold text-slate-800">{v.rating}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-700 font-medium">{v.jobs}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${vendor?.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {vendor?.available ? 'Available' : 'Booked'}
                        </span>
                      </td>
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
