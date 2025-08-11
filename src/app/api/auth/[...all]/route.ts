import { auth } from "@/server/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

async function logAuthRequest(request: Request) {
    const requestClone = request.clone();
    let body: unknown = null;
    try {
        const text = await requestClone.text();
        if (text) {
            const contentType = request.headers.get("content-type") ?? "";
            if (contentType.includes("application/json")) {
                try {
                    body = JSON.parse(text);
                } catch {
                    body = text;
                }
            } else {
                body = text;
            }
        }
    } catch {
        body = "[unavailable]";
    }

    const headers = Object.fromEntries(request.headers.entries()) as Record<
        string,
        string
    >;

    console.log("[AUTH API]", {
        method: request.method,
        url: request.url,
        headers,
        body,
    });
}

export async function GET(request: Request) {
    await logAuthRequest(request);
    return handler.GET(request);
}

export async function POST(request: Request) {
    await logAuthRequest(request);
    return handler.POST(request);
}
