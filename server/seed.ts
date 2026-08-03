import { db } from './db.js';

export function seedDatabase() {
  // Only seed if empty
  const count = (db.prepare('SELECT COUNT(*) as c FROM customers').get() as { c: number }).c;
  if (count > 0) {
    console.log('⚡ Database already seeded, skipping...');
    return;
  }

  console.log('🌱 Seeding database...');

  // Team Members
  const insertTeam = db.prepare(`INSERT INTO team_members (id, name, role, email, active_relocation_count) VALUES (?, ?, ?, ?, ?)`);
  const teams = [
    ['tm1', 'Priya Sharma',  'Operations Manager',      'priya@quickmove.in',  2],
    ['tm2', 'Rahul Verma',   'Relocation Coordinator',  'rahul@quickmove.in',  5],
    ['tm3', 'Sneha Patel',   'Relocation Coordinator',  'sneha@quickmove.in',  4],
    ['tm4', 'Arjun Nair',    'Field Liaison',           'arjun@quickmove.in',  3],
    ['tm5', 'Divya Mehta',   'Admin & Finance',         'divya@quickmove.in',  1],
  ];
  teams.forEach(t => insertTeam.run(...t));

  // Corporate Clients
  const insertCorp = db.prepare(`INSERT INTO corporate_clients (id, name, contact_name, contact_email, contact_phone, active_relocations, total_relocations) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  insertCorp.run('cc1', 'Infosys Ltd',                   'HR - Kavitha R', 'hr@infosys.com', '9900112233', 3, 18);
  insertCorp.run('cc2', 'Tata Consultancy Services',     'HR - Manoj K',   'hr@tcs.com',    '9911223344', 2, 12);

  // Customers
  const insertCustomer = db.prepare(`INSERT INTO customers (id, name, phone, email, type, corporate_client_id, corporate_client_name, assigned_coordinator_id, assigned_coordinator_name, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const customers = [
    ['c1', 'Amit Joshi',    '9876543210', 'amit.joshi@gmail.com',    'individual', null, null,       'tm2', 'Rahul Verma', 'Prefers weekend calls', '2026-07-01'],
    ['c2', 'Neha Kapoor',   '9765432109', 'neha.kapoor@gmail.com',   'individual', null, null,       'tm3', 'Sneha Patel', null,                    '2026-07-05'],
    ['c3', 'Rohan Desai',   '9654321098', 'rohan.desai@infosys.com', 'corporate',  'cc1', 'Infosys Ltd', 'tm2', 'Rahul Verma', null,               '2026-07-08'],
    ['c4', 'Sunita Rao',    '9543210987', 'sunita.rao@tcs.com',      'corporate',  'cc2', 'Tata Consultancy Services', 'tm3', 'Sneha Patel', null,  '2026-07-10'],
    ['c5', 'Vikram Singh',  '9432109876', 'vikram.singh@gmail.com',  'individual', null, null,       'tm2', 'Rahul Verma', null,                    '2026-07-12'],
    ['c6', 'Preethi Nair',  '9321098765', 'preethi.nair@gmail.com',  'individual', null, null,       'tm3', 'Sneha Patel', null,                    '2026-07-15'],
    ['c7', 'Karthik Reddy', '9210987654', 'karthik.r@infosys.com',   'corporate',  'cc1', 'Infosys Ltd', 'tm2', 'Rahul Verma', null,               '2026-07-18'],
    ['c8', 'Meera Iyer',    '9109876543', 'meera.iyer@gmail.com',    'individual', null, null,       'tm3', 'Sneha Patel', null,                    '2026-07-20'],
  ];
  customers.forEach(c => insertCustomer.run(...c));

  // Relocations
  const insertRelo = db.prepare(`INSERT INTO relocations (id, customer_id, customer_name, customer_phone, customer_email, from_city, from_address, to_city, to_address, move_date, status, priority, estimated_budget, actual_cost, assigned_coordinator_id, assigned_coordinator_name, notes, completion_percentage, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const relocations = [
    ['r1','c1','Amit Joshi',   '9876543210','amit.joshi@gmail.com',   'Mumbai',    '12 Hill Road, Bandra',   'Bangalore', '45 Indiranagar',          '2026-08-10','move_planning',     'high',   85000, null,  'tm2','Rahul Verma', null, 55, '2026-07-01'],
    ['r2','c2','Neha Kapoor',  '9765432109','neha.kapoor@gmail.com',  'Delhi',     '7 Lajpat Nagar',         'Pune',      '',                        '2026-08-05','property_search',   'urgent', 65000, null,  'tm3','Sneha Patel', null, 25, '2026-07-05'],
    ['r3','c3','Rohan Desai',  '9654321098','rohan.desai@infosys.com','Hyderabad', '33 Banjara Hills',       'Chennai',   '12 Anna Nagar',            '2026-08-15','utility_setup',     'medium', 72000, 68000,'tm2','Rahul Verma', null, 75, '2026-07-08'],
    ['r4','c4','Sunita Rao',   '9543210987','sunita.rao@tcs.com',     'Kolkata',   '5 Park Street',          'Mumbai',    '88 Andheri West',          '2026-07-28','packing_moving',    'urgent', 95000, 91000,'tm3','Sneha Patel', null, 65, '2026-07-10'],
    ['r5','c5','Vikram Singh', '9432109876','vikram.singh@gmail.com', 'Bangalore', '20 Koramangala',         'Delhi',     '',                        '2026-09-01','onboarding',        'low',    55000, null,  'tm2','Rahul Verma', null, 10, '2026-07-12'],
    ['r6','c6','Preethi Nair', '9321098765','preethi.nair@gmail.com', 'Chennai',   '4 T Nagar',              'Hyderabad', '15 Jubilee Hills',         '2026-08-20','address_change',    'medium', 60000, 58500,'tm3','Sneha Patel', null, 85, '2026-07-15'],
    ['r7','c7','Karthik Reddy','9210987654','karthik.r@infosys.com',  'Pune',      '9 Kalyani Nagar',        'Bangalore', '7 Whitefield',             '2026-08-25','property_finalized','high',   78000, null,  'tm2','Rahul Verma', null, 40, '2026-07-18'],
    ['r8','c8','Meera Iyer',   '9109876543','meera.iyer@gmail.com',   'Mumbai',    '22 Powai',               'Kolkata',   '3 Salt Lake',              '2026-09-10','inquiry',           'low',    70000, null,  'tm3','Sneha Patel', null,  5, '2026-07-20'],
  ];
  relocations.forEach(r => insertRelo.run(...r));

  // Relocation Stages
  const insertStage = db.prepare(`INSERT INTO relocation_stages (relocation_id, stage, label, status, started_at, completed_at) VALUES (?, ?, ?, ?, ?, ?)`);
  const stageTemplate = [
    ['inquiry','Inquiry'],['onboarding','Onboarding'],['property_search','Property Search'],
    ['property_finalized','Property Finalized'],['move_planning','Move Planning'],['packing_moving','Packing & Moving'],
    ['utility_setup','Utility Setup'],['address_change','Address Change'],['post_move_support','Post-Move Support'],['completed','Completed'],
  ];

  const stageProgress: Record<string, number> = {
    inquiry: 0, onboarding: 1, property_search: 2, property_finalized: 3,
    move_planning: 4, packing_moving: 5, utility_setup: 6, address_change: 7,
    post_move_support: 8, completed: 9,
  };

  const reloStatuses: Record<string, string> = {
    r1:'move_planning',r2:'property_search',r3:'utility_setup',r4:'packing_moving',
    r5:'onboarding',r6:'address_change',r7:'property_finalized',r8:'inquiry',
  };

  Object.entries(reloStatuses).forEach(([reloId, currentStatus]) => {
    const currentIdx = stageProgress[currentStatus];
    stageTemplate.forEach(([stage, label], idx) => {
      let status = 'pending';
      let startedAt = null;
      let completedAt = null;
      if (idx < currentIdx) { status = 'completed'; startedAt = '2026-07-01'; completedAt = '2026-07-15'; }
      else if (idx === currentIdx) { status = 'active'; startedAt = '2026-07-20'; }
      insertStage.run(reloId, stage, label, status, startedAt, completedAt);
    });
  });

  // Vendors
  const insertVendor = db.prepare(`INSERT INTO vendors (id, name, type, phone, email, city, rating, total_jobs, available, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const vendors = [
    ['v1','Swift Packers & Movers','both',  '9800111222','swift@movers.com',    'Mumbai',    4.5, 230, 1, null],
    ['v2','SafeMove Logistics',     'movers','9800222333','safemove@logistics.com','Bangalore',4.2, 175, 1, null],
    ['v3','National Packers',       'both',  '9800333444','national@packers.com', 'Delhi',    4.0, 310, 0, 'Booked for August 10'],
    ['v4','QuickShift Movers',      'movers','9800444555', null,                  'Hyderabad',3.8,  95, 1, null],
    ['v5','Reliable Packers',       'packers','9800555666',null,                  'Chennai',  4.3, 140, 1, null],
    ['v6','City Movers Pune',       'both',  '9800666777', null,                  'Pune',     4.1,  88, 1, null],
  ];
  vendors.forEach(v => insertVendor.run(...v));

  // Vendor Bookings
  const insertBooking = db.prepare(`INSERT INTO vendor_bookings (id, relocation_id, customer_name, vendor_id, vendor_name, booking_date, status, quote, final_amount, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  insertBooking.run('vb1','r1','Amit Joshi',   'v1','Swift Packers & Movers','2026-08-10','confirmed', 22000, null,  null,'2026-07-22');
  insertBooking.run('vb2','r3','Rohan Desai',  'v5','Reliable Packers',      '2026-07-29','completed', 18000, 17500, null,'2026-07-24');
  insertBooking.run('vb3','r4','Sunita Rao',   'v1','Swift Packers & Movers','2026-07-28','confirmed', 28000, null,  null,'2026-07-26');
  insertBooking.run('vb4','r7','Karthik Reddy','v2','SafeMove Logistics',    '2026-08-25','pending',   24000, null,  null,'2026-07-30');

  // Utilities
  const insertUtil = db.prepare(`INSERT INTO utilities (id, relocation_id, customer_name, type, provider, status, application_date, activation_date, account_number, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const utils = [
    ['u1','r3','Rohan Desai',  'electricity','TNEB',           'active',  '2026-08-02','2026-08-05','TNEB2026001',null],
    ['u2','r3','Rohan Desai',  'gas',         'IGL',            'applied', '2026-08-03',null,null,null],
    ['u3','r3','Rohan Desai',  'internet',    'Airtel',         'pending', null,null,null,null],
    ['u4','r3','Rohan Desai',  'water',       'CMWSSB',         'pending', null,null,null,null],
    ['u5','r6','Preethi Nair', 'electricity', 'TSSPDCL',        'active',  '2026-08-07','2026-08-09','TSS2026042',null],
    ['u6','r6','Preethi Nair', 'gas',         'Bharat Gas',     'active',  '2026-08-07','2026-08-10',null,null],
    ['u7','r6','Preethi Nair', 'internet',    'JioFiber',       'applied', '2026-08-08',null,null,null],
    ['u8','r4','Sunita Rao',   'electricity', 'MSEDCL',         'pending', null,null,null,null],
    ['u9','r4','Sunita Rao',   'internet',    'Tata Play Fiber','pending', null,null,null,null],
  ];
  utils.forEach(u => insertUtil.run(...u));

  // Address Change Items
  const insertAddr = db.prepare(`INSERT INTO address_change_items (id, relocation_id, institution, category, status, submitted_date, completed_date) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  const addrItems = [
    ['ac1','r6','Aadhaar Card (UIDAI)',  'Government ID', 'completed','2026-08-12','2026-08-14'],
    ['ac2','r6','PAN Card (ITD)',        'Government ID', 'submitted', '2026-08-12',null],
    ['ac3','r6','HDFC Bank',            'Banking',       'submitted', '2026-08-13',null],
    ['ac4','r6','SBI Bank',             'Banking',       'pending',   null,null],
    ['ac5','r6','Driving Licence (RTO)','Government ID', 'pending',   null,null],
    ['ac6','r6','Voter ID (ECI)',       'Government ID', 'pending',   null,null],
    ['ac7','r6','LIC Policy',           'Insurance',     'pending',   null,null],
    ['ac8','r6','Health Insurance',     'Insurance',     'pending',   null,null],
    ['ac9','r6','Employer (HR)',        'Employment',    'completed', '2026-08-11','2026-08-11'],
    ['ac10','r6','Amazon / Flipkart',   'Online Services','pending',  null,null],
    ['ac11','r3','Aadhaar Card (UIDAI)','Government ID', 'pending',   null,null],
    ['ac12','r3','HDFC Bank',           'Banking',       'pending',   null,null],
  ];
  addrItems.forEach(a => insertAddr.run(...a));

  // Documents
  const insertDoc = db.prepare(`INSERT INTO documents (id, relocation_id, customer_name, type, label, uploaded_at, verified, required) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  const docs = [
    ['d1','r1','Amit Joshi','id_proof',        'Aadhaar Card',              '2026-07-03',1,1],
    ['d2','r1','Amit Joshi','address_proof',   'Utility Bill',              '2026-07-03',1,1],
    ['d3','r1','Amit Joshi','employment_letter','Employment Letter',         null,        0,1],
    ['d4','r1','Amit Joshi','rental_agreement','New Rental Agreement',      null,        0,1],
    ['d5','r2','Neha Kapoor','id_proof',       'Aadhaar Card',              '2026-07-07',1,1],
    ['d6','r2','Neha Kapoor','address_proof',  'Utility Bill',              null,        0,1],
    ['d7','r2','Neha Kapoor','employment_letter','Employment Letter',        null,        0,1],
    ['d8','r3','Rohan Desai','id_proof',       'Aadhaar Card',              '2026-07-10',1,1],
    ['d9','r3','Rohan Desai','address_proof',  'Utility Bill',              '2026-07-10',1,1],
    ['d10','r3','Rohan Desai','employment_letter','Employment Letter (Infosys)','2026-07-11',1,1],
    ['d11','r3','Rohan Desai','rental_agreement','New Rental Agreement',    '2026-07-23',1,1],
  ];
  docs.forEach(d => insertDoc.run(...d));

  // Tasks
  const insertTask = db.prepare(`INSERT INTO tasks (id, relocation_id, customer_name, title, description, assigned_to_id, assigned_to_name, due_date, status, priority, completed_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const tasks = [
    ['t1','r1','Amit Joshi',   'Collect employment letter from customer',           null,'tm2','Rahul Verma','2026-07-25','overdue',    'high',  null,'2026-07-21'],
    ['t2','r1','Amit Joshi',   'Confirm final inventory list with customer',        null,'tm2','Rahul Verma','2026-08-03','in_progress','high',  null,'2026-07-22'],
    ['t3','r1','Amit Joshi',   'Confirm vendor booking with Swift Movers',          null,'tm4','Arjun Nair', '2026-08-05','pending',    'urgent',null,'2026-07-22'],
    ['t4','r2','Neha Kapoor',  'Schedule property visits for shortlisted flats',    null,'tm3','Sneha Patel','2026-07-28','overdue',    'urgent',null,'2026-07-15'],
    ['t5','r2','Neha Kapoor',  'Collect address proof from customer',               null,'tm3','Sneha Patel','2026-07-26','overdue',    'high',  null,'2026-07-15'],
    ['t6','r3','Rohan Desai',  'Follow up on Airtel internet connection',           null,'tm2','Rahul Verma','2026-08-06','pending',    'medium',null,'2026-08-02'],
    ['t7','r3','Rohan Desai',  'Confirm CMWSSB water connection application',       null,'tm2','Rahul Verma','2026-08-04','overdue',    'medium',null,'2026-08-02'],
    ['t8','r4','Sunita Rao',   'Monitor move day progress and check-in',            null,'tm4','Arjun Nair', '2026-07-28','in_progress','urgent',null,'2026-07-27'],
    ['t9','r4','Sunita Rao',   'Set up electricity connection at new address',      null,'tm3','Sneha Patel','2026-07-30','pending',    'high',  null,'2026-07-27'],
    ['t10','r5','Vikram Singh','Send onboarding documents checklist to customer',   null,'tm2','Rahul Verma','2026-07-15','overdue',    'medium',null,'2026-07-13'],
    ['t11','r6','Preethi Nair','Chase bank address change (SBI)',                   null,'tm3','Sneha Patel','2026-08-15','pending',    'medium',null,'2026-08-11'],
    ['t12','r7','Karthik Reddy','Get rental agreement signed by both parties',      null,'tm2','Rahul Verma','2026-08-02','overdue',    'high',  null,'2026-07-30'],
    ['t13','r7','Karthik Reddy','Begin move planning — book vendor and set dates',  null,'tm4','Arjun Nair', '2026-08-05','pending',    'high',  null,'2026-07-30'],
    ['t14','r8','Meera Iyer',  'Complete customer intake and requirements gathering',null,'tm3','Sneha Patel','2026-07-24','overdue',    'medium',null,'2026-07-20'],
  ];
  tasks.forEach(t => insertTask.run(...t));

  // Notifications
  const insertNotif = db.prepare(`INSERT INTO notifications (id, type, title, message, related_id, related_type, read, priority, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const notifs = [
    ['n1','overdue_task',    'Task Overdue',       'Neha Kapoor: Property visits not scheduled — 6 days overdue', 't4','task',0,'urgent','2026-08-03T09:00:00'],
    ['n2','missing_document','Missing Document',   'Amit Joshi: Employment letter still not uploaded — move in 7 days','r1','relocation',0,'high','2026-08-03T08:30:00'],
    ['n3','move_reminder',   'Move in 2 Days',     'Sunita Rao move scheduled for July 28 — vendor confirmed?','r4','relocation',0,'urgent','2026-08-03T08:00:00'],
    ['n4','overdue_task',    'Task Overdue',       'Rohan Desai: CMWSSB water application overdue by 1 day','t7','task',0,'medium','2026-08-03T07:45:00'],
    ['n5','customer_attention','Needs Attention',  'Neha Kapoor: Move date is Aug 5 with no property selected yet','r2','relocation',1,'urgent','2026-08-02T16:00:00'],
    ['n6','utility_pending', 'Utility Setup Pending','Sunita Rao: No utilities set up at new Mumbai address','r4','relocation',1,'high','2026-08-02T14:00:00'],
    ['n7','stage_completed', 'Stage Completed',    'Preethi Nair: Utility setup completed successfully','r6','relocation',1,'low','2026-08-01T11:00:00'],
  ];
  notifs.forEach(n => insertNotif.run(...n));

  // Activity Events
  const insertAct = db.prepare(`INSERT INTO activity_events (id, relocation_id, customer_name, action, description, performed_by, timestamp, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  const events = [
    ['ae1','r1','Amit Joshi',   'Stage Changed',    'Moved to Move Planning stage',          'Rahul Verma','2026-07-21T10:00:00','stage_change'],
    ['ae2','r1','Amit Joshi',   'Task Created',     'Task: Confirm inventory list created',  'Rahul Verma','2026-07-22T11:30:00','task'],
    ['ae3','r1','Amit Joshi',   'Vendor Booked',    'Swift Packers & Movers booked for Aug 10','Arjun Nair','2026-07-22T14:00:00','booking'],
    ['ae4','r3','Rohan Desai',  'Stage Changed',    'Moved to Utility Setup stage',          'Rahul Verma','2026-08-01T09:00:00','stage_change'],
    ['ae5','r3','Rohan Desai',  'Utility Activated','TNEB electricity connection activated', 'Rahul Verma','2026-08-05T16:00:00','utility'],
    ['ae6','r4','Sunita Rao',   'Stage Changed',    'Moved to Packing & Moving stage',       'Sneha Patel','2026-07-28T08:00:00','stage_change'],
    ['ae7','r6','Preethi Nair', 'Stage Changed',    'Moved to Address Change stage',         'Sneha Patel','2026-08-11T10:00:00','stage_change'],
    ['ae8','r2','Neha Kapoor',  'Property Added',   '2 properties shortlisted in Pune',      'Sneha Patel','2026-07-13T13:00:00','document'],
    ['ae9','r7','Karthik Reddy','Property Selected','Whitefield property selected',          'Rahul Verma','2026-07-30T15:00:00','stage_change'],
    ['ae10','r5','Vikram Singh','Customer Onboarded','Customer onboarding started',          'Rahul Verma','2026-07-13T09:30:00','stage_change'],
  ];
  events.forEach(e => insertAct.run(...e));

  // Properties
  const insertProp = db.prepare(`INSERT INTO properties (id, relocation_id, address, city, rent, bedrooms, bathrooms, area, status, broker_name, broker_phone, visit_date, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const props = [
    ['p1','r1','14 MG Road, Indiranagar, Bangalore','Bangalore',32000,2,2,1100,'selected',   'Suresh Broker','9811223344','2026-07-18',null,       '2026-07-10'],
    ['p2','r1','7 Koramangala 4th Block, Bangalore', 'Bangalore',28000,2,1, 950,'rejected',   'Suresh Broker','9811223344','2026-07-14','No parking','2026-07-09'],
    ['p3','r2','22 Aundh, Pune',                     'Pune',     22000,2,2,1000,'shortlisted','Mohan Realty', '9922334455',null,        null,       '2026-07-12'],
    ['p4','r2','11 Baner Road, Pune',                'Pune',     25000,3,2,1300,'shortlisted','Mohan Realty', '9922334455',null,        null,       '2026-07-13'],
    ['p5','r3','12 Anna Nagar West, Chennai',        'Chennai',  30000,3,2,1400,'selected',   'Chennai Homes','9933445566','2026-07-22',null,       '2026-07-15'],
    ['p6','r7','7 Whitefield Main Rd, Bangalore',    'Bangalore',35000,3,2,1500,'selected',   'Prestige Props','9944556677','2026-07-28',null,      '2026-07-22'],
  ];
  props.forEach(p => insertProp.run(...p));

  console.log('✅ Database seeded successfully');
}
