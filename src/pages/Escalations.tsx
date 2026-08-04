import { useState } from 'react';
import { AlertOctagon, Plus, Search, CheckCircle } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input, Select, Textarea } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { useStore } from '../store/useStore';
import { formatDateTime } from '../lib/utils';
import { toast } from 'sonner';

type EscalationStatus = 'open' | 'in_progress' | 'resolved' | 'escalated';
type EscalationCategory = 'vendor_no_show' | 'property_issue' | 'utility_failure' | 'customer_complaint' | 'ops_absence' | 'payment_dispute' | 'document_block' | 'other';

interface Escalation {
  id: string;
  relocationId: string;
  customerName: string;
  title: string;
  description: string;
  category: EscalationCategory;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: EscalationStatus;
  assignedTo: string;
  raisedBy: string;
  raisedAt: string;
  resolvedAt?: string;
  resolution?: string;
  updates: { note: string; by: string; at: string }[];
}

const INITIAL_ESCALATIONS: Escalation[] = [
  {
    id: 'esc1', relocationId: 'r2', customerName: 'Neha Kapoor',
    title: 'Property partner went silent — no listings sent for 5 days',
    description: 'Broker Mohan Realty has not responded to 3 WhatsApp messages and 2 calls since July 28. Customer move date is Aug 5.',
    category: 'property_issue', severity: 'critical', status: 'open',
    assignedTo: 'Sneha Patel', raisedBy: 'Sneha Patel', raisedAt: '2026-08-02T14:00:00',
    updates: [
      { note: 'Tried calling at 2pm, no answer', by: 'Sneha Patel', at: '2026-08-02T14:30:00' },
      { note: 'Escalated to Operations Manager', by: 'Sneha Patel', at: '2026-08-02T16:00:00' },
    ],
  },
  {
    id: 'esc2', relocationId: 'r4', customerName: 'Sunita Rao',
    title: 'Mover arrived 3 hours late on move day',
    description: 'Swift Packers arrived at 10am instead of 7am. Customer is upset. New property access expires at 6pm.',
    category: 'vendor_no_show', severity: 'high', status: 'in_progress',
    assignedTo: 'Arjun Nair', raisedBy: 'Arjun Nair', raisedAt: '2026-07-28T10:15:00',
    updates: [
      { note: 'Vendor claims traffic delay on Western Express Highway', by: 'Arjun Nair', at: '2026-07-28T10:20:00' },
      { note: 'Negotiated 2-hour extension with new property security', by: 'Arjun Nair', at: '2026-07-28T10:45:00' },
    ],
  },
  {
    id: 'esc3', relocationId: 'r3', customerName: 'Rohan Desai',
    title: 'Electricity connection delayed — customer has no power',
    description: 'TNEB connection applied on Aug 2, activation expected Aug 5 but not done. Customer moved in Aug 3.',
    category: 'utility_failure', severity: 'high', status: 'resolved',
    assignedTo: 'Rahul Verma', raisedBy: 'Rahul Verma', raisedAt: '2026-08-04T09:00:00',
    resolvedAt: '2026-08-05T16:00:00',
    resolution: 'Called TNEB supervisor directly. Connection activated same day after escalation.',
    updates: [
      { note: 'Normal channel not working — TNEB helpline unreachable', by: 'Rahul Verma', at: '2026-08-04T11:00:00' },
      { note: 'Got supervisor contact from city ops database, escalated directly', by: 'Rahul Verma', at: '2026-08-05T10:00:00' },
    ],
  },
];

const categoryLabels: Record<EscalationCategory, string> = {
  vendor_no_show: 'Vendor No-Show', property_issue: 'Property Issue',
  utility_failure: 'Utility Failure', customer_complaint: 'Customer Complaint',
  ops_absence: 'Ops Absence', payment_dispute: 'Payment Dispute',
  document_block: 'Document Block', other: 'Other',
};

const severityConfig = {
  critical: { color: 'text-red-700',    bg: 'bg-red-100'    },
  high:     { color: 'text-orange-700', bg: 'bg-orange-100' },
  medium:   { color: 'text-amber-700',  bg: 'bg-amber-100'  },
  low:      { color: 'text-slate-600',  bg: 'bg-slate-100'  },
};

const statusConfig = {
  open:        { color: 'text-red-700',    bg: 'bg-red-100'    },
  in_progress: { color: 'text-blue-700',   bg: 'bg-blue-100'   },
  resolved:    { color: 'text-green-700',  bg: 'bg-green-100'  },
  escalated:   { color: 'text-purple-700', bg: 'bg-purple-100' },
};

export function Escalations() {
  const { relocations, teamMembers } = useStore();
  const [escalations, setEscalations] = useState<Escalation[]>(INITIAL_ESCALATIONS);
  const [filter, setFilter] = useState<'all' | EscalationStatus>('all');
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [updateNote, setUpdateNote] = useState('');

  const [form, setForm] = useState({
    relocationId: '', title: '', description: '',
    category: 'other', severity: 'medium', assignedTo: 'tm2',
  });

  const filtered = escalations.filter(e => {
    const matchFilter = filter === 'all' || e.status === filter;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.customerName.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const selected = escalations.find(e => e.id === selectedId);

  const counts = {
    open: escalations.filter(e => e.status === 'open').length,
    in_progress: escalations.filter(e => e.status === 'in_progress').length,
    resolved: escalations.filter(e => e.status === 'resolved').length,
  };

  function addUpdate() {
    if (!updateNote.trim() || !selectedId) return;
    setEscalations(es => es.map(e => e.id === selectedId ? {
      ...e,
      updates: [...e.updates, { note: updateNote, by: 'Priya Sharma', at: new Date().toISOString() }],
    } : e));
    setUpdateNote('');
    toast.success('Update added');
  }

  function resolve() {
    if (!selectedId) return;
    setEscalations(es => es.map(e => e.id === selectedId ? {
      ...e, status: 'resolved', resolvedAt: new Date().toISOString(),
    } : e));
    toast.success('Escalation marked as resolved');
  }

  function createEscalation() {
    const relo = relocations.find(r => r.id === form.relocationId);
    const member = teamMembers.find(t => t.id === form.assignedTo);
    const newEsc: Escalation = {
      id: `esc${Date.now()}`, relocationId: form.relocationId,
      customerName: relo?.customerName ?? 'Unknown',
      title: form.title, description: form.description,
      category: form.category as EscalationCategory,
      severity: form.severity as Escalation['severity'],
      status: 'open', assignedTo: member?.name ?? '',
      raisedBy: 'Priya Sharma', raisedAt: new Date().toISOString(),
      updates: [],
    };
    setEscalations(e => [newEsc, ...e]);
    toast.success('Escalation raised');
    setAddOpen(false);
    setForm({ relocationId: '', title: '', description: '', category: 'other', severity: 'medium', assignedTo: 'tm2' });
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopNav title="Escalations" subtitle="Exception handling and issue resolution" />
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-5">

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'open', label: 'Open', count: counts.open },
            { key: 'in_progress', label: 'In Progress', count: counts.in_progress },
            { key: 'resolved', label: 'Resolved', count: counts.resolved },
          ].map(s => {
            const sc = statusConfig[s.key as EscalationStatus];
            return (
              <button key={s.key} onClick={() => setFilter(filter === s.key ? 'all' : s.key as EscalationStatus)}
                className={`p-4 rounded-xl border text-left transition-all ${filter === s.key ? 'border-indigo-400 bg-indigo-50' : 'bg-white border-slate-200'}`}>
                <p className="text-2xl font-bold text-slate-900">{s.count}</p>
                <Badge label={s.label} color={sc.color} bg={sc.bg} />
              </button>
            );
          })}
        </div>

        {/* Filters + actions */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-48">
            <Search size={15} className="text-slate-400" />
            <input placeholder="Search escalations..." value={search} onChange={e => setSearch(e.target.value)}
              className="text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none flex-1 bg-transparent" />
          </div>
          <Button icon={<Plus size={15} />} variant="danger" onClick={() => setAddOpen(true)}>Raise Escalation</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* List */}
          <div className="space-y-3">
            {filtered.map(esc => {
              const sc = severityConfig[esc.severity];
              const st = statusConfig[esc.status];
              return (
                <Card key={esc.id} hover onClick={() => setSelectedId(esc.id)}
                  className={`border-l-4 ${esc.severity === 'critical' ? 'border-l-red-500' : esc.severity === 'high' ? 'border-l-orange-500' : 'border-l-amber-400'} ${selectedId === esc.id ? 'ring-2 ring-indigo-400' : ''}`}>
                  <div className="flex items-start gap-3">
                    <Avatar name={esc.customerName} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm leading-snug">{esc.title}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <Badge label={esc.severity} color={sc.color} bg={sc.bg} />
                        <Badge label={esc.status.replace('_', ' ')} color={st.color} bg={st.bg} />
                        <span className="text-xs text-indigo-600 font-medium">{esc.customerName}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{formatDateTime(esc.raisedAt)} • {esc.assignedTo}</p>
                    </div>
                    {esc.status === 'open' && (
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5 animate-pulse" />
                    )}
                  </div>
                </Card>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <AlertOctagon size={40} className="text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400">No escalations found</p>
              </div>
            )}
          </div>

          {/* Detail */}
          {selected ? (
            <Card className="sticky top-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900">{selected.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{categoryLabels[selected.category]} • {selected.customerName}</p>
                </div>
                <div className="flex gap-2">
                  <Badge label={selected.severity} color={severityConfig[selected.severity].color} bg={severityConfig[selected.severity].bg} />
                  <Badge label={selected.status.replace('_', ' ')} color={statusConfig[selected.status].color} bg={statusConfig[selected.status].bg} />
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-4">{selected.description}</p>

              <div className="text-xs text-slate-500 mb-4 flex gap-4">
                <span>Raised by: <strong>{selected.raisedBy}</strong></span>
                <span>Assigned: <strong>{selected.assignedTo}</strong></span>
              </div>

              {/* Updates */}
              <div className="border-t border-slate-100 pt-4 mb-4">
                <p className="text-xs font-bold text-slate-500 uppercase mb-3">Updates</p>
                <div className="space-y-3">
                  {selected.updates.map((u, i) => (
                    <div key={i} className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <div>
                        <p className="text-sm text-slate-700">{u.note}</p>
                        <p className="text-xs text-slate-400">{u.by} • {formatDateTime(u.at)}</p>
                      </div>
                    </div>
                  ))}
                  {selected.resolution && (
                    <div className="flex gap-2 bg-green-50 p-2.5 rounded-lg border border-green-200">
                      <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-green-700">Resolution</p>
                        <p className="text-sm text-green-800">{selected.resolution}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selected.status !== 'resolved' && (
                <div className="space-y-3">
                  <Textarea
                    label="Add Update"
                    value={updateNote}
                    onChange={e => setUpdateNote(e.target.value)}
                    placeholder="What action was taken?"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={addUpdate} className="flex-1">Add Note</Button>
                    <Button size="sm" variant="primary" onClick={resolve} icon={<CheckCircle size={13} />}>
                      Resolve
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="flex items-center justify-center py-16 text-center">
              <div>
                <AlertOctagon size={40} className="text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Select an escalation to view details</p>
              </div>
            </Card>
          )}
        </div>

      </div>

      {/* Add Escalation Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Raise Escalation" size="md"
        footer={<><Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button><Button variant="danger" onClick={createEscalation}>Raise Escalation</Button></>}>
        <div className="space-y-4">
          <Select label="Relocation" value={form.relocationId} onChange={e => setForm(f => ({ ...f, relocationId: e.target.value }))}
            options={[{ value: '', label: 'Select relocation...' }, ...relocations.filter(r => !['completed','cancelled'].includes(r.status)).map(r => ({ value: r.id, label: `${r.customerName} — ${r.fromCity}→${r.toCity}` }))]} />
          <Input label="Title" placeholder="e.g. Vendor went silent 2 days before move" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <Textarea label="Description" placeholder="Describe what happened and what impact it has..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              options={Object.entries(categoryLabels).map(([k, v]) => ({ value: k, label: v }))} />
            <Select label="Severity" value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}
              options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'critical', label: 'Critical' }]} />
          </div>
          <Select label="Assign To" value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}
            options={teamMembers.map(t => ({ value: t.id, label: `${t.name} (${t.role})` }))} />
        </div>
      </Modal>
    </div>
  );
}
