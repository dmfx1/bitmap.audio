/* src/components/ui/button-variants.ts */
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-4 foregroundspace-nowrap text-sm font-medium font-mono uppercase tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* EXPLORE: Solid background with an 'Inner Filament' glow on hover */
        default: `
          bg-primary text-primary-foreground border border-primary/20
          hover:bg-primary/90 hover:border-foreground/40
          hover:shadow-[0_0_25px_hsl(var(--primary)/0.5),inset_0_0_0_2px_rgba(255,255,255,0.3)]
          active:scale-95
        `,
        
        /* GET IN TOUCH: Remains the subtle Solaris outline */
        glow: "border border-accent/50 bg-transparent text-accent shadow-[0_0_15px_hsl(var(--accent)/0.2)] hover:border-accent hover:bg-accent/5 hover:shadow-[0_0_30px_hsl(var(--accent)/0.4)]",
        
        outline: "border border-primary/50 bg-transparent text-primary shadow-sm hover:bg-primary/5 hover:border-primary hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)]",
        minimal: "text-muted-foreground hover:text-primary border-b border-transparent hover:border-primary",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "text-foreground hover:bg-secondary hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-10 px-6 text-base",
        xl: "h-12 px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);