import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export async function GET() {
    const topics = (await db.query.TopicsTable.findMany()).sort((a, b) => b.id - a.id);
    return Response.json({ topics });
}
