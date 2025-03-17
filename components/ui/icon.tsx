'use client';

interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: string;
  variant?: 'outlined' | 'rounded' | 'sharp';
  fill?: boolean;
  size?: number;
  weight?: number;
}

export function Icon({ 
  name, 
  variant = 'rounded', 
  fill = false,
  size = 20,
  weight = 500,
  className,
  ...props 
}: IconProps) {
  return (
    <i 
      className={`material-symbols-${variant} ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}`,
        fontSize: `${size}px`,
      }}
      {...props}
    >
      {name}
    </i>
  );
}
