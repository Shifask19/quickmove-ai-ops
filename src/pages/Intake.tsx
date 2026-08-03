import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Zap, CheckCircle, Copy, ArrowRight, RefreshCw } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';

// ─── WhatsApp message parser ─────────────────────────────────────────────────
function parseWhatsAppMessage(text: string) {
  const result: Record<string, string> = {};

  const patterns = [
    { key: 'name',          regex: /(?:my name is|i am|i'm|name[:\-\s]+)([A-Z][a-z]+(?: [A-Z][a-z]+)+)/i },
    { key: 'phone',         regex: /(?:phone|mobile|contact|number)[:\s]*([6-9]\d{9})/i },
    { key: 'phone2',        regex: /\b([6-9]\d{9})\b/ },
    { key: 'email',         regex: /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i },
    { key: 'fromCity',      regex: /(?:from|moving from|currently in|shifting from)[:\s]+([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/i },
    { key: 'toCity',        regex: /(?:to|moving to|relocating to|shifting to|new city)[:\s]+([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/i },
    { key: 'moveDate',      regex: /(?:move date|moving on|date of move|shifting on)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i },
    { key: 'budget',        regex: /(?:budget|can pay|afford|max)[:\s]*(?:rs\.?|inr|₹)?\s*(\d[\d,]+)/i },
    { key: 'bedrooms',      regex: /(\d)\s*(?:bhk|bedroom|bed room|br)/i },
    { key: 'familySize',    regex: /(?:family of|family size|members?)[:\s]*(\d+)/i },
    { key: 'corporate',     regex: /(?:company|employer|organisation|organization)[:\s]+([A-Z][A-Za-z\s&]+)/i },
  ];

  for (const { key, regex } of patterns) {
    const match = text.match(regex);
    if (match?.[1] && !result[key.replace('2', '')]) {
      result[key.replace('2', '')] = match[1].trim();
    }
  }

  // Parse move date to ISO
  if (result.moveDate) {
    const d = new Date(result.moveDate.replace(/\//g, '-'));
    if (!isNaN(d.getTime())) result.moveDate = d.toISOString().split('T')[0];
  }

  // Clean budget
  if (result.budget) result.budget = result.budget.replace(/,/g, '');

  return result;
}

const SAMPLE_MESSAGES = [
  `Hi, my name is Arjun Mehta. I'm planning to relocate from Mumbai to Bangalore next month. My move date is 15/09/2026. I need a 2 BHK apartment, budget around Rs. 35,000 per month. My phone number is 9876001234 and email is arjun.mehta@gmail.com. Family of 3.`,
  `Hello! I work at Infosys and they are relocating me. My name is Priya Krishnan. Moving from Hyderabad to Pune on 20/08/2026. Need 3 BHK, budget is 45000. Contact: 9900112200, priya.k@infosys.com`,
  `I want to move from Delhi to Chennai. Name is Rahul Sharma, shifting on 1 Sep 2026. Budget Rs 28,000, need 1 BHK. My number is 9811223344.`,
];

export function Intake() {
  const navigate = useNavigate();
  const { customers, teamMembers, addCustomer } = useStore();
  const [message, setMessage] = useState('');
  const [parsed, setParsed] = useState<Record<string, string> | null>(null);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', fromCity: '', toCity: '',
    moveDate: '', budget: '', bedrooms: '', familySize: '',
    coordinatorId: 'tm2', type: 'individual', corporate: '',
  });
  const [step, setStep] = useState<'input' | 'review' | 'done'>('input');

  function handleParse() {
    if (!message.trim()) { toast.error('Paste a WhatsApp message first'); return; }
    const result = parseWhatsAppMessage(message);
    if (Object.keys(result).length < 2) {
      toast.warning('Could not extract enough data. Try one of the sample messages or fill manually.');
    }
    setParsed(result);
    setForm(f => ({
      ...f,
      name:       result.name       || '',
      phone:      result.phone      || '',
      email:      result.email      || '',
      fromCity:   result.fromCity   || '',
      toCity:     result.toCity     || '',
      moveDate:   result.moveDate   || '',
      budget:     result.budget     || '',
      bedrooms:   result.bedrooms   || '2',
      familySize: result.familySize || '',
      corporate:  result.corporate  || '',
      type:       result.corporate  ? 'corporate' : 'individual',
    }));
    setStep('review');
    toast.success('Message parsed — review and confirm the details');
  }

  function loadSample(idx: number) {
    setMessage(SAMPLE_MESSAGES[idx]);
    toast.info('Sample message loaded — click Parse');
  }

  async function handleSubmit() {
    if (!form.name || !form.phone) { toast.error('Name and phone are required'); return; }
    const coord = teamMembers.find(t => t.id === form.coordinatorId);

    await addCustomer({
      name: form.name, phone: form.phone, email: form.email,
      type: form.type as 'individual' | 'corporate',
      corporateClientName: form.corporate || undefined,
      assignedCoordinatorId: form.coordinatorId,
      assignedCoordinatorName: coord?.name ?? '',
      notes: `From intake parser. ${form.familySize ? `Family of ${form.familySize}.` : ''} Bedrooms: ${form.bedrooms || 'N/A'}.`,
    });

    toast.success(`${form.name} added as customer`);
    setStep('done');
  }

  function reset() {
    setMessage(''); setParsed(null);
    setForm({ name:'',phone:'',email:'',fromCity:'',toCity:'',moveDate:'',budget:'',bedrooms:'',familySize:'',coordinatorId:'tm2',type:'individual',corporate:'' });
    setStep('input');
  }

  const fields = [
    { key: 'name', label: 'Full Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'fromCity', label: 'From City' },
    { key: 'toCity', label: 'To City' },
    { key: 'moveDate', label: 'Move Date' },
    { key: 'budget', label: 'Budget (₹/mo)' },
    { key: 'bedrooms', label: 'Bedrooms' },
    { key: 'familySize', label: 'Family Size' },
    { key: 'corporate', label: 'Company (if corporate)' },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopNav title="WhatsApp Intake Parser" subtitle="Convert WhatsApp messages to structured customer records" />
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-5">

        {/* How it works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: '💬', title: 'Paste WhatsApp', desc: 'Paste a customer message exactly as received' },
            { icon: '⚡', title: 'Auto Parse', desc: 'AI extracts name, phone, cities, budget, move date' },
            { icon: '✅', title: 'Review & Save', desc: 'Confirm, edit if needed, save as customer record' },
          ].map(s => (
            <Card key={s.title} className="flex items-start gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{s.title}</p>
                <p className="text-xs text-slate-500">{s.desc}</p>
              </div>
            </Card>
          ))}
        </div>

        {step === 'done' ? (
          <Card className="text-center py-12">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Customer Created!</h2>
            <p className="text-slate-500 mb-6">The customer has been added. Now create a relocation case for them.</p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="secondary" icon={<RefreshCw size={15} />} onClick={reset}>Parse Another</Button>
              <Button icon={<ArrowRight size={15} />} onClick={() => navigate('/relocations/new')}>Create Relocation</Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Input panel */}
            <Card>
              <CardHeader>
                <CardTitle>Paste WhatsApp Message</CardTitle>
                <div className="flex gap-2">
                  {[1, 2, 3].map(i => (
                    <button key={i} onClick={() => loadSample(i - 1)}
                      className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-700">
                      Sample {i}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Paste customer WhatsApp message here...&#10;&#10;e.g. Hi, my name is Rahul Sharma. I want to relocate from Delhi to Bangalore on 15th August. Budget around 40,000. Phone: 9876543210"
                rows={10}
                className="w-full border border-slate-200 rounded-lg p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <div className="flex gap-3 mt-4">
                <Button icon={<Zap size={15} />} onClick={handleParse} className="flex-1">Parse Message</Button>
                {message && <Button variant="ghost" onClick={() => setMessage('')}>Clear</Button>}
              </div>
            </Card>

            {/* Parsed / form panel */}
            <Card>
              <CardHeader>
                <CardTitle>{step === 'review' ? 'Review Extracted Data' : 'Extracted Fields'}</CardTitle>
                {parsed && (
                  <Badge
                    label={`${Object.values(form).filter(v => v).length} fields detected`}
                    color="text-green-700" bg="bg-green-100"
                  />
                )}
              </CardHeader>

              {!parsed ? (
                <div className="py-12 text-center text-slate-400">
                  <MessageSquare size={40} className="mx-auto mb-3 text-slate-200" />
                  <p className="text-sm">Paste a message and click Parse to extract data</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {fields.map(f => (
                    <div key={f.key} className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${form[f.key as keyof typeof form] ? 'bg-green-500' : 'bg-slate-300'}`} />
                      <Input
                        label={f.label}
                        value={form[f.key as keyof typeof form]}
                        onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  ))}

                  <Select label="Assign Coordinator" value={form.coordinatorId}
                    onChange={e => setForm(f => ({ ...f, coordinatorId: e.target.value }))}
                    options={teamMembers.filter(t => t.role.includes('Coordinator') || t.role.includes('Manager'))
                      .map(t => ({ value: t.id, label: `${t.name} (${t.activeRelocationCount} active)` }))}
                  />

                  <Select label="Customer Type" value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    options={[{ value: 'individual', label: 'Individual' }, { value: 'corporate', label: 'Corporate' }]}
                  />

                  <div className="flex gap-3 pt-2">
                    <Button variant="secondary" onClick={reset}>Reset</Button>
                    <Button icon={<CheckCircle size={15} />} onClick={handleSubmit} className="flex-1">
                      Create Customer Record
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Recent customers */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Recently Added Customers</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {customers.slice(0, 5).map(c => (
              <div key={c.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.phone} • {c.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge label={c.type} color={c.type === 'corporate' ? 'text-indigo-700' : 'text-slate-600'} bg={c.type === 'corporate' ? 'bg-indigo-100' : 'bg-slate-100'} />
                  <Button size="sm" variant="ghost" icon={<Copy size={12} />} onClick={() => { navigator.clipboard.writeText(c.phone); toast.success('Phone copied'); }}>Copy</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
