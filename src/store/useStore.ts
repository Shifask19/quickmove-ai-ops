import { create } from 'zustand';
import { api } from '../lib/api';
import type {
  Customer, Relocation, Property, Vendor, VendorBooking, Utility,
  AddressChangeItem, Document, Task, Notification, ActivityEvent,
  TeamMember, CorporateClient,
} from '../types';

// ─── Helper: snake_case DB row → camelCase TS type ───────────────────────────
function toCamel(obj: Record<string, any>): any {
  if (!obj) return obj;
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
      v === 1 ? true : v === 0 ? false : v,
    ])
  );
}

function mapRows<T>(rows: any[]): T[] {
  return rows.map(toCamel) as T[];
}

function mapRow<T>(row: any): T {
  return toCamel(row) as T;
}

// ─── Store shape ──────────────────────────────────────────────────────────────
interface AppState {
  customers: Customer[];
  relocations: Relocation[];
  properties: Property[];
  vendors: Vendor[];
  vendorBookings: VendorBooking[];
  utilities: Utility[];
  addressChangeItems: AddressChangeItem[];
  documents: Document[];
  tasks: Task[];
  notifications: Notification[];
  activityEvents: ActivityEvent[];
  teamMembers: TeamMember[];
  corporateClients: CorporateClient[];

  loading: boolean;
  sidebarOpen: boolean;
  searchQuery: string;

  // Bootstrap (called once on app load)
  bootstrap: () => Promise<void>;

  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (q: string) => void;

  // Customers
  addCustomer: (data: Omit<Customer, 'id' | 'createdAt'>) => Promise<void>;

  // Relocations
  addRelocation: (data: any) => Promise<void>;
  updateRelocation: (id: string, data: Partial<Relocation>) => Promise<void>;

  // Tasks
  addTask: (data: any) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;

  // Utilities
  updateUtility: (id: string, updates: Partial<Utility>) => Promise<void>;

  // Address change
  updateAddressItem: (id: string, updates: Partial<AddressChangeItem>) => Promise<void>;

  // Notifications
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  unreadCount: () => number;
}

export const useStore = create<AppState>((set, get) => ({
  customers: [],
  relocations: [],
  properties: [],
  vendors: [],
  vendorBookings: [],
  utilities: [],
  addressChangeItems: [],
  documents: [],
  tasks: [],
  notifications: [],
  activityEvents: [],
  teamMembers: [],
  corporateClients: [],

  loading: false,
  sidebarOpen: true,
  searchQuery: '',

  // ─── Bootstrap: load all data from API on app start ───────────────────────
  bootstrap: async () => {
    set({ loading: true });
    try {
      const [
        customers, relocations, properties, vendors, bookings,
        utilities, addressChangeItems, documents, tasks, notifications,
        activityEvents, teamMembers, corporateClients,
      ] = await Promise.all([
        api.customers.list().then((r: any) => mapRows<Customer>(r)),
        api.relocations.list().then((r: any) => (r as any[]).map((row: any) => ({
          ...toCamel(row),
          stages: (row.stages || []).map(toCamel),
        }))),
        api.properties.list().then((r: any) => mapRows<Property>(r)),
        api.vendors.list().then((r: any) => (r as any[]).map((v: any) => ({
          ...toCamel(v),
          bookings: (v.bookings || []).map(toCamel),
        }))),
        api.vendors.bookings.list().then((r: any) => mapRows<VendorBooking>(r)),
        api.utilities.list().then((r: any) => mapRows<Utility>(r)),
        api.addressChange.list().then((r: any) => mapRows<AddressChangeItem>(r)),
        api.documents.list().then((r: any) => mapRows<Document>(r)),
        api.tasks.list().then((r: any) => mapRows<Task>(r)),
        api.notifications.list().then((r: any) => mapRows<Notification>(r)),
        api.activity.list().then((r: any) => mapRows<ActivityEvent>(r)),
        api.team.list().then((r: any) => mapRows<TeamMember>(r)),
        api.corporateClients.list().then((r: any) => mapRows<CorporateClient>(r)),
      ]);

      set({
        customers, relocations, properties, vendors, vendorBookings: bookings,
        utilities, addressChangeItems, documents, tasks, notifications,
        activityEvents, teamMembers, corporateClients, loading: false,
      });
    } catch (err) {
      console.error('Bootstrap failed — falling back to empty state', err);
      set({ loading: false });
    }
  },

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSearchQuery: (q) => set({ searchQuery: q }),

  // ─── Customers ────────────────────────────────────────────────────────────
  addCustomer: async (data) => {
    const created = mapRow<Customer>(await api.customers.create(data) as any);
    set((s) => ({ customers: [created, ...s.customers] }));
  },

  // ─── Relocations ─────────────────────────────────────────────────────────
  addRelocation: async (data) => {
    const raw = await api.relocations.create(data) as any;
    const created = { ...toCamel(raw), stages: (raw.stages || []).map(toCamel) };
    set((s) => ({ relocations: [created, ...s.relocations] }));
  },

  updateRelocation: async (id, updates) => {
    const raw = await api.relocations.update(id, updates) as any;
    const updated = { ...toCamel(raw), stages: (raw.stages || []).map(toCamel) };
    set((s) => ({ relocations: s.relocations.map((r) => r.id === id ? updated : r) }));
  },

  // ─── Tasks ───────────────────────────────────────────────────────────────
  addTask: async (data) => {
    const created = mapRow<Task>(await api.tasks.create(data) as any);
    set((s) => ({ tasks: [created, ...s.tasks] }));
  },

  updateTask: async (id, updates) => {
    const updated = mapRow<Task>(await api.tasks.update(id, updates) as any);
    set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? updated : t) }));
  },

  // ─── Utilities ───────────────────────────────────────────────────────────
  updateUtility: async (id, updates) => {
    const updated = mapRow<Utility>(await api.utilities.update(id, updates) as any);
    set((s) => ({ utilities: s.utilities.map((u) => u.id === id ? updated : u) }));
  },

  // ─── Address Change ───────────────────────────────────────────────────────
  updateAddressItem: async (id, updates) => {
    const updated = mapRow<AddressChangeItem>(await api.addressChange.update(id, updates) as any);
    set((s) => ({ addressChangeItems: s.addressChangeItems.map((a) => a.id === id ? updated : a) }));
  },

  // ─── Notifications ────────────────────────────────────────────────────────
  markNotificationRead: async (id) => {
    await api.notifications.markRead(id);
    set((s) => ({ notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n) }));
  },

  markAllNotificationsRead: async () => {
    await api.notifications.markAllRead();
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
  },

  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}));
