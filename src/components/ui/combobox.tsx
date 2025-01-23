"use client";

import { CaretSortIcon } from "@radix-ui/react-icons";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@radix-ui/react-popover";
import { Command, CommandList, CommandGroup, CommandItem } from "cmdk";
import { CheckIcon } from "lucide-react";
import { cn } from "~/components/utils";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { CommandInput } from "~/components/ui/command";

export function ComboBox(props: {
    initialValue: string;
    onChange: (value: string) => void;
    options: string[];
    sortOptions?: boolean;
    className?: string;
}) {
    const [open, setOpen] = useState(false);
    const sortedOptions = props.sortOptions
        ? props.options.sort((a, b) => {
              if (a === "Anyone") return -1;
              if (b === "Anyone") return 1;
              return a.localeCompare(b);
          })
        : props.options;
    const selectedOptions = props.sortOptions ? sortedOptions : props.options;

    return (
        <div className={cn("w-full", props.className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="z-0 w-full justify-between border-menu-hover bg-menu-dark shadow shadow-menu-dark hover:bg-menu-dark hover:text-text-normal focus:bg-menu-dark"
                    >
                        {props.initialValue}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    align="end"
                    className="z-20 mt-2 w-[250px] rounded border border-menu-light bg-menu-dark p-0 shadow-lg shadow-menu-dark"
                >
                    <Command className="w-full">
                        <CommandInput
                            placeholder="Search User..."
                            className="h-9"
                        />
                        <CommandList className="w-full p-2">
                            <CommandGroup className="w-full">
                                {selectedOptions.map((option, index) => (
                                    <CommandItem
                                        className="flex w-full cursor-pointer flex-row items-center justify-between rounded px-3 py-1 hover:bg-menu-hover"
                                        key={index}
                                        value={option}
                                        onSelect={(value) => {
                                            props.onChange(value);
                                            setOpen(false);
                                        }}
                                    >
                                        <p className="flex-grow">{option}</p>
                                        <CheckIcon
                                            data-state={
                                                props.initialValue === option
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
