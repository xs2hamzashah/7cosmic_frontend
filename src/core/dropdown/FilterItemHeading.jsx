import { AlertCircle } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const FilterItemHeading = forwardRef(({ title, className }, ref) => {
  return (
    <h6
      ref={ref}
      className={cn(
        "text-sm font-medium flex gap-x-2 items-center text-slate-700",
        className
      )}
    >
      <span>{title}</span>
      <span>
        <AlertCircle size={10} className="rounded-full text-gray-600" />
      </span>
    </h6>
  );
});

FilterItemHeading.displayName = "FilterItemHeading";
