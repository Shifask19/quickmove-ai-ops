import { useState } from 'react';
import { MapPin, ChevronDown, ChevronRight, Plus, BookOpen } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { toast } from 'sonner';

interface PlaybookEntry {
  category: string;
  items: { label: string; detail: string; critical?: boolean }[];
}

interface CityPlaybook {
  city: string;
  state: string;
  status: 'active' | 'draft';
  lastUpdated: string;
  propertyPartners: { name: string; phone: string; area: string }[];
  moversPartners: { name: string; phone: string; rating: number }[];
  entries: PlaybookEntry[];
}

const PLAYBOOKS: CityPlaybook[] = [
  {
    city: 'Mumbai', state: 'Maharashtra', status: 'active', lastUpdated: '2026-07-15',
    propertyPartners: [
      { name: 'Suresh Broker', phone: '9811223344', area: 'Bandra, Andheri, Powai' },
      { name: 'Mumbai Homes', phone: '9922334455', area: 'Thane, Navi Mumbai' },
    ],
    moversPartners: [
      { name: 'Swift Packers & Movers', phone: '9800111222', rating: 4.5 },
    ],
    entries: [
      { category: 'Property Notes', items: [
        { label: 'Society NOC required', detail: 'Most CHS societies require NOC from previous resident — get this 1 week before move', critical: true },
        { label: 'Parking allocation', detail: 'Confirm parking slot with new society before move-in' },
        { label: 'Maintenance deposit', detail: 'Typically 2–3 months advance required at society office' },
      ]},
      { category: 'Utilities', items: [
        { label: 'Electricity — MSEDCL', detail: 'Transfer application + Aadhaar + meter number. Office visit required. Allow 7 days.', critical: true },
        { label: 'Gas — Mahanagar Gas', detail: 'Online transfer via MGL website or nearest office. 3–5 days.', critical: true },
        { label: 'Internet — JioFiber / Airtel', detail: 'Call 1800 number with new address, technician in 2–3 days' },
      ]},
      { category: 'Address Change', items: [
        { label: 'Bank address update', detail: 'HDFC/SBI/ICICI — visit nearest branch with new lease agreement + Aadhaar', critical: true },
        { label: 'Aadhaar update', detail: 'Book appointment at nearest Aadhaar Kendra. Takes 30–45 days processing.' },
        { label: 'Vehicle RC address', detail: 'RTO Bandra/Andheri — Form 33, insurance copy, new address proof. Allow 30 days.' },
      ]},
      { category: 'Local Orientation', items: [
        { label: 'Hospitals', detail: 'Lilavati (Bandra), Kokilaben (Andheri), Nanavati (Vile Parle)' },
        { label: 'Grocery', detail: 'D-Mart, Nature\'s Basket, Big Basket delivery active in most areas' },
        { label: 'Auto/Taxi', detail: 'Ola, Uber fully operational. Rapido for short trips.' },
      ]},
    ],
  },
  {
    city: 'Bangalore', state: 'Karnataka', status: 'active', lastUpdated: '2026-07-20',
    propertyPartners: [
      { name: 'Prestige Props', phone: '9944556677', area: 'Whitefield, Indiranagar, Koramangala' },
      { name: 'BLR Homes', phone: '9955667788', area: 'HSR, Electronic City, Marathahalli' },
    ],
    moversPartners: [
      { name: 'SafeMove Logistics', phone: '9800222333', rating: 4.2 },
    ],
    entries: [
      { category: 'Property Notes', items: [
        { label: 'Police verification', detail: 'Mandatory for all tenants. Landlord files form at local station. 7–10 days.', critical: true },
        { label: 'Maintenance advance', detail: '1–3 months advance deposit common in Bangalore apartments' },
        { label: 'Traffic zones', detail: 'Whitefield and Electronic City have peak-hour traffic — plan move for early morning' },
      ]},
      { category: 'Utilities', items: [
        { label: 'Electricity — BESCOM', detail: 'Name transfer + Aadhaar + meter reading at BESCOM subdivision office. 5–7 days.', critical: true },
        { label: 'Water — BWSSB', detail: 'Ownership transfer application at BWSSB office. 1–2 weeks.' },
        { label: 'Internet — ACT Fibernet / Airtel', detail: 'ACT is dominant in Bangalore. Strong in Indiranagar, Koramangala. 1–2 day install.' },
      ]},
      { category: 'Address Change', items: [
        { label: 'Aadhaar update', detail: 'Book at Nadakacheri or Post Office. Karnataka processes faster than most states (15–20 days).' },
        { label: 'Driving licence', detail: 'KA RTO — Form 30 with new Aadhaar. Can do at CV Raman Nagar or Koramangala RTO.' },
      ]},
      { category: 'Local Orientation', items: [
        { label: 'Hospitals', detail: 'Manipal Hospital (Whitefield/Old Airport Rd), Fortis (Bannerghatta Rd)' },
        { label: 'Grocery', detail: 'More Supermarket, Spencer\'s, BigBazaar. Zepto/Swiggy Instamart very active.' },
        { label: 'Metro', detail: 'Purple and Green line operational. Check proximity to new home.' },
      ]},
    ],
  },
  {
    city: 'Hyderabad', state: 'Telangana', status: 'active', lastUpdated: '2026-07-10',
    propertyPartners: [
      { name: 'Hyd Realty', phone: '9966778899', area: 'Banjara Hills, Jubilee Hills, Gachibowli' },
    ],
    moversPartners: [
      { name: 'QuickShift Movers', phone: '9800444555', rating: 3.8 },
    ],
    entries: [
      { category: 'Property Notes', items: [
        { label: 'Lease registration', detail: 'Mandatory for leases > 11 months. Both parties must visit SRO. Costs ~1% of annual rent.', critical: true },
      ]},
      { category: 'Utilities', items: [
        { label: 'Electricity — TSSPDCL / TSNPDCL', detail: 'Which board depends on area. Jubilee Hills/Banjara = TSSPDCL. 3–5 day transfer.', critical: true },
        { label: 'Internet — Spectra / Airtel', detail: 'Spectra fiber popular in Gachibowli tech corridor. 1–2 days install.' },
      ]},
      { category: 'Local Orientation', items: [
        { label: 'Hospitals', detail: 'Apollo (Jubilee Hills), KIMS (Secunderabad), Yashoda (Somajiguda)' },
        { label: 'Metro', detail: 'Hyderabad Metro well-connected — Red/Blue/Green line operational' },
      ]},
    ],
  },
  {
    city: 'Chennai', state: 'Tamil Nadu', status: 'active', lastUpdated: '2026-07-05',
    propertyPartners: [
      { name: 'Chennai Homes', phone: '9933445566', area: 'Anna Nagar, T Nagar, Velachery' },
    ],
    moversPartners: [
      { name: 'Reliable Packers', phone: '9800555666', rating: 4.3 },
    ],
    entries: [
      { category: 'Property Notes', items: [
        { label: 'Electricity deposit', detail: 'TNEB requires initial deposit based on flat size. Keep cash ready on move-in day.', critical: true },
        { label: 'Maintenance advance', detail: 'Chennai co-op societies often require 3–6 month advance maintenance.' },
      ]},
      { category: 'Utilities', items: [
        { label: 'Electricity — TNEB', detail: 'Subdivision office with lease copy + Aadhaar. New connection takes 5–7 days.', critical: true },
        { label: 'Internet — JioFiber / BSNL', detail: 'JioFiber fastest growing. BSNL broadband still popular in older areas.' },
      ]},
      { category: 'Local Orientation', items: [
        { label: 'Hospitals', detail: 'Apollo (Greams Rd), Fortis Malar (Adyar), MIOT (Manapakkam)' },
        { label: 'Local transport', detail: 'CMRL Metro + suburban rail. Share autos for last-mile.' },
      ]},
    ],
  },
  {
    city: 'Pune', state: 'Maharashtra', status: 'active', lastUpdated: '2026-07-12',
    propertyPartners: [
      { name: 'Mohan Realty', phone: '9922334455', area: 'Aundh, Baner, Kothrud' },
    ],
    moversPartners: [
      { name: 'City Movers Pune', phone: '9800666777', rating: 4.1 },
    ],
    entries: [
      { category: 'Property Notes', items: [
        { label: 'Society share certificate', detail: 'Required for leases > 12 months in most co-op societies.', critical: true },
      ]},
      { category: 'Utilities', items: [
        { label: 'Electricity — MSEDCL (same as Mumbai)', detail: 'Pune subdivision offices in Aundh, Kothrud, Hadapsar.', critical: true },
        { label: 'Internet — Hathway / Airtel', detail: 'Hathway dominant in Pune. Good speeds in Aundh/Baner area.' },
      ]},
      { category: 'Local Orientation', items: [
        { label: 'Hospitals', detail: 'Ruby Hall (Pune Station), KEM (Rasta Peth), Sahyadri (Deccan)' },
      ]},
    ],
  },
  {
    city: 'Delhi', state: 'Delhi NCR', status: 'draft', lastUpdated: '2026-06-20',
    propertyPartners: [],
    moversPartners: [
      { name: 'National Packers', phone: '9800333444', rating: 4.0 },
    ],
    entries: [
      { category: 'Property Notes', items: [
        { label: 'Rent agreement registration', detail: 'e-stamping required. Done online via Delhi govt portal.', critical: true },
        { label: 'Police verification', detail: 'Mandatory in Delhi. Landlord + tenant both sign form at local thana.' },
      ]},
      { category: 'Utilities', items: [
        { label: 'Electricity — BSES / Tata Power', detail: 'South/West Delhi = BSES Rajdhani. East/North = BSES Yamuna. Dwarka/Outer = Tata Power.', critical: true },
      ]},
    ],
  },
];

export function CityPlaybooks() {
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({ 'Property Notes': true });

  const playbook = PLAYBOOKS.find(p => p.city === selectedCity);

  function toggleCategory(cat: string) {
    setExpandedCategories(e => ({ ...e, [cat]: !e[cat] }));
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopNav title="City Playbooks" subtitle="Per-city vendor, utility, and process knowledge base" />
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-5">

        {/* City selector */}
        <div className="flex gap-2 flex-wrap">
          {PLAYBOOKS.map(p => (
            <button key={p.city}
              onClick={() => setSelectedCity(p.city)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                selectedCity === p.city ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'
              }`}>
              <MapPin size={13} />
              {p.city}
              {p.status === 'draft' && (
                <Badge label="Draft" color="text-amber-700" bg="bg-amber-100" />
              )}
            </button>
          ))}
          <button onClick={() => toast.info('Add city playbook coming soon')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-slate-300 text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-600">
            <Plus size={13} /> Add City
          </button>
        </div>

        {playbook && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Main playbook */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <div className="flex items-center gap-3 flex-wrap">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{playbook.city}</h2>
                    <p className="text-sm text-slate-500">{playbook.state} • Updated {playbook.lastUpdated}</p>
                  </div>
                  <Badge
                    label={playbook.status === 'active' ? 'Active Playbook' : 'Draft'}
                    color={playbook.status === 'active' ? 'text-green-700' : 'text-amber-700'}
                    bg={playbook.status === 'active' ? 'bg-green-100' : 'bg-amber-100'}
                  />
                </div>
              </Card>

              {playbook.entries.map(section => (
                <Card key={section.category} padding="none">
                  <button
                    onClick={() => toggleCategory(section.category)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
                    <span className="font-semibold text-slate-900">{section.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{section.items.length} items</span>
                      {expandedCategories[section.category] ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                    </div>
                  </button>

                  {expandedCategories[section.category] && (
                    <div className="border-t border-slate-100 divide-y divide-slate-50">
                      {section.items.map((item, i) => (
                        <div key={i} className="px-5 py-4">
                          <div className="flex items-start gap-2">
                            {item.critical && <span className="text-red-500 text-xs font-bold mt-0.5 shrink-0">!</span>}
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                              <p className="text-sm text-slate-500 mt-0.5">{item.detail}</p>
                            </div>
                            {item.critical && <Badge label="Critical" color="text-red-700" bg="bg-red-100" className="ml-auto shrink-0" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Right panel — partners */}
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-sm">Property Partners</CardTitle></CardHeader>
                {playbook.propertyPartners.length === 0 ? (
                  <p className="text-xs text-slate-400">No partners added yet</p>
                ) : (
                  <div className="space-y-3">
                    {playbook.propertyPartners.map((p, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.phone}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Areas: {p.area}</p>
                      </div>
                    ))}
                  </div>
                )}
                <Button size="sm" variant="ghost" className="mt-2 w-full" icon={<Plus size={12} />} onClick={() => toast.info('Add partner coming soon')}>
                  Add Partner
                </Button>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-sm">Movers & Packers</CardTitle></CardHeader>
                {playbook.moversPartners.length === 0 ? (
                  <p className="text-xs text-slate-400">No movers added yet</p>
                ) : (
                  <div className="space-y-2">
                    {playbook.moversPartners.map((m, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{m.name}</p>
                          <p className="text-xs text-slate-500">{m.phone}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-amber-500 text-sm">★</span>
                          <span className="text-sm font-bold text-slate-700 ml-0.5">{m.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-sm flex items-center gap-1"><BookOpen size={13} />Quick Tips</CardTitle></CardHeader>
                <div className="space-y-2 text-xs text-slate-600">
                  <p>• Schedule utility applications <strong>before move-in</strong> — they take 3–10 days</p>
                  <p>• Get police verification started on <strong>day 1</strong> in cities that require it</p>
                  <p>• Always get a <strong>written receipt</strong> for deposits paid to property owners</p>
                  <p>• Confirm move-day timing with vendor <strong>48 hours before</strong></p>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
