import { sql } from "drizzle-orm";
import { index, pgTableCreator, serial, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `hirnstammtisch_${name}`);

export const topics = createTable(
    "topics",
    {
        id: serial("id").primaryKey(),
        prompt: varchar("prompt"),
        from: varchar("from", { length: 256 }),
        for: varchar("for", { length: 256 }),
        createdAt: timestamp("created_at", { withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (example) => ({
        nameIndex: index("id_idx").on(example.id),
    }),
);
