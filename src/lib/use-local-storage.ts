"use client";

import { useEffect, useState } from "react";
import { tryCatch } from "@/lib/try-catch";

export function useLocalStorage<T>(key: string, defaultValue: T) {
    const [value, setValue] = useState<T>(defaultValue);
    const [isLoading, setIsLoading] = useState(true);

    const updateValue = (newValue: T) => {
        const result = tryCatch(() =>
            localStorage.setItem(key, JSON.stringify(newValue)),
        );
        if (!result.success) {
            console.error(
                `Failed to save ${key} to localStorage:`,
                result.error,
            );
            return;
        }
        setValue(newValue);
    };

    useEffect(() => {
        const stored = tryCatch(() => localStorage.getItem(key)).unwrapOr(null);

        if (stored) {
            const parseResult = tryCatch(() => JSON.parse(stored) as T);

            if (!parseResult.success) {
                console.warn(
                    `Failed to parse ${key} from localStorage:`,
                    parseResult.error,
                );
                localStorage.setItem(key, JSON.stringify(defaultValue));
                setValue(defaultValue);
            } else {
                setValue(parseResult.data);
            }
        } else {
            localStorage.setItem(key, JSON.stringify(defaultValue));
            setValue(defaultValue);
        }

        setIsLoading(false);
    }, [key, defaultValue]);

    return { value, setValue: updateValue, isLoading };
}
