import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils.js";

const Select = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "w-full appearance-none rounded-lg border border-line bg-white px-4 py-3 pr-10 text-[15px] text-ink transition-colors duration-150",
          "focus:border-gold focus:shadow-[0_0_0_3px_rgba(176,138,62,0.18)]",
          "disabled:bg-papyrus-dim disabled:text-ink-soft",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
        aria-hidden="true"
      />
    </div>
  );
});
Select.displayName = "Select";

export default Select;
