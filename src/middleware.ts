import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

export function middleware(request: NextRequest) {
    const publicPaths = ["/login", "/favicon.ico", "/_next/", "/static/"];

    if (publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
        return NextResponse.next();
    }

    const cookieStore = cookies();
    const username = cookieStore.get("username");
    if (username?.value) {
        return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
    matcher: "/:path*",
};
