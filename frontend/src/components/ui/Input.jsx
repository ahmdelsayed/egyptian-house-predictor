import { forwardRef } from "react";
import { cn } from "../../lib/utils.js";

const Input = forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-line bg-white px-4 py-3 text-[15px] text-ink transition-colors duration-150",
        "focus:border-gold focus:shadow-[0_0_0_3px_rgba(176,138,62,0.18)]",
        "disabled:bg-papyrus-dim disabled:text-ink-soft",
        "placeholder:text-ink-soft/60",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export default Input;
