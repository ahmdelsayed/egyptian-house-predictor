import { cn } from "../../lib/utils.js";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl2 border border-line bg-papyrus shadow-panel",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("p-8 pb-4 sm:p-10 sm:pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("px-8 pb-8 sm:px-10 sm:pb-10", className)} {...props}>
      {children}
    </div>
  );
}
