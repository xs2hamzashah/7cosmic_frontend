"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownCircle } from "lucide-react";
import { cn } from "../../lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef(
  ({ className, children, suffixContent, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all [&[data-state=open]>p>svg]:rotate-180 ",
          className
        )}
        {...props}
      >
        {children}
        <p className="flex items-center gap-x-2">
          {suffixContent && (
            <span className="text-base font-medium">{suffixContent}</span>
          )}
          <ChevronDownCircle className="h-4 w-4 shrink-0 transition-transform duration-200 text-green-700" />
        </p>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
);
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className
      )}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </AccordionPrimitive.Content>
  )
);

AccordionContent.displayName = AccordionPrimitive.Content.displayName;
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
