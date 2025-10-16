"use client";

import * as React from "react";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface DialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined);

function useDialogContext() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within Dialog");
  }
  return context;
}

export function Dialog({ 
  children, 
  open: controlledOpen,
  onOpenChange,
}: { 
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ 
  children, 
  asChild,
}: { 
  children: React.ReactNode;
  asChild?: boolean;
}) {
  const { setOpen } = useDialogContext();
  
  const handleClick = () => setOpen(true);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
    } as any);
  }

  return (
    <button onClick={handleClick} type="button">
      {children}
    </button>
  );
}

export function DialogContent({ 
  children, 
  className,
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  const { open, setOpen } = useDialogContext();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/80" 
        onClick={() => setOpen(false)}
      />
      <div className={cn(
        "relative z-50 grid w-full max-w-lg gap-4 border border-foreground/10 bg-background p-6 shadow-lg rounded-lg",
        className
      )}>
        {children}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
}

export function DialogHeader({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left",
        className
      )}
      {...props}
    />
  );
}

export function DialogFooter({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className
      )}
      {...props}
    />
  );
}

export function DialogTitle({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function DialogDescription({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-foreground/70", className)}
      {...props}
    />
  );
}
