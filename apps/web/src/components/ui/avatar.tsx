import { cn, getInitials } from '@/lib/utils';

const sizes = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: keyof typeof sizes;
  className?: string;
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        'relative shrink-0 rounded-full flex items-center justify-center font-medium',
        'bg-primary/20 text-primary-light',
        sizes[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
