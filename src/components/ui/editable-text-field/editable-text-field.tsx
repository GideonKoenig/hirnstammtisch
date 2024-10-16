import { readCookie } from "~/server/utils";
import EditableTextFieldClient from "./editable-text-field-client";

export default function EditableTextField(props: { cookieName: string }) {
    const content = readCookie(props.cookieName);
    return <EditableTextFieldClient content={content} cookieName={props.cookieName} />;
}
