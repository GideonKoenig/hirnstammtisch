"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Edit2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function InputText(props: {
    value: string;
    onSave: (value: string) => Promise<void> | void;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    disabled?: boolean;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(props.value);

    useEffect(() => {
        setTempValue(props.value);
    }, [props.value]);

    const handleSave = async () => {
        if (tempValue.trim() === "" || tempValue === props.value) {
            setTempValue(props.value);
            setIsEditing(false);
            return;
        }
        await props.onSave(tempValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempValue(props.value);
        setIsEditing(false);
    };

    return (
        <div
            className={cn(
                "flex min-h-[2.5rem] items-center gap-2",
                props.className,
            )}
        >
            {isEditing ? (
                <>
                    <Input
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className={cn(
                            "bg-bg border-border text-text h-9 flex-1 text-sm",
                            props.inputClassName,
                        )}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave();
                            if (e.key === "Escape") handleCancel();
                        }}
                        placeholder={props.placeholder}
                        autoFocus
                        disabled={props.disabled}
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSave}
                        className="text-success hover:bg-success/20 h-8 w-8"
                        disabled={props.disabled}
                    >
                        <Check className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancel}
                        className="text-error hover:bg-error/20 h-8 w-8"
                        disabled={props.disabled}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </>
            ) : (
                <>
                    <span className="text-text grow py-2 text-sm">
                        {props.value ?? props.placeholder}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditing(true)}
                        className="text-text-muted hover:bg-border h-8 w-8"
                        disabled={props.disabled}
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>
                </>
            )}
        </div>
    );
}
