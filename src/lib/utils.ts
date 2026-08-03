import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isPast, differenceInDays, parseISO } from 'date-fns';
import type { Priority, RelocationStatus, TaskStatus, UtilityStatus, BookingStatus } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
export function formatDate(date: string | undefined) {
  if (!date) return '—';
  return format(parseISO(date), 'dd MMM yyyy');
}

export function formatDateTime(date: string | undefined) {
  if (!date) return '—';
  return format(parseISO(date), 'dd MMM yyyy, hh:mm a');
}

export function timeAgo(date: string) {
  return formatDistanceToNow(parseISO(date), { addSuffix: true });
}

export function isOverdue(dueDate: string) {
  return isPast(parseISO(dueDate));
}

export function daysUntil(date: string): number {
  return differenceInDays(parseISO(date), new Date());
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

// ─── Status label/color maps ──────────────────────────────────────────────────
export const relocationStatusMap: Record<RelocationStatus, { label: string; color: string; bg: string }> = {
  inquiry:            { label: 'Inquiry',            color: 'text-slate-600',  bg: 'bg-slate-100' },
  onboarding:         { label: 'Onboarding',         color: 'text-blue-700',   bg: 'bg-blue-100' },
  property_search:    { label: 'Property Search',    color: 'text-violet-700', bg: 'bg-violet-100' },
  property_finalized: { label: 'Property Finalized', color: 'text-indigo-700', bg: 'bg-indigo-100' },
  move_planning:      { label: 'Move Planning',      color: 'text-amber-700',  bg: 'bg-amber-100' },
  packing_moving:     { label: 'Packing & Moving',   color: 'text-orange-700', bg: 'bg-orange-100' },
  utility_setup:      { label: 'Utility Setup',      color: 'text-cyan-700',   bg: 'bg-cyan-100' },
  address_change:     { label: 'Address Change',     color: 'text-teal-700',   bg: 'bg-teal-100' },
  post_move_support:  { label: 'Post-Move Support',  color: 'text-pink-700',   bg: 'bg-pink-100' },
  completed:          { label: 'Completed',           color: 'text-green-700',  bg: 'bg-green-100' },
  cancelled:          { label: 'Cancelled',           color: 'text-red-700',    bg: 'bg-red-100' },
};

export const priorityMap: Record<Priority, { label: string; color: string; bg: string; dot: string }> = {
  low:    { label: 'Low',    color: 'text-slate-600', bg: 'bg-slate-100', dot: 'bg-slate-400' },
  medium: { label: 'Medium', color: 'text-blue-700',  bg: 'bg-blue-100',  dot: 'bg-blue-500' },
  high:   { label: 'High',   color: 'text-amber-700', bg: 'bg-amber-100', dot: 'bg-amber-500' },
  urgent: { label: 'Urgent', color: 'text-red-700',   bg: 'bg-red-100',   dot: 'bg-red-500' },
};

export const taskStatusMap: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  pending:     { label: 'Pending',     color: 'text-slate-600', bg: 'bg-slate-100' },
  in_progress: { label: 'In Progress', color: 'text-blue-700',  bg: 'bg-blue-100' },
  completed:   { label: 'Completed',   color: 'text-green-700', bg: 'bg-green-100' },
  overdue:     { label: 'Overdue',     color: 'text-red-700',   bg: 'bg-red-100' },
};

export const utilityStatusMap: Record<UtilityStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-slate-600', bg: 'bg-slate-100' },
  applied: { label: 'Applied', color: 'text-amber-700', bg: 'bg-amber-100' },
  active:  { label: 'Active',  color: 'text-green-700', bg: 'bg-green-100' },
  failed:  { label: 'Failed',  color: 'text-red-700',   bg: 'bg-red-100' },
};

export const bookingStatusMap: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Pending',   color: 'text-slate-600', bg: 'bg-slate-100' },
  confirmed: { label: 'Confirmed', color: 'text-blue-700',  bg: 'bg-blue-100' },
  completed: { label: 'Completed', color: 'text-green-700', bg: 'bg-green-100' },
  cancelled: { label: 'Cancelled', color: 'text-red-700',   bg: 'bg-red-100' },
};

export const utilityTypeMap: Record<string, { label: string; icon: string }> = {
  electricity: { label: 'Electricity', icon: '⚡' },
  gas:         { label: 'Gas',         icon: '🔥' },
  internet:    { label: 'Internet',    icon: '🌐' },
  water:       { label: 'Water',       icon: '💧' },
  lpg:         { label: 'LPG',         icon: '🫙' },
};

// ─── Next action recommendation ───────────────────────────────────────────────
export function getNextAction(status: RelocationStatus): string {
  const map: Record<RelocationStatus, string> = {
    inquiry:            'Complete intake form and assign coordinator',
    onboarding:         'Collect documents and set move date',
    property_search:    'Shortlist properties and schedule site visits',
    property_finalized: 'Get rental agreement signed and collect token',
    move_planning:      'Book vendor and finalize inventory list',
    packing_moving:     'Monitor move day and confirm item delivery',
    utility_setup:      'Apply for electricity, gas, internet, and water',
    address_change:     'Complete address change across all institutions',
    post_move_support:  'Follow up on any open issues; confirm satisfaction',
    completed:          'Case closed. Request testimonial / referral',
    cancelled:          'Archive and document cancellation reason',
  };
  return map[status];
}

export function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}
