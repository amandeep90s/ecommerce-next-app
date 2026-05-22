'use client';

import { format, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  id?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  className?: string;
}

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = 'Select date',
  disabled,
  minDate,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const date = value ? parseISO(value) : undefined;

  function handleSelect(selected: Date | undefined) {
    onChange?.(selected ? format(selected, 'yyyy-MM-dd') : undefined);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start font-normal',
            !date && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="mr-2 size-4 shrink-0" />
          {date ? format(date, 'PPP') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date}
          captionLayout="dropdown"
          disabled={minDate ? (d) => d < minDate : undefined}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
}
