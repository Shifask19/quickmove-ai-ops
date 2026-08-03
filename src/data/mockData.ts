import type {
  TeamMember, Customer, Relocation, Property, Vendor, VendorBooking,
  Utility, AddressChangeItem, Document, Task, Notification, ActivityEvent,
  CorporateClient
} from '../types';

// ─── Team Members ─────────────────────────────────────────────────────────────
export const teamMembers: TeamMember[] = [
  { id: 'tm1', name: 'Priya Sharma', role: 'Operations Manager', email: 'priya@quickmove.in', activeRelocationCount: 2 },
  { id: 'tm2', name: 'Rahul Verma', role: 'Relocation Coordinator', email: 'rahul@quickmove.in', activeRelocationCount: 5 },
  { id: 'tm3', name: 'Sneha Patel', role: 'Relocation Coordinator', email: 'sneha@quickmove.in', activeRelocationCount: 4 },
  { id: 'tm4', name: 'Arjun Nair', role: 'Field Liaison', email: 'arjun@quickmove.in', activeRelocationCount: 3 },
  { id: 'tm5', name: 'Divya Mehta', role: 'Admin & Finance', email: 'divya@quickmove.in', activeRelocationCount: 1 },
];

// ─── Corporate Clients ────────────────────────────────────────────────────────
export const corporateClients: CorporateClient[] = [
  { id: 'cc1', name: 'Infosys Ltd', contactName: 'HR - Kavitha R', contactEmail: 'hr@infosys.com', contactPhone: '9900112233', activeRelocations: 3, totalRelocations: 18 },
  { id: 'cc2', name: 'Tata Consultancy Services', contactName: 'HR - Manoj K', contactEmail: 'hr@tcs.com', contactPhone: '9911223344', activeRelocations: 2, totalRelocations: 12 },
];

// ─── Customers ────────────────────────────────────────────────────────────────
export const customers: Customer[] = [
  { id: 'c1', name: 'Amit Joshi', phone: '9876543210', email: 'amit.joshi@gmail.com', type: 'individual', assignedCoordinatorId: 'tm2', assignedCoordinatorName: 'Rahul Verma', createdAt: '2026-07-01', notes: 'Prefers weekend calls' },
  { id: 'c2', name: 'Neha Kapoor', phone: '9765432109', email: 'neha.kapoor@gmail.com', type: 'individual', assignedCoordinatorId: 'tm3', assignedCoordinatorName: 'Sneha Patel', createdAt: '2026-07-05' },
  { id: 'c3', name: 'Rohan Desai', phone: '9654321098', email: 'rohan.desai@infosys.com', type: 'corporate', corporateClientId: 'cc1', corporateClientName: 'Infosys Ltd', assignedCoordinatorId: 'tm2', assignedCoordinatorName: 'Rahul Verma', createdAt: '2026-07-08' },
  { id: 'c4', name: 'Sunita Rao', phone: '9543210987', email: 'sunita.rao@tcs.com', type: 'corporate', corporateClientId: 'cc2', corporateClientName: 'Tata Consultancy Services', assignedCoordinatorId: 'tm3', assignedCoordinatorName: 'Sneha Patel', createdAt: '2026-07-10' },
  { id: 'c5', name: 'Vikram Singh', phone: '9432109876', email: 'vikram.singh@gmail.com', type: 'individual', assignedCoordinatorId: 'tm2', assignedCoordinatorName: 'Rahul Verma', createdAt: '2026-07-12' },
  { id: 'c6', name: 'Preethi Nair', phone: '9321098765', email: 'preethi.nair@gmail.com', type: 'individual', assignedCoordinatorId: 'tm3', assignedCoordinatorName: 'Sneha Patel', createdAt: '2026-07-15' },
  { id: 'c7', name: 'Karthik Reddy', phone: '9210987654', email: 'karthik.r@infosys.com', type: 'corporate', corporateClientId: 'cc1', corporateClientName: 'Infosys Ltd', assignedCoordinatorId: 'tm2', assignedCoordinatorName: 'Rahul Verma', createdAt: '2026-07-18' },
  { id: 'c8', name: 'Meera Iyer', phone: '9109876543', email: 'meera.iyer@gmail.com', type: 'individual', assignedCoordinatorId: 'tm3', assignedCoordinatorName: 'Sneha Patel', createdAt: '2026-07-20' },
];

// ─── Relocations ──────────────────────────────────────────────────────────────
export const relocations: Relocation[] = [
  {
    id: 'r1', customerId: 'c1', customerName: 'Amit Joshi', customerPhone: '9876543210', customerEmail: 'amit.joshi@gmail.com',
    fromCity: 'Mumbai', fromAddress: '12 Hill Road, Bandra, Mumbai', toCity: 'Bangalore', toAddress: '45 Indiranagar, Bangalore',
    moveDate: '2026-08-10', status: 'move_planning', priority: 'high', estimatedBudget: 85000, actualCost: undefined,
    assignedCoordinatorId: 'tm2', assignedCoordinatorName: 'Rahul Verma', createdAt: '2026-07-01', completionPercentage: 55,
    stages: [
      { stage: 'inquiry', label: 'Inquiry', status: 'completed', startedAt: '2026-07-01', completedAt: '2026-07-01' },
      { stage: 'onboarding', label: 'Onboarding', status: 'completed', startedAt: '2026-07-02', completedAt: '2026-07-03' },
      { stage: 'property_search', label: 'Property Search', status: 'completed', startedAt: '2026-07-04', completedAt: '2026-07-15' },
      { stage: 'property_finalized', label: 'Property Finalized', status: 'completed', startedAt: '2026-07-16', completedAt: '2026-07-20' },
      { stage: 'move_planning', label: 'Move Planning', status: 'active', startedAt: '2026-07-21' },
      { stage: 'packing_moving', label: 'Packing & Moving', status: 'pending' },
      { stage: 'utility_setup', label: 'Utility Setup', status: 'pending' },
      { stage: 'address_change', label: 'Address Change', status: 'pending' },
      { stage: 'post_move_support', label: 'Post-Move Support', status: 'pending' },
      { stage: 'completed', label: 'Completed', status: 'pending' },
    ],
  },
  {
    id: 'r2', customerId: 'c2', customerName: 'Neha Kapoor', customerPhone: '9765432109', customerEmail: 'neha.kapoor@gmail.com',
    fromCity: 'Delhi', fromAddress: '7 Lajpat Nagar, Delhi', toCity: 'Pune', toAddress: '',
    moveDate: '2026-08-05', status: 'property_search', priority: 'urgent', estimatedBudget: 65000,
    assignedCoordinatorId: 'tm3', assignedCoordinatorName: 'Sneha Patel', createdAt: '2026-07-05', completionPercentage: 25,
    stages: [
      { stage: 'inquiry', label: 'Inquiry', status: 'completed', startedAt: '2026-07-05', completedAt: '2026-07-05' },
      { stage: 'onboarding', label: 'Onboarding', status: 'completed', startedAt: '2026-07-06', completedAt: '2026-07-07' },
      { stage: 'property_search', label: 'Property Search', status: 'active', startedAt: '2026-07-08' },
      { stage: 'property_finalized', label: 'Property Finalized', status: 'pending' },
      { stage: 'move_planning', label: 'Move Planning', status: 'pending' },
      { stage: 'packing_moving', label: 'Packing & Moving', status: 'pending' },
      { stage: 'utility_setup', label: 'Utility Setup', status: 'pending' },
      { stage: 'address_change', label: 'Address Change', status: 'pending' },
      { stage: 'post_move_support', label: 'Post-Move Support', status: 'pending' },
      { stage: 'completed', label: 'Completed', status: 'pending' },
    ],
  },
  {
    id: 'r3', customerId: 'c3', customerName: 'Rohan Desai', customerPhone: '9654321098', customerEmail: 'rohan.desai@infosys.com',
    fromCity: 'Hyderabad', fromAddress: '33 Banjara Hills, Hyderabad', toCity: 'Chennai', toAddress: '12 Anna Nagar, Chennai',
    moveDate: '2026-08-15', status: 'utility_setup', priority: 'medium', estimatedBudget: 72000, actualCost: 68000,
    assignedCoordinatorId: 'tm2', assignedCoordinatorName: 'Rahul Verma', createdAt: '2026-07-08', completionPercentage: 75,
    stages: [
      { stage: 'inquiry', label: 'Inquiry', status: 'completed', startedAt: '2026-07-08', completedAt: '2026-07-08' },
      { stage: 'onboarding', label: 'Onboarding', status: 'completed', startedAt: '2026-07-09', completedAt: '2026-07-10' },
      { stage: 'property_search', label: 'Property Search', status: 'completed', startedAt: '2026-07-11', completedAt: '2026-07-18' },
      { stage: 'property_finalized', label: 'Property Finalized', status: 'completed', startedAt: '2026-07-19', completedAt: '2026-07-22' },
      { stage: 'move_planning', label: 'Move Planning', status: 'completed', startedAt: '2026-07-23', completedAt: '2026-07-28' },
      { stage: 'packing_moving', label: 'Packing & Moving', status: 'completed', startedAt: '2026-07-29', completedAt: '2026-08-01' },
      { stage: 'utility_setup', label: 'Utility Setup', status: 'active', startedAt: '2026-08-01' },
      { stage: 'address_change', label: 'Address Change', status: 'pending' },
      { stage: 'post_move_support', label: 'Post-Move Support', status: 'pending' },
      { stage: 'completed', label: 'Completed', status: 'pending' },
    ],
  },
  {
    id: 'r4', customerId: 'c4', customerName: 'Sunita Rao', customerPhone: '9543210987', customerEmail: 'sunita.rao@tcs.com',
    fromCity: 'Kolkata', fromAddress: '5 Park Street, Kolkata', toCity: 'Mumbai', toAddress: '88 Andheri West, Mumbai',
    moveDate: '2026-07-28', status: 'packing_moving', priority: 'urgent', estimatedBudget: 95000, actualCost: 91000,
    assignedCoordinatorId: 'tm3', assignedCoordinatorName: 'Sneha Patel', createdAt: '2026-07-10', completionPercentage: 65,
    stages: [
      { stage: 'inquiry', label: 'Inquiry', status: 'completed', startedAt: '2026-07-10', completedAt: '2026-07-10' },
      { stage: 'onboarding', label: 'Onboarding', status: 'completed', startedAt: '2026-07-11', completedAt: '2026-07-12' },
      { stage: 'property_search', label: 'Property Search', status: 'completed', startedAt: '2026-07-13', completedAt: '2026-07-20' },
      { stage: 'property_finalized', label: 'Property Finalized', status: 'completed', startedAt: '2026-07-21', completedAt: '2026-07-24' },
      { stage: 'move_planning', label: 'Move Planning', status: 'completed', startedAt: '2026-07-25', completedAt: '2026-07-27' },
      { stage: 'packing_moving', label: 'Packing & Moving', status: 'active', startedAt: '2026-07-28' },
      { stage: 'utility_setup', label: 'Utility Setup', status: 'pending' },
      { stage: 'address_change', label: 'Address Change', status: 'pending' },
      { stage: 'post_move_support', label: 'Post-Move Support', status: 'pending' },
      { stage: 'completed', label: 'Completed', status: 'pending' },
    ],
  },
  {
    id: 'r5', customerId: 'c5', customerName: 'Vikram Singh', customerPhone: '9432109876', customerEmail: 'vikram.singh@gmail.com',
    fromCity: 'Bangalore', fromAddress: '20 Koramangala, Bangalore', toCity: 'Delhi', toAddress: '',
    moveDate: '2026-09-01', status: 'onboarding', priority: 'low', estimatedBudget: 55000,
    assignedCoordinatorId: 'tm2', assignedCoordinatorName: 'Rahul Verma', createdAt: '2026-07-12', completionPercentage: 10,
    stages: [
      { stage: 'inquiry', label: 'Inquiry', status: 'completed', startedAt: '2026-07-12', completedAt: '2026-07-12' },
      { stage: 'onboarding', label: 'Onboarding', status: 'active', startedAt: '2026-07-13' },
      { stage: 'property_search', label: 'Property Search', status: 'pending' },
      { stage: 'property_finalized', label: 'Property Finalized', status: 'pending' },
      { stage: 'move_planning', label: 'Move Planning', status: 'pending' },
      { stage: 'packing_moving', label: 'Packing & Moving', status: 'pending' },
      { stage: 'utility_setup', label: 'Utility Setup', status: 'pending' },
      { stage: 'address_change', label: 'Address Change', status: 'pending' },
      { stage: 'post_move_support', label: 'Post-Move Support', status: 'pending' },
      { stage: 'completed', label: 'Completed', status: 'pending' },
    ],
  },
  {
    id: 'r6', customerId: 'c6', customerName: 'Preethi Nair', customerPhone: '9321098765', customerEmail: 'preethi.nair@gmail.com',
    fromCity: 'Chennai', fromAddress: '4 T Nagar, Chennai', toCity: 'Hyderabad', toAddress: '15 Jubilee Hills, Hyderabad',
    moveDate: '2026-08-20', status: 'address_change', priority: 'medium', estimatedBudget: 60000, actualCost: 58500,
    assignedCoordinatorId: 'tm3', assignedCoordinatorName: 'Sneha Patel', createdAt: '2026-07-15', completionPercentage: 85,
    stages: [
      { stage: 'inquiry', label: 'Inquiry', status: 'completed', startedAt: '2026-07-15', completedAt: '2026-07-15' },
      { stage: 'onboarding', label: 'Onboarding', status: 'completed', startedAt: '2026-07-16', completedAt: '2026-07-17' },
      { stage: 'property_search', label: 'Property Search', status: 'completed', startedAt: '2026-07-18', completedAt: '2026-07-25' },
      { stage: 'property_finalized', label: 'Property Finalized', status: 'completed', startedAt: '2026-07-26', completedAt: '2026-07-29' },
      { stage: 'move_planning', label: 'Move Planning', status: 'completed', startedAt: '2026-07-30', completedAt: '2026-08-02' },
      { stage: 'packing_moving', label: 'Packing & Moving', status: 'completed', startedAt: '2026-08-03', completedAt: '2026-08-05' },
      { stage: 'utility_setup', label: 'Utility Setup', status: 'completed', startedAt: '2026-08-06', completedAt: '2026-08-10' },
      { stage: 'address_change', label: 'Address Change', status: 'active', startedAt: '2026-08-11' },
      { stage: 'post_move_support', label: 'Post-Move Support', status: 'pending' },
      { stage: 'completed', label: 'Completed', status: 'pending' },
    ],
  },
  {
    id: 'r7', customerId: 'c7', customerName: 'Karthik Reddy', customerPhone: '9210987654', customerEmail: 'karthik.r@infosys.com',
    fromCity: 'Pune', fromAddress: '9 Kalyani Nagar, Pune', toCity: 'Bangalore', toAddress: '7 Whitefield, Bangalore',
    moveDate: '2026-08-25', status: 'property_finalized', priority: 'high', estimatedBudget: 78000,
    assignedCoordinatorId: 'tm2', assignedCoordinatorName: 'Rahul Verma', createdAt: '2026-07-18', completionPercentage: 40,
    stages: [
      { stage: 'inquiry', label: 'Inquiry', status: 'completed', startedAt: '2026-07-18', completedAt: '2026-07-18' },
      { stage: 'onboarding', label: 'Onboarding', status: 'completed', startedAt: '2026-07-19', completedAt: '2026-07-20' },
      { stage: 'property_search', label: 'Property Search', status: 'completed', startedAt: '2026-07-21', completedAt: '2026-07-29' },
      { stage: 'property_finalized', label: 'Property Finalized', status: 'active', startedAt: '2026-07-30' },
      { stage: 'move_planning', label: 'Move Planning', status: 'pending' },
      { stage: 'packing_moving', label: 'Packing & Moving', status: 'pending' },
      { stage: 'utility_setup', label: 'Utility Setup', status: 'pending' },
      { stage: 'address_change', label: 'Address Change', status: 'pending' },
      { stage: 'post_move_support', label: 'Post-Move Support', status: 'pending' },
      { stage: 'completed', label: 'Completed', status: 'pending' },
    ],
  },
  {
    id: 'r8', customerId: 'c8', customerName: 'Meera Iyer', customerPhone: '9109876543', customerEmail: 'meera.iyer@gmail.com',
    fromCity: 'Mumbai', fromAddress: '22 Powai, Mumbai', toCity: 'Kolkata', toAddress: '3 Salt Lake, Kolkata',
    moveDate: '2026-09-10', status: 'inquiry', priority: 'low', estimatedBudget: 70000,
    assignedCoordinatorId: 'tm3', assignedCoordinatorName: 'Sneha Patel', createdAt: '2026-07-20', completionPercentage: 5,
    stages: [
      { stage: 'inquiry', label: 'Inquiry', status: 'active', startedAt: '2026-07-20' },
      { stage: 'onboarding', label: 'Onboarding', status: 'pending' },
      { stage: 'property_search', label: 'Property Search', status: 'pending' },
      { stage: 'property_finalized', label: 'Property Finalized', status: 'pending' },
      { stage: 'move_planning', label: 'Move Planning', status: 'pending' },
      { stage: 'packing_moving', label: 'Packing & Moving', status: 'pending' },
      { stage: 'utility_setup', label: 'Utility Setup', status: 'pending' },
      { stage: 'address_change', label: 'Address Change', status: 'pending' },
      { stage: 'post_move_support', label: 'Post-Move Support', status: 'pending' },
      { stage: 'completed', label: 'Completed', status: 'pending' },
    ],
  },
];

// ─── Properties ───────────────────────────────────────────────────────────────
export const properties: Property[] = [
  { id: 'p1', relocationId: 'r1', address: '14 MG Road, Indiranagar, Bangalore', city: 'Bangalore', rent: 32000, bedrooms: 2, bathrooms: 2, area: 1100, status: 'selected', brokerName: 'Suresh Broker', brokerPhone: '9811223344', visitDate: '2026-07-18', createdAt: '2026-07-10' },
  { id: 'p2', relocationId: 'r1', address: '7 Koramangala 4th Block, Bangalore', city: 'Bangalore', rent: 28000, bedrooms: 2, bathrooms: 1, area: 950, status: 'rejected', brokerName: 'Suresh Broker', brokerPhone: '9811223344', visitDate: '2026-07-14', createdAt: '2026-07-09', notes: 'No parking' },
  { id: 'p3', relocationId: 'r2', address: '22 Aundh, Pune', city: 'Pune', rent: 22000, bedrooms: 2, bathrooms: 2, area: 1000, status: 'shortlisted', brokerName: 'Mohan Realty', brokerPhone: '9922334455', createdAt: '2026-07-12' },
  { id: 'p4', relocationId: 'r2', address: '11 Baner Road, Pune', city: 'Pune', rent: 25000, bedrooms: 3, bathrooms: 2, area: 1300, status: 'shortlisted', brokerName: 'Mohan Realty', brokerPhone: '9922334455', createdAt: '2026-07-13' },
  { id: 'p5', relocationId: 'r3', address: '12 Anna Nagar West, Chennai', city: 'Chennai', rent: 30000, bedrooms: 3, bathrooms: 2, area: 1400, status: 'selected', brokerName: 'Chennai Homes', brokerPhone: '9933445566', visitDate: '2026-07-22', createdAt: '2026-07-15' },
  { id: 'p6', relocationId: 'r7', address: '7 Whitefield Main Rd, Bangalore', city: 'Bangalore', rent: 35000, bedrooms: 3, bathrooms: 2, area: 1500, status: 'selected', brokerName: 'Prestige Props', brokerPhone: '9944556677', visitDate: '2026-07-28', createdAt: '2026-07-22' },
];

// ─── Vendors ──────────────────────────────────────────────────────────────────
export const vendors: Vendor[] = [
  { id: 'v1', name: 'Swift Packers & Movers', type: 'both', phone: '9800111222', email: 'swift@movers.com', city: 'Mumbai', rating: 4.5, totalJobs: 230, available: true },
  { id: 'v2', name: 'SafeMove Logistics', type: 'movers', phone: '9800222333', email: 'safemove@logistics.com', city: 'Bangalore', rating: 4.2, totalJobs: 175, available: true },
  { id: 'v3', name: 'National Packers', type: 'both', phone: '9800333444', email: 'national@packers.com', city: 'Delhi', rating: 4.0, totalJobs: 310, available: false, notes: 'Booked for August 10' },
  { id: 'v4', name: 'QuickShift Movers', type: 'movers', phone: '9800444555', city: 'Hyderabad', rating: 3.8, totalJobs: 95, available: true },
  { id: 'v5', name: 'Reliable Packers', type: 'packers', phone: '9800555666', city: 'Chennai', rating: 4.3, totalJobs: 140, available: true },
  { id: 'v6', name: 'City Movers Pune', type: 'both', phone: '9800666777', city: 'Pune', rating: 4.1, totalJobs: 88, available: true },
];

// ─── Vendor Bookings ──────────────────────────────────────────────────────────
export const vendorBookings: VendorBooking[] = [
  { id: 'vb1', relocationId: 'r1', customerName: 'Amit Joshi', vendorId: 'v1', vendorName: 'Swift Packers & Movers', bookingDate: '2026-08-10', status: 'confirmed', quote: 22000, createdAt: '2026-07-22' },
  { id: 'vb2', relocationId: 'r3', customerName: 'Rohan Desai', vendorId: 'v5', vendorName: 'Reliable Packers', bookingDate: '2026-07-29', status: 'completed', quote: 18000, finalAmount: 17500, createdAt: '2026-07-24' },
  { id: 'vb3', relocationId: 'r4', customerName: 'Sunita Rao', vendorId: 'v1', vendorName: 'Swift Packers & Movers', bookingDate: '2026-07-28', status: 'confirmed', quote: 28000, createdAt: '2026-07-26' },
  { id: 'vb4', relocationId: 'r7', customerName: 'Karthik Reddy', vendorId: 'v2', vendorName: 'SafeMove Logistics', bookingDate: '2026-08-25', status: 'pending', quote: 24000, createdAt: '2026-07-30' },
];

// ─── Utilities ────────────────────────────────────────────────────────────────
export const utilities: Utility[] = [
  { id: 'u1', relocationId: 'r3', customerName: 'Rohan Desai', type: 'electricity', provider: 'TNEB', status: 'active', applicationDate: '2026-08-02', activationDate: '2026-08-05', accountNumber: 'TNEB2026001' },
  { id: 'u2', relocationId: 'r3', customerName: 'Rohan Desai', type: 'gas', provider: 'IGL', status: 'applied', applicationDate: '2026-08-03' },
  { id: 'u3', relocationId: 'r3', customerName: 'Rohan Desai', type: 'internet', provider: 'Airtel', status: 'pending' },
  { id: 'u4', relocationId: 'r3', customerName: 'Rohan Desai', type: 'water', provider: 'CMWSSB', status: 'pending' },
  { id: 'u5', relocationId: 'r6', customerName: 'Preethi Nair', type: 'electricity', provider: 'TSSPDCL', status: 'active', applicationDate: '2026-08-07', activationDate: '2026-08-09', accountNumber: 'TSS2026042' },
  { id: 'u6', relocationId: 'r6', customerName: 'Preethi Nair', type: 'gas', provider: 'Bharat Gas', status: 'active', applicationDate: '2026-08-07', activationDate: '2026-08-10' },
  { id: 'u7', relocationId: 'r6', customerName: 'Preethi Nair', type: 'internet', provider: 'JioFiber', status: 'applied', applicationDate: '2026-08-08' },
  { id: 'u8', relocationId: 'r4', customerName: 'Sunita Rao', type: 'electricity', provider: 'MSEDCL', status: 'pending' },
  { id: 'u9', relocationId: 'r4', customerName: 'Sunita Rao', type: 'internet', provider: 'Tata Play Fiber', status: 'pending' },
];

// ─── Address Change Items ─────────────────────────────────────────────────────
export const addressChangeItems: AddressChangeItem[] = [
  { id: 'ac1', relocationId: 'r6', institution: 'Aadhaar Card (UIDAI)', category: 'Government ID', status: 'completed', submittedDate: '2026-08-12', completedDate: '2026-08-14' },
  { id: 'ac2', relocationId: 'r6', institution: 'PAN Card (ITD)', category: 'Government ID', status: 'submitted', submittedDate: '2026-08-12' },
  { id: 'ac3', relocationId: 'r6', institution: 'HDFC Bank', category: 'Banking', status: 'submitted', submittedDate: '2026-08-13' },
  { id: 'ac4', relocationId: 'r6', institution: 'SBI Bank', category: 'Banking', status: 'pending' },
  { id: 'ac5', relocationId: 'r6', institution: 'Driving Licence (RTO)', category: 'Government ID', status: 'pending' },
  { id: 'ac6', relocationId: 'r6', institution: 'Voter ID (ECI)', category: 'Government ID', status: 'pending' },
  { id: 'ac7', relocationId: 'r6', institution: 'LIC Policy', category: 'Insurance', status: 'pending' },
  { id: 'ac8', relocationId: 'r6', institution: 'Health Insurance', category: 'Insurance', status: 'pending' },
  { id: 'ac9', relocationId: 'r6', institution: 'Employer (HR)', category: 'Employment', status: 'completed', submittedDate: '2026-08-11', completedDate: '2026-08-11' },
  { id: 'ac10', relocationId: 'r6', institution: 'Amazon / Flipkart', category: 'Online Services', status: 'pending' },
  { id: 'ac11', relocationId: 'r3', institution: 'Aadhaar Card (UIDAI)', category: 'Government ID', status: 'pending' },
  { id: 'ac12', relocationId: 'r3', institution: 'HDFC Bank', category: 'Banking', status: 'pending' },
];

// ─── Documents ────────────────────────────────────────────────────────────────
export const documents: Document[] = [
  { id: 'd1', relocationId: 'r1', customerName: 'Amit Joshi', type: 'id_proof', label: 'Aadhaar Card', uploadedAt: '2026-07-03', verified: true, required: true },
  { id: 'd2', relocationId: 'r1', customerName: 'Amit Joshi', type: 'address_proof', label: 'Utility Bill', uploadedAt: '2026-07-03', verified: true, required: true },
  { id: 'd3', relocationId: 'r1', customerName: 'Amit Joshi', type: 'employment_letter', label: 'Employment Letter', uploadedAt: undefined, verified: false, required: true },
  { id: 'd4', relocationId: 'r1', customerName: 'Amit Joshi', type: 'rental_agreement', label: 'New Rental Agreement', uploadedAt: undefined, verified: false, required: true },
  { id: 'd5', relocationId: 'r2', customerName: 'Neha Kapoor', type: 'id_proof', label: 'Aadhaar Card', uploadedAt: '2026-07-07', verified: true, required: true },
  { id: 'd6', relocationId: 'r2', customerName: 'Neha Kapoor', type: 'address_proof', label: 'Utility Bill', uploadedAt: undefined, verified: false, required: true },
  { id: 'd7', relocationId: 'r2', customerName: 'Neha Kapoor', type: 'employment_letter', label: 'Employment Letter', uploadedAt: undefined, verified: false, required: true },
  { id: 'd8', relocationId: 'r3', customerName: 'Rohan Desai', type: 'id_proof', label: 'Aadhaar Card', uploadedAt: '2026-07-10', verified: true, required: true },
  { id: 'd9', relocationId: 'r3', customerName: 'Rohan Desai', type: 'address_proof', label: 'Utility Bill', uploadedAt: '2026-07-10', verified: true, required: true },
  { id: 'd10', relocationId: 'r3', customerName: 'Rohan Desai', type: 'employment_letter', label: 'Employment Letter (Infosys)', uploadedAt: '2026-07-11', verified: true, required: true },
  { id: 'd11', relocationId: 'r3', customerName: 'Rohan Desai', type: 'rental_agreement', label: 'New Rental Agreement', uploadedAt: '2026-07-23', verified: true, required: true },
];

// ─── Tasks ────────────────────────────────────────────────────────────────────
export const tasks: Task[] = [
  { id: 't1', relocationId: 'r1', customerName: 'Amit Joshi', title: 'Collect employment letter from customer', assignedToId: 'tm2', assignedToName: 'Rahul Verma', dueDate: '2026-07-25', status: 'overdue', priority: 'high', createdAt: '2026-07-21' },
  { id: 't2', relocationId: 'r1', customerName: 'Amit Joshi', title: 'Confirm final inventory list with customer', assignedToId: 'tm2', assignedToName: 'Rahul Verma', dueDate: '2026-08-03', status: 'in_progress', priority: 'high', createdAt: '2026-07-22' },
  { id: 't3', relocationId: 'r1', customerName: 'Amit Joshi', title: 'Confirm vendor booking with Swift Movers', assignedToId: 'tm4', assignedToName: 'Arjun Nair', dueDate: '2026-08-05', status: 'pending', priority: 'urgent', createdAt: '2026-07-22' },
  { id: 't4', relocationId: 'r2', customerName: 'Neha Kapoor', title: 'Schedule property visits for shortlisted flats', assignedToId: 'tm3', assignedToName: 'Sneha Patel', dueDate: '2026-07-28', status: 'overdue', priority: 'urgent', createdAt: '2026-07-15' },
  { id: 't5', relocationId: 'r2', customerName: 'Neha Kapoor', title: 'Collect address proof from customer', assignedToId: 'tm3', assignedToName: 'Sneha Patel', dueDate: '2026-07-26', status: 'overdue', priority: 'high', createdAt: '2026-07-15' },
  { id: 't6', relocationId: 'r3', customerName: 'Rohan Desai', title: 'Follow up on Airtel internet connection', assignedToId: 'tm2', assignedToName: 'Rahul Verma', dueDate: '2026-08-06', status: 'pending', priority: 'medium', createdAt: '2026-08-02' },
  { id: 't7', relocationId: 'r3', customerName: 'Rohan Desai', title: 'Confirm CMWSSB water connection application', assignedToId: 'tm2', assignedToName: 'Rahul Verma', dueDate: '2026-08-04', status: 'overdue', priority: 'medium', createdAt: '2026-08-02' },
  { id: 't8', relocationId: 'r4', customerName: 'Sunita Rao', title: 'Monitor move day progress and check-in', assignedToId: 'tm4', assignedToName: 'Arjun Nair', dueDate: '2026-07-28', status: 'in_progress', priority: 'urgent', createdAt: '2026-07-27' },
  { id: 't9', relocationId: 'r4', customerName: 'Sunita Rao', title: 'Set up electricity connection at new address', assignedToId: 'tm3', assignedToName: 'Sneha Patel', dueDate: '2026-07-30', status: 'pending', priority: 'high', createdAt: '2026-07-27' },
  { id: 't10', relocationId: 'r5', customerName: 'Vikram Singh', title: 'Send onboarding documents checklist to customer', assignedToId: 'tm2', assignedToName: 'Rahul Verma', dueDate: '2026-07-15', status: 'overdue', priority: 'medium', createdAt: '2026-07-13' },
  { id: 't11', relocationId: 'r6', customerName: 'Preethi Nair', title: 'Chase bank address change (SBI)', assignedToId: 'tm3', assignedToName: 'Sneha Patel', dueDate: '2026-08-15', status: 'pending', priority: 'medium', createdAt: '2026-08-11' },
  { id: 't12', relocationId: 'r7', customerName: 'Karthik Reddy', title: 'Get rental agreement signed by both parties', assignedToId: 'tm2', assignedToName: 'Rahul Verma', dueDate: '2026-08-02', status: 'overdue', priority: 'high', createdAt: '2026-07-30' },
  { id: 't13', relocationId: 'r7', customerName: 'Karthik Reddy', title: 'Begin move planning — book vendor and set dates', assignedToId: 'tm4', assignedToName: 'Arjun Nair', dueDate: '2026-08-05', status: 'pending', priority: 'high', createdAt: '2026-07-30' },
  { id: 't14', relocationId: 'r8', customerName: 'Meera Iyer', title: 'Complete customer intake and requirements gathering', assignedToId: 'tm3', assignedToName: 'Sneha Patel', dueDate: '2026-07-24', status: 'overdue', priority: 'medium', createdAt: '2026-07-20' },
];

// ─── Notifications ────────────────────────────────────────────────────────────
export const notifications: Notification[] = [
  { id: 'n1', type: 'overdue_task', title: 'Task Overdue', message: 'Neha Kapoor: Property visits not scheduled — 6 days overdue', relatedId: 't4', relatedType: 'task', read: false, createdAt: '2026-08-03T09:00:00', priority: 'urgent' },
  { id: 'n2', type: 'missing_document', title: 'Missing Document', message: 'Amit Joshi: Employment letter still not uploaded — move in 7 days', relatedId: 'r1', relatedType: 'relocation', read: false, createdAt: '2026-08-03T08:30:00', priority: 'high' },
  { id: 'n3', type: 'move_reminder', title: 'Move in 2 Days', message: 'Sunita Rao move scheduled for July 28 — vendor confirmed?', relatedId: 'r4', relatedType: 'relocation', read: false, createdAt: '2026-08-03T08:00:00', priority: 'urgent' },
  { id: 'n4', type: 'overdue_task', title: 'Task Overdue', message: 'Rohan Desai: CMWSSB water application overdue by 1 day', relatedId: 't7', relatedType: 'task', read: false, createdAt: '2026-08-03T07:45:00', priority: 'medium' },
  { id: 'n5', type: 'customer_attention', title: 'Needs Attention', message: 'Neha Kapoor: Move date is Aug 5 with no property selected yet', relatedId: 'r2', relatedType: 'relocation', read: true, createdAt: '2026-08-02T16:00:00', priority: 'urgent' },
  { id: 'n6', type: 'utility_pending', title: 'Utility Setup Pending', message: 'Sunita Rao: No utilities set up at new Mumbai address', relatedId: 'r4', relatedType: 'relocation', read: true, createdAt: '2026-08-02T14:00:00', priority: 'high' },
  { id: 'n7', type: 'stage_completed', title: 'Stage Completed', message: 'Preethi Nair: Utility setup completed successfully', relatedId: 'r6', relatedType: 'relocation', read: true, createdAt: '2026-08-01T11:00:00', priority: 'low' },
];

// ─── Activity Timeline ────────────────────────────────────────────────────────
export const activityEvents: ActivityEvent[] = [
  { id: 'ae1', relocationId: 'r1', customerName: 'Amit Joshi', action: 'Stage Changed', description: 'Moved to Move Planning stage', performedBy: 'Rahul Verma', timestamp: '2026-07-21T10:00:00', type: 'stage_change' },
  { id: 'ae2', relocationId: 'r1', customerName: 'Amit Joshi', action: 'Task Created', description: 'Task: Confirm inventory list created', performedBy: 'Rahul Verma', timestamp: '2026-07-22T11:30:00', type: 'task' },
  { id: 'ae3', relocationId: 'r1', customerName: 'Amit Joshi', action: 'Vendor Booked', description: 'Swift Packers & Movers booked for Aug 10', performedBy: 'Arjun Nair', timestamp: '2026-07-22T14:00:00', type: 'booking' },
  { id: 'ae4', relocationId: 'r3', customerName: 'Rohan Desai', action: 'Stage Changed', description: 'Moved to Utility Setup stage', performedBy: 'Rahul Verma', timestamp: '2026-08-01T09:00:00', type: 'stage_change' },
  { id: 'ae5', relocationId: 'r3', customerName: 'Rohan Desai', action: 'Utility Activated', description: 'TNEB electricity connection activated', performedBy: 'Rahul Verma', timestamp: '2026-08-05T16:00:00', type: 'utility' },
  { id: 'ae6', relocationId: 'r4', customerName: 'Sunita Rao', action: 'Stage Changed', description: 'Moved to Packing & Moving stage', performedBy: 'Sneha Patel', timestamp: '2026-07-28T08:00:00', type: 'stage_change' },
  { id: 'ae7', relocationId: 'r6', customerName: 'Preethi Nair', action: 'Stage Changed', description: 'Moved to Address Change stage', performedBy: 'Sneha Patel', timestamp: '2026-08-11T10:00:00', type: 'stage_change' },
  { id: 'ae8', relocationId: 'r2', customerName: 'Neha Kapoor', action: 'Property Added', description: '2 properties shortlisted in Pune', performedBy: 'Sneha Patel', timestamp: '2026-07-13T13:00:00', type: 'document' },
  { id: 'ae9', relocationId: 'r7', customerName: 'Karthik Reddy', action: 'Property Selected', description: 'Whitefield property selected', performedBy: 'Rahul Verma', timestamp: '2026-07-30T15:00:00', type: 'stage_change' },
  { id: 'ae10', relocationId: 'r5', customerName: 'Vikram Singh', action: 'Customer Onboarded', description: 'Customer onboarding started', performedBy: 'Rahul Verma', timestamp: '2026-07-13T09:30:00', type: 'stage_change' },
];

// ─── Smart Alerts (computed) ──────────────────────────────────────────────────
export const smartAlerts = [
  { id: 'sa1', type: 'attention' as const, severity: 'error' as const, title: '🚨 Urgent: Neha Kapoor — Move in 2 days, no property selected', message: 'Move date: Aug 5. Still in property search. Escalate immediately.', relatedId: 'r2', relatedType: 'relocation', actionLabel: 'View Relocation' },
  { id: 'sa2', type: 'overdue' as const, severity: 'error' as const, title: '⏰ 5 tasks are overdue across active relocations', message: 'Neha Kapoor (2), Amit Joshi (1), Rohan Desai (1), Meera Iyer (1)', relatedId: '', relatedType: 'task', actionLabel: 'View Tasks' },
  { id: 'sa3', type: 'missing_doc' as const, severity: 'warning' as const, title: '📄 Missing documents before move day', message: 'Amit Joshi is missing employment letter and rental agreement — move is Aug 10', relatedId: 'r1', relatedType: 'relocation', actionLabel: 'View Documents' },
  { id: 'sa4', type: 'reminder' as const, severity: 'warning' as const, title: '🔌 Utilities not set up for Sunita Rao', message: 'Move completed. No electricity or internet set up at new Mumbai address.', relatedId: 'r4', relatedType: 'relocation', actionLabel: 'View Utilities' },
  { id: 'sa5', type: 'conflict' as const, severity: 'warning' as const, title: '📅 Rahul Verma has 5 active relocations', message: 'Workload may affect service quality. Consider rebalancing assignments.', relatedId: 'tm2', relatedType: 'team', actionLabel: 'View Team' },
];
