import { create } from 'zustand';
import {
  customers as initialCustomers,
  relocations as initialRelocations,
  properties as initialProperties,
  vendors as initialVendors,
  vendorBookings as initialBookings,
  utilities as initialUtilities,
  addressChangeItems as initialAddressItems,
  documents as initialDocuments,
  tasks as initialTasks,
  notifications as initialNotifications,
  activityEvents as initialActivity,
  teamMembers as initialTeam,
  corporateClients as initialCorporates,
} from '../data/mockData';
import type {
  Customer, Relocation, Property, Vendor, VendorBooking, Utility,
  AddressChangeItem, Document, Task, Notification, ActivityEvent,
  TeamMember, CorporateClient,
} from '../types';

interface AppState {
  // Data
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

  // UI state
  sidebarOpen: boolean;
  searchQuery: string;

  // Actions
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (q: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;

  addRelocation: (r: Relocation) => void;
  updateRelocation: (id: string, updates: Partial<Relocation>) => void;

  addCustomer: (c: Customer) => void;

  updateUtility: (id: string, updates: Partial<Utility>) => void;
  updateAddressItem: (id: string, updates: Partial<AddressChangeItem>) => void;

  unreadCount: () => number;
}

export const useStore = create<AppState>((set, get) => ({
  customers: initialCustomers,
  relocations: initialRelocations,
  properties: initialProperties,
  vendors: initialVendors,
  vendorBookings: initialBookings,
  utilities: initialUtilities,
  addressChangeItems: initialAddressItems,
  documents: initialDocuments,
  tasks: initialTasks,
  notifications: initialNotifications,
  activityEvents: initialActivity,
  teamMembers: initialTeam,
  corporateClients: initialCorporates,

  sidebarOpen: true,
  searchQuery: '',

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSearchQuery: (q) => set({ searchQuery: q }),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  addRelocation: (r) =>
    set((state) => ({ relocations: [r, ...state.relocations] })),

  updateRelocation: (id, updates) =>
    set((state) => ({
      relocations: state.relocations.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    })),

  addCustomer: (c) =>
    set((state) => ({ customers: [c, ...state.customers] })),

  updateUtility: (id, updates) =>
    set((state) => ({
      utilities: state.utilities.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    })),

  updateAddressItem: (id, updates) =>
    set((state) => ({
      addressChangeItems: state.addressChangeItems.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),

  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}));
