import { cn } from '../../lib/utils';

interface BadgeProps {
  label: string;
  color?: string;
  bg?: string;
  className?: string;
  dot?: boolean;
  dotColor?: string;
}

export function Badge({ label, color = 'text-slate-700', bg = 'bg-slate-100', className, dot, dotColor }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium', color, bg, className)}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColor ?? 'bg-current')} />}
      {label}
    </span>
  );
}
