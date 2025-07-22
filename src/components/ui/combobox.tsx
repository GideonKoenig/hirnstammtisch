"use client";

import { CaretSortIcon } from "@radix-ui/react-icons";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@radix-ui/react-popover";
import { Command, CommandList, CommandGroup, CommandItem } from "cmdk";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CommandInput } from "@/components/ui/command";

type Option = {
    value: string;
    displayValue: string;
};

export function ComboBox(props: {
    value: string;
    onValueChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    className?: string;
}) {
    const [open, setOpen] = useState(false);

    const selectedOption = props.options.find(
        (option) => option.value === props.value,
    );
    const displayValue =
        selectedOption?.displayValue ?? props.placeholder ?? "Select option...";
    const isPlaceholder = !selectedOption;

    return (
        <div className={cn("w-full", props.className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="border-border bg-bg hover:bg-bg-muted w-full justify-between text-sm"
                    >
                        <span
                            className={
                                isPlaceholder ? "text-text-muted" : "text-text"
                            }
                        >
                            {displayValue}
                        </span>
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    align="end"
                    className="border-border bg-bg z-[100] mt-2 w-[calc(var(--radix-popover-trigger-width)+2px)] rounded border p-0 shadow-lg"
                >
                    <Command className="w-full">
                        <CommandInput
                            placeholder={props.placeholder ?? "Search..."}
                            className="h-9"
                        />
                        <CommandList className="w-full p-2">
                            <CommandGroup className="w-full">
                                {props.options.map((option) => (
                                    <CommandItem
                                        className="hover:bg-bg-muted flex w-full cursor-pointer flex-row items-center justify-between rounded px-3 py-1"
                                        key={option.value}
                                        value={option.displayValue}
                                        onSelect={() => {
                                            if (props.value === option.value) {
                                                props.onValueChange("");
                                            } else {
                                                props.onValueChange(
                                                    option.value,
                                                );
                                            }
                                            setOpen(false);
                                        }}
                                    >
                                        <p className="grow">
                                            {option.displayValue}
                                        </p>
                                        <CheckIcon
                                            data-state={
                                                props.value === option.value
                                                    ? "show"
                                                    : "hide"
                                            }
                                            className="ml-auto h-4 w-4 data-[state=hide]:opacity-0"
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
