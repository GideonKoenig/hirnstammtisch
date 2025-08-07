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
        "rounded-lg border border-border/60 bg-card/95 text-text shadow-2xl backdrop-blur-md p-0 overflow-hidden",
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
