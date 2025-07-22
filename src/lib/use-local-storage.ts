"use client";

import { useEffect, useState } from "react";
import { tryCatch } from "@/lib/try-catch";

export function useLocalStorage<T>(key: string, defaultValue: T) {
    const [value, setValue] = useState<T>(defaultValue);
    const [isLoading, setIsLoading] = useState(true);

    const updateValue = (newValue: T) => {
        tryCatch(() => localStorage.setItem(key, JSON.stringify(newValue)))
            .onError((error) => {
                console.error(`Failed to save ${key} to localStorage:`, error);
            })
            .onSuccess(() => {
                setValue(newValue);
            })
            .execute();
    };

    useEffect(() => {
        const stored = tryCatch(() => localStorage.getItem(key)).unwrap({
            defaultValue: null,
        });

        if (stored) {
            const parseResult = tryCatch(() => JSON.parse(stored) as T)
                .onSuccess((data) => {
                    setValue(data);
                })
                .onError((error) => {
                    console.warn(
                        `Failed to parse ${key} from localStorage:`,
                        error,
                    );
                    localStorage.setItem(key, JSON.stringify(defaultValue));
                    setValue(defaultValue);
                })
                .execute();
        } else {
            localStorage.setItem(key, JSON.stringify(defaultValue));
            setValue(defaultValue);
        }

        setIsLoading(false);
    }, [key, defaultValue]);

    return { value, setValue: updateValue, isLoading };
}
