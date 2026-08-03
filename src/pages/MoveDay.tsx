import { useState } from 'react';
import { Truck, CheckCircle2, Circle, AlertTriangle, Phone, Clock, MapPin, Package } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';
import { formatDate, daysUntil } from '../lib/utils';
import { toast } from 'sonner';

const MOVE_DAY_CHECKLIST = [
  { id: 'md1', category: 'Pre-Move',   label: 'Vendor confirmed for today',               critical: true  },
  { id: 'md2', category: 'Pre-Move',   label: 'Customer reachable on phone',               critical: true  },
  { id: 'md3', category: 'Pre-Move',   label: 'Old property access confirmed',             critical: true  },
  { id: 'md4', category: 'Pre-Move',   label: 'New property keys / access arranged',       critical: true  },
  { id: 'md5', category: 'Pre-Move',   label: 'Inventory list shared with mover',          critical: false },
  { id: 'md6', category: 'Loading',    label: 'Movers arrived on time',                    critical: true  },
  { id: 'md7', category: 'Loading',    label: 'All items documented before loading',       critical: true  },
  { id: 'md8', category: 'Loading',    label: 'Fragile items packed separately',           critical: false },
  { id: 'md9', category: 'Loading',    label: 'Loading completed — truck sealed',          critical: true  },
  { id: 'md10','category': 'Transit',  label: 'Truck departed — ETA noted',                critical: true  },
  { id: 'md11','category': 'Transit',  label: 'Mid-transit check-in done',                 critical: false },
  { id: 'md12','category': 'Delivery', label: 'Truck arrived at new address',              critical: true  },
  { id: 'md13','category': 'Delivery', label: 'All items unloaded and checked',            critical: true  },
  { id: 'md14','category': 'Delivery', label: 'Damage/issue report completed (if any)',    critical: false },
  { id: 'md15','category': 'Closure',  label: 'Customer signed off on move completion',   critical: true  },
  { id: 'md16','category': 'Closure',  label: 'Vendor payment confirmed',                  critical: true  },
  { id: 'md17','category': 'Closure',  label: 'Move ticket closed in system',              critical: true  },
];

export function MoveDay() {
  const { relocations, vendorBookings, tasks, updateTask } = useStore();
  const [selectedReloId, setSelectedReloId] = useState<string>('');
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [issues, setIssues] = useState<{ text: string; severity: string }[]>([]);
  const [issueText, setIssueText] = useState('');
  const [issueSeverity, setIssueSeverity] = useState('medium');

  // Moves happening today or within 2 days
  const moveDayRelocations = relocations.filter(r => {
    const d = daysUntil(r.moveDate);
    return d >= -1 && d <= 2 && !['completed', 'cancelled'].includes(r.status);
  });

  const allActiveRelocations = relocations.filter(r => !['completed', 'cancelled'].includes(r.status));

  const selectedRelo = relocations.find(r => r.id === selectedReloId);
  const booking = vendorBookings.find(vb => vb.relocationId === selectedReloId);
  const moveTasks = tasks.filter(t => t.relocationId === selectedReloId);

  const checkedCount = Object.values(checks).filter(Boolean).length;
  const progress = Math.round((checkedCount / MOVE_DAY_CHECKLIST.length) * 100);

  const grouped = MOVE_DAY_CHECKLIST.reduce<Record<string, typeof MOVE_DAY_CHECKLIST>>((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  function toggleCheck(id: string) {
    setChecks(c => ({ ...c, [id]: !c[id] }));
  }

  function addIssue() {
    if (!issueText.trim()) return;
    setIssues(i => [...i, { text: issueText, severity: issueSeverity }]);
    setIssueText('');
    toast.warning('Issue logged');
  }

  function completeMoveDay() {
    const critical = MOVE_DAY_CHECKLIST.filter(i => i.critical && !checks[i.id]);
    if (critical.length > 0) {
      toast.error(`${critical.length} critical items not checked. Please complete them first.`);
      return;
    }
    // Mark move day task as complete
    const mdTask = moveTasks.find(t => t.title.toLowerCase().includes('move day') || t.title.toLowerCase().includes('monitor'));
    if (mdTask) updateTask(mdTask.id, { status: 'completed' });
    toast.success('Move day completed and logged!');
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopNav title="Move Day Coordination" subtitle="Real-time move day tracking" />
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-5">

        {/* Today's moves alert */}
        {moveDayRelocations.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="font-semibold text-amber-800 flex items-center gap-2">
              <Truck size={16} /> {moveDayRelocations.length} move(s) happening today or within 48 hours
            </p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {moveDayRelocations.map(r => (
                <button key={r.id}
                  onClick={() => setSelectedReloId(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${selectedReloId === r.id ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}>
                  {r.customerName} — {formatDate(r.moveDate)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Select relocation */}
        <Card>
          <CardHeader><CardTitle>Select Move</CardTitle></CardHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <select value={selectedReloId} onChange={e => setSelectedReloId(e.target.value)}
              className="flex-1 min-w-48 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Select a relocation...</option>
              {allActiveRelocations.map(r => (
                <option key={r.id} value={r.id}>
                  {r.customerName} — {r.fromCity} → {r.toCity} ({formatDate(r.moveDate)})
                </option>
              ))}
            </select>
          </div>
        </Card>

        {selectedRelo && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left — checklist */}
            <div className="lg:col-span-2 space-y-4">

              {/* Progress */}
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{selectedRelo.customerName}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <MapPin size={13} /> {selectedRelo.fromCity} → {selectedRelo.toCity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">{progress}%</p>
                    <p className="text-xs text-slate-400">{checkedCount}/{MOVE_DAY_CHECKLIST.length} items</p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </Card>

              {/* Checklist by category */}
              {Object.entries(grouped).map(([category, items]) => (
                <Card key={category} padding="none">
                  <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{category}</p>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {items.map(item => (
                      <div key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-slate-50 transition-colors ${checks[item.id] ? 'opacity-60' : ''}`}>
                        {checks[item.id]
                          ? <CheckCircle2 size={20} className="text-green-500 shrink-0" />
                          : <Circle size={20} className="text-slate-300 shrink-0" />}
                        <span className={`text-sm flex-1 ${checks[item.id] ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {item.label}
                        </span>
                        {item.critical && !checks[item.id] && (
                          <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-full font-medium shrink-0">Critical</span>
                        )}
                        {item.critical && checks[item.id] && (
                          <span className="text-xs text-green-600 font-medium shrink-0">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}

              {/* Issue logger */}
              <Card>
                <CardHeader><CardTitle className="text-sm">Log an Issue</CardTitle></CardHeader>
                <div className="flex gap-2">
                  <input
                    value={issueText}
                    onChange={e => setIssueText(e.target.value)}
                    placeholder="Describe the issue (e.g. mover arrived 2 hours late)"
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <select value={issueSeverity} onChange={e => setIssueSeverity(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <Button size="sm" onClick={addIssue}>Log</Button>
                </div>
                {issues.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {issues.map((issue, i) => (
                      <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg border text-sm ${
                        issue.severity === 'high' ? 'bg-red-50 border-red-200' : issue.severity === 'medium' ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <AlertTriangle size={14} className={issue.severity === 'high' ? 'text-red-500 mt-0.5' : 'text-amber-500 mt-0.5'} />
                        <span className="text-slate-700">{issue.text}</span>
                        <Badge label={issue.severity} color={issue.severity === 'high' ? 'text-red-700' : 'text-amber-700'} bg={issue.severity === 'high' ? 'bg-red-100' : 'bg-amber-100'} />
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Button onClick={completeMoveDay} className="w-full" size="lg" icon={<CheckCircle2 size={16} />}>
                Mark Move Day Complete
              </Button>
            </div>

            {/* Right — move info */}
            <div className="space-y-4">
              {/* Vendor info */}
              {booking ? (
                <Card>
                  <CardHeader><CardTitle className="text-sm">Vendor</CardTitle></CardHeader>
                  <div className="space-y-2">
                    <p className="font-semibold text-slate-900">{booking.vendorName}</p>
                    <Badge
                      label={booking.status}
                      color={booking.status === 'confirmed' ? 'text-blue-700' : 'text-slate-600'}
                      bg={booking.status === 'confirmed' ? 'bg-blue-100' : 'bg-slate-100'}
                    />
                    <p className="text-xs text-slate-500">Quote: ₹{booking.quote.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-slate-500">Date: {formatDate(booking.bookingDate)}</p>
                  </div>
                </Card>
              ) : (
                <Card className="bg-red-50 border-red-200">
                  <p className="text-sm font-semibold text-red-700 flex items-center gap-2">
                    <AlertTriangle size={14} /> No vendor booked!
                  </p>
                </Card>
              )}

              {/* Contact info */}
              <Card>
                <CardHeader><CardTitle className="text-sm">Quick Contacts</CardTitle></CardHeader>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                    <div>
                      <p className="text-xs font-medium text-slate-700">Customer</p>
                      <p className="text-sm font-semibold">{selectedRelo.customerName}</p>
                      <p className="text-xs text-slate-500">{selectedRelo.customerPhone}</p>
                    </div>
                    <a href={`tel:${selectedRelo.customerPhone}`}>
                      <Button size="sm" variant="outline" icon={<Phone size={12} />}>Call</Button>
                    </a>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                    <div>
                      <p className="text-xs font-medium text-slate-700">Coordinator</p>
                      <p className="text-sm font-semibold">{selectedRelo.assignedCoordinatorName}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Move day tasks */}
              <Card>
                <CardHeader><CardTitle className="text-sm">Tasks for this Move</CardTitle></CardHeader>
                <div className="space-y-2">
                  {moveTasks.length === 0
                    ? <p className="text-xs text-slate-400">No tasks assigned</p>
                    : moveTasks.map(t => (
                      <div key={t.id} className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs ${t.status === 'overdue' ? 'bg-red-50 border-red-200' : t.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                        <span className={`w-2 h-2 rounded-full shrink-0 ${t.status === 'completed' ? 'bg-green-500' : t.status === 'overdue' ? 'bg-red-500' : 'bg-amber-400'}`} />
                        <span className="flex-1 text-slate-700">{t.title}</span>
                      </div>
                    ))
                  }
                </div>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader><CardTitle className="text-sm flex items-center gap-1"><Clock size={13} />Move Timeline</CardTitle></CardHeader>
                <div className="space-y-2 text-xs">
                  {[
                    { time: '07:00', label: 'Vendor pickup at old address', done: checks['md6'] },
                    { time: '09:00', label: 'Loading complete', done: checks['md9'] },
                    { time: '10:00', label: 'Truck departs', done: checks['md10'] },
                    { time: '14:00', label: 'Arrives at new address', done: checks['md12'] },
                    { time: '16:00', label: 'Unloading complete', done: checks['md13'] },
                    { time: '17:00', label: 'Move sign-off', done: checks['md15'] },
                  ].map(e => (
                    <div key={e.time} className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${e.done ? 'bg-green-500' : 'bg-slate-300'}`} />
                      <span className="text-slate-500 w-10 shrink-0">{e.time}</span>
                      <span className={e.done ? 'text-slate-400 line-through' : 'text-slate-700'}>{e.label}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {!selectedRelo && (
          <Card className="py-16 text-center">
            <Package size={48} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500">Select a relocation above to begin move day coordination</p>
          </Card>
        )}
      </div>
    </div>
  );
}
