import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function ResponsiveTooltip(props: {
    children: React.ReactNode;
    content: React.ReactNode;
    className?: string;
}) {
    const tooltipClasses = cn(
        "w-80 rounded-xl shadow-2xl p-0 bg-border overflow-hidden",
        props.className,
    );

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <div className="lg:hidden">{props.children}</div>
                </PopoverTrigger>
                <PopoverContent
                    side="bottom"
                    align="center"
                    className={tooltipClasses}
                >
                    {props.content}
                </PopoverContent>
            </Popover>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="hidden lg:block">{props.children}</div>
                    </TooltipTrigger>
                    <TooltipContent
                        side="bottom"
                        align="center"
                        className={tooltipClasses}
                    >
                        {props.content}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </>
    );
}
