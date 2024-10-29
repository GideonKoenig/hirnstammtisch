import { readCookie } from "~/server/utils";
import EditableTextFieldClient from "./editable-text-field-client";
import { type ReactNode } from "react";

export default function EditableTextField(props: {
    className?: string;
    initialContent?: string;
    cookieName?: string;
    callback: (oldValue: string, newValue: string) => Promise<void>;
    fallback?: ReactNode;
}) {
    const initialValue =
        props.initialContent ??
        (props.cookieName ? readCookie(props.cookieName) : undefined);

    return (
        <EditableTextFieldClient
            className={props.className}
            initialContent={initialValue}
            cookieName={props.cookieName}
            callback={props.callback}
            fallback={props.fallback}
        />
    );
}
