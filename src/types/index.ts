// ─── Enums ────────────────────────────────────────────────────────────────────

export type CustomerType = 'individual' | 'corporate';

export type RelocationStatus =
  | 'inquiry'
  | 'onboarding'
  | 'property_search'
  | 'property_finalized'
  | 'move_planning'
  | 'packing_moving'
  | 'utility_setup'
  | 'address_change'
  | 'post_move_support'
  | 'completed'
  | 'cancelled';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export type PropertyStatus = 'shortlisted' | 'visited' | 'selected' | 'rejected';

export type VendorType = 'movers' | 'packers' | 'both';

export type UtilityType = 'electricity' | 'gas' | 'internet' | 'water' | 'lpg';

export type UtilityStatus = 'pending' | 'applied' | 'active' | 'failed';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type DocumentType =
  | 'id_proof'
  | 'address_proof'
  | 'employment_letter'
  | 'rental_agreement'
  | 'noc'
  | 'other';

export type NotificationType =
  | 'overdue_task'
  | 'missing_document'
  | 'scheduling_conflict'
  | 'move_reminder'
  | 'utility_pending'
  | 'customer_attention'
  | 'stage_completed'
  | 'general';

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  activeRelocationCount: number;
}

export interface CorporateClient {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  activeRelocations: number;
  totalRelocations: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: CustomerType;
  corporateClientId?: string;
  corporateClientName?: string;
  assignedCoordinatorId: string;
  assignedCoordinatorName: string;
  createdAt: string;
  notes?: string;
}

export interface RelocationStage {
  stage: RelocationStatus;
  label: string;
  status: 'completed' | 'active' | 'pending';
  startedAt?: string;
  completedAt?: string;
}

export interface Relocation {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  fromCity: string;
  fromAddress: string;
  toCity: string;
  toAddress: string;
  moveDate: string;
  status: RelocationStatus;
  priority: Priority;
  estimatedBudget: number;
  actualCost?: number;
  assignedCoordinatorId: string;
  assignedCoordinatorName: string;
  notes?: string;
  createdAt: string;
  stages: RelocationStage[];
  completionPercentage: number;
}

export interface Property {
  id: string;
  relocationId: string;
  address: string;
  city: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: PropertyStatus;
  brokerId?: string;
  brokerName?: string;
  brokerPhone?: string;
  visitDate?: string;
  notes?: string;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  type: VendorType;
  phone: string;
  email?: string;
  city: string;
  rating: number;
  totalJobs: number;
  available: boolean;
  notes?: string;
}

export interface VendorBooking {
  id: string;
  relocationId: string;
  customerName: string;
  vendorId: string;
  vendorName: string;
  bookingDate: string;
  status: BookingStatus;
  quote: number;
  finalAmount?: number;
  notes?: string;
  createdAt: string;
}

export interface Utility {
  id: string;
  relocationId: string;
  customerName: string;
  type: UtilityType;
  provider: string;
  status: UtilityStatus;
  applicationDate?: string;
  activationDate?: string;
  accountNumber?: string;
  notes?: string;
}

export interface AddressChangeItem {
  id: string;
  relocationId: string;
  institution: string;
  category: string;
  status: 'pending' | 'submitted' | 'completed';
  submittedDate?: string;
  completedDate?: string;
  notes?: string;
}

export interface Document {
  id: string;
  relocationId: string;
  customerName: string;
  type: DocumentType;
  label: string;
  uploadedAt?: string;
  verified: boolean;
  required: boolean;
}

export interface Task {
  id: string;
  relocationId: string;
  customerName: string;
  title: string;
  description?: string;
  assignedToId: string;
  assignedToName: string;
  dueDate: string;
  status: TaskStatus;
  priority: Priority;
  completedAt?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
  relatedType?: string;
  read: boolean;
  createdAt: string;
  priority: Priority;
}

export interface ActivityEvent {
  id: string;
  relocationId: string;
  customerName: string;
  action: string;
  description: string;
  performedBy: string;
  timestamp: string;
  type: 'stage_change' | 'task' | 'document' | 'note' | 'booking' | 'utility' | 'system';
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardSummary {
  activeRelocations: number;
  delayedRelocations: number;
  pendingTasks: number;
  upcomingMoves: number;
  highPriorityCustomers: number;
  completedThisMonth: number;
  totalCustomers: number;
  overdueTaskCount: number;
  missingDocuments: number;
  schedulingConflicts: number;
}

export interface SmartAlert {
  id: string;
  type: 'overdue' | 'missing_doc' | 'conflict' | 'attention' | 'reminder';
  severity: 'info' | 'warning' | 'error';
  title: string;
  message: string;
  relatedId: string;
  relatedType: string;
  actionLabel?: string;
}
