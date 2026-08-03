import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, CheckCircle2, Circle, Clock3 } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Avatar } from '../components/ui/Avatar';
import { useStore } from '../store/useStore';
import { relocationStatusMap, priorityMap, formatDate, formatCurrency, daysUntil, getNextAction, taskStatusMap, utilityStatusMap, utilityTypeMap } from '../lib/utils';
import { activityEvents } from '../data/mockData';

export function RelocationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { relocations, tasks, utilities, documents, properties, vendorBookings, addressChangeItems } = useStore();

  const relocation = relocations.find(r => r.id === id);
  if (!relocation) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <TopNav title="Relocation Not Found" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-500 mb-4">This relocation doesn't exist.</p>
            <Button onClick={() => navigate('/relocations')} variant="secondary" icon={<ArrowLeft size={15} />}>Back to Relocations</Button>
          </div>
        </div>
      </div>
    );
  }

  const status = relocationStatusMap[relocation.status];
  const priority = priorityMap[relocation.priority];
  const daysLeft = daysUntil(relocation.moveDate);
  const reloTasks = tasks.filter(t => t.relocationId === id);
  const reloUtils = utilities.filter(u => u.relocationId === id);
  const reloDocs = documents.filter(d => d.relocationId === id);
  const reloProps = properties.filter(p => p.relocationId === id);
  const reloBookings = vendorBookings.filter(vb => vb.relocationId === id);
  const reloAddress = addressChangeItems.filter(a => a.relocationId === id);
  const reloActivity = activityEvents.filter(a => a.relocationId === id).sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  const missingDocs = reloDocs.filter(d => d.required && !d.uploadedAt);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopNav title={relocation.customerName} subtitle={`${relocation.fromCity} → ${relocation.toCity}`} />
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-5">

        {/* Back + Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" icon={<ArrowLeft size={15} />} onClick={() => navigate('/relocations')}>Back</Button>
        </div>

        {/* Hero card */}
        <Card>
          <div className="flex items-start gap-4 flex-wrap">
            <Avatar name={relocation.customerName} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">{relocation.customerName}</h2>
                <Badge label={priority.label} color={priority.color} bg={priority.bg} dot dotColor={priority.dot} />
                <Badge label={status.label} color={status.color} bg={status.bg} />
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-sm text-slate-600"><Phone size={13} />{relocation.customerPhone}</div>
                <div className="flex items-center gap-1.5 text-sm text-slate-600"><Mail size={13} />{relocation.customerEmail}</div>
                <div className="flex items-center gap-1.5 text-sm text-slate-600"><MapPin size={13} />{relocation.fromCity} → {relocation.toCity}</div>
                <div className="flex items-center gap-1.5 text-sm text-slate-600"><Calendar size={13} />Move: {formatDate(relocation.moveDate)}</div>
              </div>
              <div className="mt-3 flex items-center gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-slate-400">Budget</p>
                  <p className="font-bold text-slate-900">{formatCurrency(relocation.estimatedBudget)}</p>
                </div>
                {relocation.actualCost && (
                  <div>
                    <p className="text-xs text-slate-400">Actual Cost</p>
                    <p className="font-bold text-slate-900">{formatCurrency(relocation.actualCost)}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-400">Coordinator</p>
                  <p className="font-semibold text-slate-900">{relocation.assignedCoordinatorName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Days to Move</p>
                  <p className={`font-bold ${daysLeft < 0 ? 'text-red-600' : daysLeft < 7 ? 'text-amber-600' : 'text-slate-900'}`}>
                    {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft} days`}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">Overall Progress</span>
                </div>
                <ProgressBar value={relocation.completionPercentage} showLabel size="md" />
              </div>
              <p className="text-sm text-indigo-700 mt-2 font-medium">▶ Next: {getNextAction(relocation.status)}</p>
            </div>
          </div>
        </Card>

        {/* Alerts */}
        {missingDocs.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <span className="text-amber-500 text-lg shrink-0">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">Missing Documents</p>
              <p className="text-xs text-amber-700">{missingDocs.map(d => d.label).join(', ')} — required before move day</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Stage Pipeline */}
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <h3 className="font-semibold text-slate-900 mb-4">Relocation Pipeline</h3>
              <div className="space-y-3">
                {relocation.stages.map((stage, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="shrink-0">
                      {stage.status === 'completed' && <CheckCircle2 size={20} className="text-green-500" />}
                      {stage.status === 'active' && <Clock3 size={20} className="text-indigo-500 animate-pulse" />}
                      {stage.status === 'pending' && <Circle size={20} className="text-slate-300" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${stage.status === 'active' ? 'text-indigo-700' : stage.status === 'completed' ? 'text-slate-700' : 'text-slate-400'}`}>
                          {stage.label}
                        </span>
                        {stage.completedAt && <span className="text-xs text-slate-400">{formatDate(stage.completedAt)}</span>}
                        {stage.status === 'active' && <span className="text-xs text-indigo-500 font-medium">In Progress</span>}
                      </div>
                    </div>
                    {idx < relocation.stages.length - 1 && (
                      <div className="absolute left-[calc(1.25rem)] top-0 w-px h-full bg-slate-200 -z-10" />
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Tasks */}
            <Card>
              <h3 className="font-semibold text-slate-900 mb-4">Tasks ({reloTasks.length})</h3>
              {reloTasks.length === 0 ? (
                <p className="text-sm text-slate-400">No tasks yet.</p>
              ) : (
                <div className="space-y-2">
                  {reloTasks.map(task => {
                    const ts = taskStatusMap[task.status];
                    const pm = priorityMap[task.priority];
                    return (
                      <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border ${task.status === 'overdue' ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge label={ts.label} color={ts.color} bg={ts.bg} />
                            <Badge label={pm.label} color={pm.color} bg={pm.bg} />
                            <span className="text-xs text-slate-400">{task.assignedToName}</span>
                            <span className="text-xs text-slate-400">Due: {formatDate(task.dueDate)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Properties */}
            {reloProps.length > 0 && (
              <Card>
                <h3 className="font-semibold text-slate-900 mb-4">Properties ({reloProps.length})</h3>
                <div className="space-y-2">
                  {reloProps.map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">{p.address}</p>
                        <p className="text-xs text-slate-500">{p.bedrooms}BHK • {p.area} sqft • ₹{p.rent.toLocaleString('en-IN')}/mo</p>
                      </div>
                      <Badge
                        label={p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        color={p.status === 'selected' ? 'text-green-700' : p.status === 'rejected' ? 'text-red-700' : p.status === 'visited' ? 'text-amber-700' : 'text-blue-700'}
                        bg={p.status === 'selected' ? 'bg-green-100' : p.status === 'rejected' ? 'bg-red-100' : p.status === 'visited' ? 'bg-amber-100' : 'bg-blue-100'}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Utilities */}
            {reloUtils.length > 0 && (
              <Card>
                <h3 className="font-semibold text-slate-900 mb-4">Utility Setup</h3>
                <div className="grid grid-cols-2 gap-2">
                  {reloUtils.map(u => {
                    const us = utilityStatusMap[u.status];
                    const ut = utilityTypeMap[u.type];
                    return (
                      <div key={u.id} className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-xl">{ut.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-800">{ut.label}</p>
                          <p className="text-xs text-slate-500">{u.provider}</p>
                        </div>
                        <Badge label={us.label} color={us.color} bg={us.bg} />
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Documents */}
            <Card>
              <h3 className="font-semibold text-slate-900 mb-3 text-sm">Documents</h3>
              <div className="space-y-2">
                {reloDocs.map(doc => (
                  <div key={doc.id} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${doc.uploadedAt ? 'bg-green-500' : 'bg-red-400'}`} />
                    <span className="text-xs text-slate-700 flex-1">{doc.label}</span>
                    <Badge
                      label={doc.uploadedAt ? (doc.verified ? 'Verified' : 'Uploaded') : 'Missing'}
                      color={doc.uploadedAt ? (doc.verified ? 'text-green-700' : 'text-amber-700') : 'text-red-700'}
                      bg={doc.uploadedAt ? (doc.verified ? 'bg-green-100' : 'bg-amber-100') : 'bg-red-100'}
                    />
                  </div>
                ))}
                {reloDocs.length === 0 && <p className="text-xs text-slate-400">No documents tracked.</p>}
              </div>
            </Card>

            {/* Vendor Booking */}
            {reloBookings.length > 0 && (
              <Card>
                <h3 className="font-semibold text-slate-900 mb-3 text-sm">Vendor Bookings</h3>
                {reloBookings.map(vb => (
                  <div key={vb.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm font-semibold text-slate-800">{vb.vendorName}</p>
                    <p className="text-xs text-slate-500">Date: {formatDate(vb.bookingDate)}</p>
                    <p className="text-xs text-slate-500">Quote: {formatCurrency(vb.quote)}</p>
                    <div className="mt-1.5">
                      <Badge
                        label={vb.status.charAt(0).toUpperCase() + vb.status.slice(1)}
                        color={vb.status === 'confirmed' ? 'text-blue-700' : vb.status === 'completed' ? 'text-green-700' : 'text-slate-600'}
                        bg={vb.status === 'confirmed' ? 'bg-blue-100' : vb.status === 'completed' ? 'bg-green-100' : 'bg-slate-100'}
                      />
                    </div>
                  </div>
                ))}
              </Card>
            )}

            {/* Address Change */}
            {reloAddress.length > 0 && (
              <Card>
                <h3 className="font-semibold text-slate-900 mb-3 text-sm">Address Change</h3>
                <div className="space-y-1.5">
                  {reloAddress.map(a => (
                    <div key={a.id} className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${a.status === 'completed' ? 'bg-green-500' : a.status === 'submitted' ? 'bg-amber-500' : 'bg-slate-300'}`} />
                      <span className="text-xs text-slate-700 flex-1 truncate">{a.institution}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Activity Timeline */}
            <Card>
              <h3 className="font-semibold text-slate-900 mb-3 text-sm">Activity</h3>
              <div className="space-y-3">
                {reloActivity.slice(0, 5).map(ev => (
                  <div key={ev.id} className="flex gap-2">
                    <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5" />
                    <div>
                      <p className="text-xs font-medium text-slate-800">{ev.action}</p>
                      <p className="text-xs text-slate-500">{ev.description}</p>
                      <p className="text-xs text-slate-400">{ev.performedBy} • {ev.timestamp.split('T')[0]}</p>
                    </div>
                  </div>
                ))}
                {reloActivity.length === 0 && <p className="text-xs text-slate-400">No activity yet.</p>}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
