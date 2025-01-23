import { type Topic } from "~/components/topics/types";
import { formatWeekDistance } from "~/utils/date";
import { type User } from "~/components/newComponents/data-types";
import { cn } from "~/components/utils";

export default function EventCard(props: {
    event: Topic;
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
            <a
                data-hide={!props.event.presentationUrl}
                className="text-sm text-blue-500 underline data-[hide=true]:hidden"
                href={props.event.presentationUrl ?? ""}
            >
                Presentation
            </a>
        </div>
    );
}
