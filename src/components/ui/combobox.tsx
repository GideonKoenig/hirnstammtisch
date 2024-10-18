"use client";

import { CaretSortIcon } from "@radix-ui/react-icons";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Command, CommandList, CommandGroup, CommandItem } from "cmdk";
import { CheckIcon } from "lucide-react";
import { cn } from "~/components/utils";
import { type Dispatch, type SetStateAction, useState } from "react";
import { Button } from "~/components/ui/button";
import { CommandInput } from "~/components/ui/command";

export function ComboBox(props: {
    state: string;
    setState: Dispatch<SetStateAction<string>> | ((value: string) => void);
    options: string[];
    className?: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className={cn("w-full", props.className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="z-0 w-full justify-between border-menu-hover bg-menu-dark shadow shadow-menu-dark hover:bg-menu-hover hover:text-text-normal focus:bg-menu-hover"
                    >
                        {props.state}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    align="end"
                    className="z-20 mt-2 w-[250px] rounded border border-menu-light bg-menu-dark p-0 shadow-lg shadow-menu-dark"
                >
                    <Command className="w-full">
                        <CommandInput placeholder="Search User..." className="h-9" />
                        <CommandList className="w-full p-2">
                            <CommandGroup className="w-full">
                                {props.options.map((option, index) => (
                                    <CommandItem
                                        className="flex w-full cursor-pointer flex-row items-center justify-between rounded px-3 py-1 hover:bg-menu-hover"
                                        key={index}
                                        value={option}
                                        onSelect={(value) => {
                                            props.setState(value);
                                            setOpen(false);
                                        }}
                                    >
                                        <p className="flex-grow">{option}</p>
                                        <CheckIcon
                                            data-state={props.state === option ? "show" : "hide"}
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
