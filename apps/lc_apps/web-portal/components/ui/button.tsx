import * as React from "react";

const buttonVariants = {
  variant: {
    default: "bg-gradient-to-r from-primary to-primary-dark text-black shadow hover:opacity-90",
    destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700",
    outline: "border border-primary/20 bg-background shadow-sm hover:bg-primary/10 text-text-soft hover:text-primary",
    secondary: "bg-primary/10 text-foreground shadow-sm hover:bg-primary/20",
    ghost: "hover:bg-primary/10 text-text-soft hover:text-primary",
    link: "text-primary underline-offset-4 hover:underline",
  },
  size: {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "h-9 w-9",
  },
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    const classes = [
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
      "disabled:pointer-events-none disabled:opacity-50",
      buttonVariants.variant[variant],
      buttonVariants.size[size],
      className,
    ].filter(Boolean).join(" ");

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: classes,
        ref,
        ...props,
      });
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
