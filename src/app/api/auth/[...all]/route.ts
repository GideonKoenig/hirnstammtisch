import { auth } from "@/server/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const { POST, GET } = toNextJsHandler(auth);
