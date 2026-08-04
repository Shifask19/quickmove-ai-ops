import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Phone, Mail } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';
import { useStore } from '../store/useStore';
import { formatDate } from '../lib/utils';
import { toast } from 'sonner';
import type { Customer } from '../types';

function AddCustomerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addCustomer, teamMembers, corporateClients } = useStore();
  const [form, setForm] = useState({ name: '', phone: '', email: '', type: 'individual', corporateClientId: '', assignedCoordinatorId: 'tm2', notes: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) e.phone = 'Valid 10-digit phone required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.assignedCoordinatorId) e.assignedCoordinatorId = 'Assign a coordinator';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const coordinator = teamMembers.find(t => t.id === form.assignedCoordinatorId);
    const corp = corporateClients.find(c => c.id === form.corporateClientId);
    const newCustomer: Customer = {
      id: `c${Date.now()}`, name: form.name, phone: form.phone, email: form.email,
      type: form.type as 'individual' | 'corporate',
      corporateClientId: form.type === 'corporate' ? form.corporateClientId : undefined,
      corporateClientName: form.type === 'corporate' ? corp?.name : undefined,
      assignedCoordinatorId: form.assignedCoordinatorId,
      assignedCoordinatorName: coordinator?.name ?? '',
      createdAt: new Date().toISOString().split('T')[0],
      notes: form.notes,
    };
    addCustomer(newCustomer);
    toast.success(`Customer ${form.name} added successfully`);
    onClose();
    setForm({ name: '', phone: '', email: '', type: 'individual', corporateClientId: '', assignedCoordinatorId: 'tm2', notes: '' });
  }

  return (
    <Modal open={open} onClose={onClose} title="Add New Customer" size="md"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSubmit}>Add Customer</Button></>}>
      <div className="space-y-4">
        <Input label="Full Name" placeholder="e.g. Rajesh Kumar" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} error={errors.name} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Phone" placeholder="10-digit number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} error={errors.phone} />
          <Input label="Email" type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} error={errors.email} />
        </div>
        <Select label="Customer Type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
          options={[{ value: 'individual', label: 'Individual' }, { value: 'corporate', label: 'Corporate' }]} />
        {form.type === 'corporate' && (
          <Select label="Corporate Client" value={form.corporateClientId} onChange={e => setForm(f => ({ ...f, corporateClientId: e.target.value }))}
            options={[{ value: '', label: 'Select client...' }, ...corporateClients.map(c => ({ value: c.id, label: c.name }))]} />
        )}
        <Select label="Assigned Coordinator" value={form.assignedCoordinatorId} onChange={e => setForm(f => ({ ...f, assignedCoordinatorId: e.target.value }))}
          error={errors.assignedCoordinatorId}
          options={teamMembers.filter(t => t.role.includes('Coordinator') || t.role.includes('Manager')).map(t => ({ value: t.id, label: `${t.name} (${t.role})` }))} />
        <Input label="Notes (optional)" placeholder="Any special instructions..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
      </div>
    </Modal>
  );
}

export function Customers() {
  const { customers, relocations } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [addOpen, setAddOpen] = useState(false);

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchType = typeFilter === 'all' || c.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopNav title="Customers" subtitle={`${customers.length} total customers`} />
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-48">
            <Search size={15} className="text-slate-400" />
            <input placeholder="Search by name, email, phone..." value={search} onChange={e => setSearch(e.target.value)}
              className="text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none flex-1 bg-transparent" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="all">All Types</option>
            <option value="individual">Individual</option>
            <option value="corporate">Corporate</option>
          </select>
          <Button icon={<Plus size={15} />} onClick={() => setAddOpen(true)}>Add Customer</Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(customer => {
            const activeRelo = relocations.filter(r => r.customerId === customer.id && !['completed', 'cancelled'].includes(r.status));
            return (
              <Card key={customer.id} hover onClick={() => navigate(`/relocations?customer=${customer.id}`)}>
                <div className="flex items-start gap-3">
                  <Avatar name={customer.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">{customer.name}</span>
                      <Badge
                        label={customer.type === 'corporate' ? 'Corporate' : 'Individual'}
                        color={customer.type === 'corporate' ? 'text-indigo-700' : 'text-slate-600'}
                        bg={customer.type === 'corporate' ? 'bg-indigo-100' : 'bg-slate-100'}
                      />
                    </div>
                    {customer.corporateClientName && (
                      <p className="text-xs text-indigo-600 mt-0.5">{customer.corporateClientName}</p>
                    )}
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Phone size={11} /><span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Mail size={11} /><span className="truncate">{customer.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Coordinator: <span className="font-medium text-slate-700">{customer.assignedCoordinatorName}</span>
                  </div>
                  <Badge
                    label={activeRelo.length > 0 ? `${activeRelo.length} active` : 'No active'}
                    color={activeRelo.length > 0 ? 'text-green-700' : 'text-slate-500'}
                    bg={activeRelo.length > 0 ? 'bg-green-100' : 'bg-slate-100'}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">Added {formatDate(customer.createdAt)}</p>
              </Card>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">No customers found matching your search.</div>
        )}
      </div>
      <AddCustomerModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
