import { useState } from 'react';
import { TopNav } from '../components/layout/TopNav';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';

export function Settings() {
  const { teamMembers, corporateClients } = useStore();
  const [activeTab, setActiveTab] = useState<'general' | 'team' | 'clients' | 'notifications'>('general');

  const tabs = [
    { key: 'general', label: 'General' },
    { key: 'team', label: 'Team Members' },
    { key: 'clients', label: 'Corporate Clients' },
    { key: 'notifications', label: 'Notification Rules' },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopNav title="Settings" subtitle="Platform configuration" />
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-5">

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key as typeof activeTab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.key ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* General */}
        {activeTab === 'general' && (
          <div className="space-y-4 max-w-2xl">
            <Card>
              <CardHeader><CardTitle>Company Information</CardTitle></CardHeader>
              <div className="space-y-4">
                <Input label="Company Name" defaultValue="QuickMove Relocation Services" />
                <Input label="Operations Email" defaultValue="ops@quickmove.in" type="email" />
                <Input label="Support Phone" defaultValue="+91-9800-MOVE-IT" />
                <div className="grid grid-cols-2 gap-3">
                  <Select label="Default Currency" options={[{ value: 'INR', label: '₹ INR' }, { value: 'USD', label: '$ USD' }]} defaultValue="INR" />
                  <Select label="Timezone" options={[{ value: 'IST', label: 'Asia/Kolkata (IST)' }]} defaultValue="IST" />
                </div>
                <Button onClick={() => toast.success('Settings saved')}>Save Changes</Button>
              </div>
            </Card>
            <Card>
              <CardHeader><CardTitle>Operational Defaults</CardTitle></CardHeader>
              <div className="space-y-4">
                <Select label="Default Move Planning Lead Time" options={[{ value: '7', label: '7 days' }, { value: '14', label: '14 days' }, { value: '21', label: '21 days' }]} />
                <Select label="Document Collection Deadline" options={[{ value: '3', label: '3 days before move' }, { value: '5', label: '5 days before move' }, { value: '7', label: '7 days before move' }]} />
                <Select label="Overdue Task Alert Threshold" options={[{ value: '0', label: 'Same day as due date' }, { value: '1', label: '1 day after due date' }, { value: '2', label: '2 days after due date' }]} />
                <Button onClick={() => toast.success('Defaults saved')}>Save Defaults</Button>
              </div>
            </Card>
          </div>
        )}

        {/* Team */}
        {activeTab === 'team' && (
          <div className="space-y-4 max-w-3xl">
            <Card padding="none">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <CardTitle>Team Members</CardTitle>
                <Button size="sm" onClick={() => toast.info('Add team member feature coming soon')}>+ Add Member</Button>
              </div>
              <div className="divide-y divide-slate-50">
                {teamMembers.map(member => (
                  <div key={member.id} className="px-5 py-4 flex items-center gap-4">
                    <Avatar name={member.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.role} • {member.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-indigo-600">{member.activeRelocationCount}</p>
                      <p className="text-xs text-slate-400">active</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => toast.info('Edit member coming soon')}>Edit</Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Corporate Clients */}
        {activeTab === 'clients' && (
          <div className="space-y-4 max-w-3xl">
            <Card padding="none">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <CardTitle>Corporate Clients</CardTitle>
                <Button size="sm" onClick={() => toast.info('Add client feature coming soon')}>+ Add Client</Button>
              </div>
              <div className="divide-y divide-slate-50">
                {corporateClients.map(client => (
                  <div key={client.id} className="px-5 py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{client.name}</p>
                        <p className="text-sm text-slate-600 mt-0.5">{client.contactName} • {client.contactEmail}</p>
                        <p className="text-xs text-slate-400">{client.contactPhone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-indigo-600">{client.activeRelocations}</p>
                        <p className="text-xs text-slate-400">active / {client.totalRelocations} total</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-4 max-w-2xl">
            <Card>
              <CardHeader><CardTitle>Notification Rules</CardTitle></CardHeader>
              <div className="space-y-4">
                {[
                  { label: 'Alert when task is overdue', defaultChecked: true },
                  { label: 'Alert when document is missing 7 days before move', defaultChecked: true },
                  { label: 'Alert when move is in 3 days', defaultChecked: true },
                  { label: 'Alert when utility not set up after move', defaultChecked: true },
                  { label: 'Alert on coordinator workload exceeding 5 cases', defaultChecked: true },
                  { label: 'Daily digest email to Operations Manager', defaultChecked: false },
                  { label: 'WhatsApp notification on stage change', defaultChecked: false },
                ].map(rule => (
                  <label key={rule.label} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked={rule.defaultChecked}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900">{rule.label}</span>
                  </label>
                ))}
                <Button onClick={() => toast.success('Notification rules saved')}>Save Rules</Button>
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
