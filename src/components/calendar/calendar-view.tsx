"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { api } from "@/trpc/react";
import { DayEventsList } from "@/components/calendar/day-events-list";
import { cn } from "@/lib/utils";
import { dateOnly } from "@/lib/date";

export function CalendarView() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date(),
    );

    const { data: events = [] } = api.event.getAll.useQuery();

    const eventDates = events
        .filter((event) => event.date)
        .map((event) => dateOnly(event.date ?? undefined));

    const eventsForSelectedDate = events.filter((event) => {
        if (!event.date || !selectedDate) return false;
        const eventDate = dateOnly(event.date ?? undefined);
        const selectedDateOnly = dateOnly(selectedDate);
        return eventDate?.toDateString() === selectedDateOnly?.toDateString();
    });

    return (
        <div className="flex flex-col gap-6 xl:flex-row xl:gap-8">
            <div className="flex flex-shrink-0 justify-center xl:justify-start">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className={cn(
                        "border-border bg-bg mx-auto rounded-md border shadow-sm xl:mx-0",
                    )}
                    modifiers={{
                        hasEvent: eventDates.filter(Boolean) as Date[],
                    }}
                    modifiersClassNames={{
                        hasEvent:
                            "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-accent after:rounded-full",
                    }}
                />
            </div>

            <div className="min-w-0 flex-1">
                <DayEventsList
                    date={selectedDate}
                    events={eventsForSelectedDate}
                />
            </div>
        </div>
    );
}
