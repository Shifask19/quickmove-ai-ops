import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Input';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';
import type { Relocation, RelocationStage, RelocationStatus } from '../types';

const STAGE_LABELS: { stage: RelocationStatus; label: string }[] = [
  { stage: 'inquiry', label: 'Inquiry' },
  { stage: 'onboarding', label: 'Onboarding' },
  { stage: 'property_search', label: 'Property Search' },
  { stage: 'property_finalized', label: 'Property Finalized' },
  { stage: 'move_planning', label: 'Move Planning' },
  { stage: 'packing_moving', label: 'Packing & Moving' },
  { stage: 'utility_setup', label: 'Utility Setup' },
  { stage: 'address_change', label: 'Address Change' },
  { stage: 'post_move_support', label: 'Post-Move Support' },
  { stage: 'completed', label: 'Completed' },
];

export function NewRelocation() {
  const navigate = useNavigate();
  const { customers, teamMembers, addRelocation } = useStore();
  const [form, setForm] = useState({
    customerId: '', fromCity: '', fromAddress: '', toCity: '', toAddress: '',
    moveDate: '', priority: 'medium', estimatedBudget: '', assignedCoordinatorId: 'tm2', notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.customerId) e.customerId = 'Select a customer';
    if (!form.fromCity.trim()) e.fromCity = 'From city required';
    if (!form.toCity.trim()) e.toCity = 'To city required';
    if (!form.moveDate) e.moveDate = 'Move date required';
    if (!form.estimatedBudget || isNaN(Number(form.estimatedBudget))) e.estimatedBudget = 'Valid budget required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    const customer = customers.find(c => c.id === form.customerId);
    const coordinator = teamMembers.find(t => t.id === form.assignedCoordinatorId);

    const stages: RelocationStage[] = STAGE_LABELS.map((s, idx) => ({
      stage: s.stage, label: s.label,
      status: idx === 0 ? 'active' : 'pending',
      startedAt: idx === 0 ? new Date().toISOString().split('T')[0] : undefined,
    }));

    const newRelocation: Relocation = {
      id: `r${Date.now()}`,
      customerId: form.customerId,
      customerName: customer?.name ?? '',
      customerPhone: customer?.phone ?? '',
      customerEmail: customer?.email ?? '',
      fromCity: form.fromCity, fromAddress: form.fromAddress,
      toCity: form.toCity, toAddress: form.toAddress,
      moveDate: form.moveDate,
      status: 'inquiry',
      priority: form.priority as Relocation['priority'],
      estimatedBudget: Number(form.estimatedBudget),
      assignedCoordinatorId: form.assignedCoordinatorId,
      assignedCoordinatorName: coordinator?.name ?? '',
      notes: form.notes,
      createdAt: new Date().toISOString().split('T')[0],
      stages,
      completionPercentage: 5,
    };

    setTimeout(() => {
      addRelocation(newRelocation);
      toast.success(`Relocation created for ${customer?.name}`);
      setLoading(false);
      navigate('/relocations');
    }, 500);
  }

  const activeCoords = teamMembers.filter(t => t.role.includes('Coordinator') || t.role.includes('Manager'));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopNav title="New Relocation" subtitle="Create a new relocation case" />
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6">
        <div className="max-w-2xl space-y-5">

          <Button variant="ghost" size="sm" icon={<ArrowLeft size={15} />} onClick={() => navigate('/relocations')}>
            Back to Relocations
          </Button>

          <Card>
            <CardHeader><CardTitle>Customer & Assignment</CardTitle></CardHeader>
            <div className="space-y-4">
              <Select label="Customer" value={form.customerId} onChange={e => setForm(f => ({ ...f, customerId: e.target.value }))}
                error={errors.customerId}
                options={[{ value: '', label: 'Select customer...' }, ...customers.map(c => ({ value: c.id, label: `${c.name} (${c.phone})` }))]} />
              <Select label="Assigned Coordinator" value={form.assignedCoordinatorId} onChange={e => setForm(f => ({ ...f, assignedCoordinatorId: e.target.value }))}
                options={activeCoords.map(t => ({ value: t.id, label: `${t.name} — ${t.activeRelocationCount} active` }))} />
              <Select label="Priority" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'urgent', label: 'Urgent' }]} />
            </div>
          </Card>

          <Card>
            <CardHeader><CardTitle>Move Details</CardTitle></CardHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input label="From City" placeholder="e.g. Mumbai" value={form.fromCity} onChange={e => setForm(f => ({ ...f, fromCity: e.target.value }))} error={errors.fromCity} />
                <Input label="To City" placeholder="e.g. Bangalore" value={form.toCity} onChange={e => setForm(f => ({ ...f, toCity: e.target.value }))} error={errors.toCity} />
              </div>
              <Input label="Current Address" placeholder="Full current address" value={form.fromAddress} onChange={e => setForm(f => ({ ...f, fromAddress: e.target.value }))} />
              <Input label="New Address (if known)" placeholder="Destination address" value={form.toAddress} onChange={e => setForm(f => ({ ...f, toAddress: e.target.value }))} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Target Move Date" type="date" value={form.moveDate} onChange={e => setForm(f => ({ ...f, moveDate: e.target.value }))} error={errors.moveDate} />
                <Input label="Estimated Budget (₹)" type="number" placeholder="e.g. 75000" value={form.estimatedBudget} onChange={e => setForm(f => ({ ...f, estimatedBudget: e.target.value }))} error={errors.estimatedBudget} />
              </div>
              <Textarea label="Notes" placeholder="Any initial notes about this relocation..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} />
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => navigate('/relocations')}>Cancel</Button>
            <Button onClick={handleSubmit} loading={loading}>Create Relocation</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
