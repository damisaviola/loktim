import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'premium';
}

function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  let baseStyles = "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  let variants = {
    default: "border-transparent bg-primary/10 text-primary hover:bg-primary/20",
    secondary: "border-transparent bg-secondary text-muted-foreground hover:bg-secondary/80",
    outline: "text-foreground border-border",
    premium: "border-transparent bg-amber-100 text-amber-800",
  };

  const compClass = `${baseStyles} ${variants[variant]} ${className}`;

  return (
    <div className={compClass} {...props} />
  );
}

export { Badge };
