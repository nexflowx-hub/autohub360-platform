'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/cn';

export function Accordion({
  items,
  className,
}: {
  items: Array<{ question: string; answer: string }>;
  className?: string;
}) {
  return (
    <AccordionPrimitive.Root type="single" collapsible className={cn('flex flex-col', className)}>
      {items.map((item, i) => (
        <AccordionPrimitive.Item
          key={i}
          value={`item-${i}`}
          className="overflow-hidden rounded-lg border border-surface-200 bg-white data-[state=open]:border-ahblue-500/40"
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-[15px] font-semibold text-ink-900 transition-colors hover:bg-surface-50">
              {item.question}
              <ChevronDown
                aria-hidden="true"
                className="h-4.5 w-4.5 shrink-0 text-ink-500 transition-transform duration-200 group-data-[state=open]:rotate-180"
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-none">
            <p className="border-t border-surface-100 px-4 py-3.5 text-[15px] leading-relaxed text-ink-700">
              {item.answer}
            </p>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
