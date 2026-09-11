import { forwardRef } from "react";
import { cn } from "../../lib/utils.js";

const VARIANTS = {
  primary:
    "bg-navy text-papyrus hover:bg-navy-mid active:scale-[0.99] disabled:bg-ink-soft/40 disabled:text-papyrus/60",
  gold:
    "bg-gold text-navy hover:bg-gold-bright active:scale-[0.99] disabled:bg-gold/40",
  outline:
    "border border-papyrus/30 text-papyrus hover:bg-papyrus/10 active:scale-[0.99]",
  ghost: "text-ink hover:bg-ink/5 active:scale-[0.99]",
};

const SIZES = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-[15px]",
  lg: "px-7 py-4 text-base",
};

const Button = forwardRef(
  (
    { className, variant = "primary", size = "md", as: As = "button", children, ...props },
    ref
  ) => {
    return (
      <As
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all duration-150 disabled:cursor-not-allowed",
          VARIANTS[variant],
          SIZES[size],
          className
        )}
        {...props}
      >
        {children}
      </As>
    );
  }
);
Button.displayName = "Button";

export default Button;
