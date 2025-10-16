# Component Library Guide

## Overview

The LC Apps component library is built on top of shadcn/ui and Radix UI primitives, providing a consistent and accessible design system across both portal-web and admin-ui.

## Installation

Components are already installed in the project. To add a new shadcn/ui component:

```bash
# Not recommended - we're using manual copies
# npx shadcn@latest add [component-name]

# Instead, copy from shared/ui/ or portal-web/components/ui/
```

## Component Location

```
portal-web/components/ui/  # Portal-specific components
admin-ui/components/ui/    # Admin-specific components
shared/ui/                 # Shared components (source)
```

## Core Components

### Button

Versatile button component with multiple variants and sizes.

```tsx
import { Button } from "@/components/ui/button";

// Default button
<Button>Click me</Button>

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>

// As Link
<Button asChild>
  <Link href="/about">About</Link>
</Button>

// Disabled
<Button disabled>Disabled</Button>

// Loading state
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>
```

### Input

Text input with consistent styling.

```tsx
import { Input } from "@/components/ui/input";

// Basic input
<Input type="text" placeholder="Enter text" />

// Email input
<Input type="email" placeholder="email@example.com" />

// Password input
<Input type="password" placeholder="Password" />

// With label
<div className="space-y-2">
  <label htmlFor="username">Username</label>
  <Input id="username" type="text" />
</div>

// Disabled
<Input disabled placeholder="Disabled" />

// With React Hook Form
const { register } = useForm();
<Input {...register("email")} type="email" />
```

### Card

Container component for grouping content.

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Dialog

Modal dialog for displaying content.

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description goes here
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-4">
      {/* Dialog content */}
    </div>
  </DialogContent>
</Dialog>

// Controlled dialog
const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    {/* Content */}
  </DialogContent>
</Dialog>
```

### Toast

Notification component for user feedback.

```tsx
import { useToast } from "@/hooks/use-toast";
import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast";

// In your layout
<ToastProvider>
  {children}
  <ToastViewport />
</ToastProvider>

// In your component
const { toast } = useToast();

// Success toast
toast({
  title: "Success",
  description: "Your changes have been saved.",
});

// Error toast
toast({
  title: "Error",
  description: "Something went wrong.",
  variant: "destructive",
});

// With action
toast({
  title: "Scheduled",
  description: "Event scheduled for tomorrow",
  action: (
    <ToastAction altText="Undo">Undo</ToastAction>
  ),
});
```

## Utility Functions

### cn() - Class Name Merger

Merges Tailwind classes intelligently.

```tsx
import { cn } from "@/lib/utils";

// Basic usage
cn("text-sm", "font-medium") // "text-sm font-medium"

// Conditional classes
cn("base-class", isActive && "active-class") // "base-class active-class"

// Override Tailwind classes
cn("text-sm", "text-lg") // "text-lg" (last one wins)

// In components
<div className={cn("default-styles", className)}>
  {/* Content */}
</div>
```

### Date Formatters

```tsx
import { formatDate, formatDateTime } from "@/lib/utils";

// Format date
formatDate("2024-01-15") // "15.01.2024"
formatDate(new Date()) // Current date

// Format datetime
formatDateTime("2024-01-15T10:30:00") // "15.01.2024, 10:30"
```

### truncate()

```tsx
import { truncate } from "@/lib/utils";

truncate("Long text here...", 10) // "Long text..."
```

## Best Practices

### Component Composition

```tsx
// Good - Composable
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Bad - Monolithic
<Card title="Title" content="Content" />
```

### Prop Spreading

```tsx
// Good - Explicit props
<Button variant="outline" size="sm">
  Click
</Button>

// Also good - Spreading with overrides
<Button {...buttonProps} className={cn(buttonProps.className, "mt-4")}>
  Click
</Button>
```

### Accessibility

```tsx
// Always include labels
<label htmlFor="email">Email</label>
<Input id="email" type="email" />

// Use semantic HTML
<button> ✓
<div onClick={}> ✗

// Include ARIA labels when needed
<Button aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>
```

### Responsive Design

```tsx
// Use Tailwind breakpoints
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Cards */}
</div>

// Hide on mobile
<div className="hidden md:block">
  {/* Desktop only */}
</div>

// Mobile-specific styles
<Button className="w-full md:w-auto">
  Responsive Button
</Button>
```

## Custom Components

### Creating New Components

```tsx
// components/ui/custom-button.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";

interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
}

export const CustomButton = React.forwardRef<
  HTMLButtonElement,
  CustomButtonProps
>(({ loading, children, className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      disabled={loading || props.disabled}
      className={cn("relative", className)}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </span>
      )}
      <span className={loading ? "invisible" : ""}>
        {children}
      </span>
    </Button>
  );
});
CustomButton.displayName = "CustomButton";
```

### Layout Components

```tsx
// components/layout/page-header.tsx
interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

// Usage
<PageHeader
  title="Users"
  description="Manage your users"
  action={<Button>Add User</Button>}
/>
```

## Theme Customization

### Colors

Edit `app/globals.css`:

```css
@theme {
  --color-primary: oklch(55% 0.21 263);
  --color-secondary: oklch(96% 0 0);
  --color-destructive: oklch(60% 0.21 25);
  /* ... */
}
```

### Fonts

Update layout:

```tsx
import { Inter, Roboto_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const mono = Roboto_Mono({ subsets: ["latin"] });

// Use in components
<div className={inter.className}>
  Regular text
</div>
<code className={mono.className}>
  Code text
</code>
```

## Performance Tips

1. **Lazy Loading**: Use dynamic imports for heavy components
   ```tsx
   const HeavyComponent = dynamic(() => import("./heavy-component"));
   ```

2. **Memoization**: Use React.memo for expensive components
   ```tsx
   export const ExpensiveCard = React.memo(({ data }) => {
     // Component logic
   });
   ```

3. **Virtualization**: Use for long lists
   ```tsx
   import { useVirtualizer } from "@tanstack/react-virtual";
   ```

## Testing Components

```tsx
import { render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByText("Click").click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Additional Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
