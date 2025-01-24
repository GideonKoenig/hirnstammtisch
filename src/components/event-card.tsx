import { formatWeekDistance } from "~/lib/date";
import { cn } from "~/lib/utils";
import { type Event, type User } from "~/lib/data-types";
import Link from "next/link";

export function EventCard(props: {
    event: Event;
    speaker: User | undefined;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "flex flex-col rounded-lg border border-menu-hover bg-menu-light p-2 shadow shadow-menu-dark",
                props.className,
            )}
        >
            <h2 className="pb-1 text-lg font-bold">
                {props.event.description}
            </h2>
            <p className="text-sm">{props.speaker?.name}</p>
            <p className="whitespace-pre text-sm">
                {props.event.eventAt?.toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                })}
                <span className="text-text-muted">
                    {"  "}({formatWeekDistance(props.event.eventAt!)})
                </span>
            </p>
            <Link
                data-hide={!props.event.presentationUrl}
                className="text-sm text-blue-500 underline data-[hide=true]:hidden"
                href={props.event.presentationUrl ?? ""}
                target="_blank"
                rel="noopener noreferrer"
            >
                Presentation
            </Link>
        </div>
    );
}
