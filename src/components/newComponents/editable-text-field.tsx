"use client";

import { PencilIcon } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import { cn } from "~/components/utils";

export default function EditableTextField(props: {
    value: string;
    onChange: (newValue: string) => void | Promise<void>;
    className?: string;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(props.value);
    const ref = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async () => {
        await props.onChange(currentValue);
        setIsEditing(false);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            void handleSubmit();
        } else if (event.key === "Escape") {
            setCurrentValue(props.value);
            setIsEditing(false);
        }
    };

    const startEditing = () => {
        setIsEditing(true);
        requestAnimationFrame(() => {
            const input = ref.current;
            if (input) input?.select();
        });
    };

    return (
        <div
            className={cn(
                "group relative flex flex-row overflow-hidden",
                props.className,
            )}
        >
            <p
                data-editing={isEditing}
                className="max-w-full whitespace-pre-wrap break-words rounded border border-transparent p-1 text-base data-[editing=true]:border-menu-hover"
                onMouseDown={startEditing}
            >
                {currentValue}
            </p>
            <textarea
                ref={ref}
                data-editing={isEditing}
                autoFocus={isEditing}
                value={currentValue}
                onChange={(event) => setCurrentValue(event.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => void handleSubmit()}
                className="absolute left-0 top-0 z-10 hidden h-full w-full resize-none overflow-hidden whitespace-pre-wrap break-words border border-transparent bg-transparent p-1 text-base text-transparent caret-text-normal focus-visible:outline-none data-[editing=true]:block"
            />

            <button
                onMouseDown={startEditing}
                data-editing={isEditing}
                className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 data-[editing=true]:hidden"
                aria-label="Edit text"
            >
                <PencilIcon className="h-4 w-4 stroke-text-muted" />
            </button>
        </div>
    );
}
