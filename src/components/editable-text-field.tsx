"use client";

import { PencilIcon } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import { usePwa } from "~/components/provider-pwa";
import { cn } from "~/lib/utils";

export default function EditableTextField(props: {
    value: string | undefined | null;
    onChange: (newValue: string) => void | Promise<void>;
    size?: "xs" | "sm" | "base";
    placeholder?: string;
    hideButton?: boolean;
    className?: string;
}) {
    const { isOffline } = usePwa();
    const [isEditing, setIsEditing] = useState(false);
    const calculatedValue =
        (props.value?.trim() === "" ? undefined : props.value?.trim()) ??
        props.placeholder ??
        "";
    const placeholderUsed =
        (!props.value || props.value.trim() === "") && !!props.placeholder;
    const [currentValue, setCurrentValue] = useState(calculatedValue);
    const ref = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async () => {
        if (currentValue !== props.placeholder) {
            await props.onChange(currentValue);
        }
        if (currentValue.trim() === "") {
            setCurrentValue(props.placeholder ?? "");
        }
        setIsEditing(false);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            void handleSubmit();
        } else if (event.key === "Escape") {
            setCurrentValue(calculatedValue);
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
                data-offline={isOffline}
                data-editing={isEditing}
                data-placeholder={placeholderUsed}
                data-size={props.size}
                className="data-[editing=true]:border-menu-hover data-[placeholder=true]:text-text-muted max-w-full rounded border border-transparent p-1 text-base break-words whitespace-pre-wrap data-[offline=true]:cursor-not-allowed data-[size=sm]:text-sm data-[size=xs]:text-xs"
                onMouseDown={() => {
                    if (!isOffline) startEditing();
                }}
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
                data-placeholder={placeholderUsed}
                data-size={props.size}
                className="caret-text-normal absolute top-0 left-0 z-10 hidden h-full w-full resize-none overflow-hidden border border-transparent bg-transparent p-1 text-base break-words whitespace-pre-wrap text-transparent focus-visible:outline-hidden data-[editing=true]:block data-[size=sm]:text-sm data-[size=xs]:text-xs"
            />

            {!props.hideButton && (
                <button
                    disabled={isOffline}
                    onMouseDown={startEditing}
                    data-editing={isEditing}
                    className="absolute top-2 right-1 opacity-0 transition-opacity group-hover:opacity-100 disabled:cursor-not-allowed group-hover:disabled:opacity-50 data-[editing=true]:hidden"
                    aria-label="Edit text"
                >
                    <PencilIcon className="stroke-text-muted h-4 w-4" />
                </button>
            )}
        </div>
    );
}
