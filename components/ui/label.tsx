import * as React from "react";
import { Label as LabelPrimitive } from "@radix-ui/react-label";
import { cn } from "@/lib/utils"; // If you don't have this, use clsx or just omit for now

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive>
>(({ className, ...props }, ref) => (
  <LabelPrimitive
    ref={ref}
    className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.displayName;

export { Label };