
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
  label?: string;
}

export function DatePicker({ date, setDate, label }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-white border-slate-300 text-slate-900 hover:bg-slate-50 shadow-sm",
            !date && "text-slate-500"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-slate-600" />
          {date ? format(date, "PPP") : <span>Seleccionar fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white border border-slate-200 shadow-lg" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => date && setDate(date)}
          initialFocus
          className="bg-white"
        />
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;
