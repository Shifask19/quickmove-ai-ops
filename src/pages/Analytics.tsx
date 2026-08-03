import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, RadialBarChart, RadialBar } from 'recharts';
import { TopNav } from '../components/layout/TopNav';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { useStore } from '../store/useStore';
import { relocationStatusMap } from '../lib/utils';

export function Analytics() {
  const { relocations, tasks, customers } = useStore();

  // Pipeline velocity - days in each stage (mocked enriched data)
  const velocityData = [
    { stage: 'Inquiry', avgDays: 1 },
    { stage: 'Onboarding', avgDays: 2 },
    { stage: 'Prop. Search', avgDays: 12 },
    { stage: 'Prop. Final.', avgDays: 5 },
    { stage: 'Move Plan', avgDays: 8 },
    { stage: 'Pack & Move', avgDays: 3 },
    { stage: 'Utilities', avgDays: 7 },
    { stage: 'Address', avgDays: 14 },
    { stage: 'Support', avgDays: 5 },
  ];

  // Weekly task completion
  const taskTrend = [
    { week: 'W1', created: 5, completed: 2, overdue: 1 },
    { week: 'W2', created: 7, completed: 5, overdue: 2 },
    { week: 'W3', created: 4, completed: 6, overdue: 3 },
    { week: 'W4', created: 9, completed: 4, overdue: 5 },
    { week: 'W5', created: 6, completed: 8, overdue: 4 },
  ];

  // Customer type breakdown
  const individualCount = customers.filter(c => c.type === 'individual').length;
  const corporateCount = customers.filter(c => c.type === 'corporate').length;

  // Coordinator workload
  const coordData = [
    { name: 'Rahul Verma', active: 5, completed: 8 },
    { name: 'Sneha Patel', active: 4, completed: 6 },
    { name: 'Arjun Nair', active: 3, completed: 5 },
  ];

  // Priority breakdown
  const priorityData = [
    { name: 'Urgent', value: relocations.filter(r => r.priority === 'urgent').length, fill: '#ef4444' },
    { name: 'High', value: relocations.filter(r => r.priority === 'high').length, fill: '#f59e0b' },
    { name: 'Medium', value: relocations.filter(r => r.priority === 'medium').length, fill: '#6366f1' },
    { name: 'Low', value: relocations.filter(r => r.priority === 'low').length, fill: '#94a3b8' },
  ];

  // City heatmap data
  const cityData = [
    { city: 'Mumbai', inbound: 2, outbound: 3 },
    { city: 'Bangalore', inbound: 4, outbound: 2 },
    { city: 'Delhi', inbound: 1, outbound: 2 },
    { city: 'Hyderabad', inbound: 1, outbound: 2 },
    { city: 'Chennai', inbound: 2, outbound: 1 },
    { city: 'Pune', inbound: 2, outbound: 1 },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopNav title="Analytics" subtitle="Operational intelligence" />
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-5">

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Avg. Relocation Duration', value: '57 days', sub: 'Inquiry to completion' },
            { label: 'Task On-Time Rate', value: '62%', sub: '8 of 14 tasks on time' },
            { label: 'Customer Satisfaction', value: '4.4/5', sub: 'Based on 12 reviews' },
            { label: 'Corporate Clients', value: `${corporateCount}/${customers.length}`, sub: 'Of total customers' },
          ].map(k => (
            <Card key={k.label}>
              <p className="text-2xl font-bold text-slate-900">{k.value}</p>
              <p className="text-sm font-medium text-slate-700 mt-0.5">{k.label}</p>
              <p className="text-xs text-slate-400">{k.sub}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Pipeline velocity */}
          <Card>
            <CardHeader><CardTitle>Pipeline Velocity (Avg Days per Stage)</CardTitle></CardHeader>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={velocityData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="stage" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => [`${v} days`]} />
                <Area type="monotone" dataKey="avgDays" stroke="#6366f1" fill="#e0e7ff" strokeWidth={2} name="Avg Days" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Task trend */}
          <Card>
            <CardHeader><CardTitle>Weekly Task Trend</CardTitle></CardHeader>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={taskTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="created" stroke="#6366f1" strokeWidth={2} name="Created" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Completed" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="overdue" stroke="#ef4444" strokeWidth={2} name="Overdue" dot={{ r: 4 }} strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* City flows */}
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>City-wise Relocation Flow</CardTitle></CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">City</th>
                    <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Inbound Moves</th>
                    <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Outbound Moves</th>
                    <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {cityData.map(c => (
                    <tr key={c.city} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">{c.city}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${c.inbound * 20}%` }} />
                          </div>
                          <span className="text-slate-700 font-medium">{c.inbound}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${c.outbound * 20}%` }} />
                          </div>
                          <span className="text-slate-700 font-medium">{c.outbound}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold ${c.inbound > c.outbound ? 'text-green-600' : c.inbound < c.outbound ? 'text-red-600' : 'text-slate-500'}`}>
                          {c.inbound > c.outbound ? '+' : ''}{c.inbound - c.outbound}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Priority + Coordinator */}
          <div className="space-y-5">
            <Card>
              <CardHeader><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader>
              <ResponsiveContainer width="100%" height={140}>
                <RadialBarChart innerRadius="30%" outerRadius="90%" data={priorityData} startAngle={90} endAngle={-270}>
                  <RadialBar dataKey="value" cornerRadius={4} label={false} />
                  <Tooltip formatter={(v, n) => [v, n]} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {priorityData.map(p => (
                  <div key={p.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: p.fill }} />
                    <span className="text-xs text-slate-600">{p.name}: {p.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-sm">Coordinator Stats</CardTitle></CardHeader>
              <div className="space-y-3">
                {coordData.map(c => (
                  <div key={c.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-700">{c.name.split(' ')[0]}</span>
                      <span className="text-xs text-slate-500">{c.active} active • {c.completed} done</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(c.completed / (c.active + c.completed)) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
