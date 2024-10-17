import { sql } from "drizzle-orm";
import { index, pgTableCreator, serial, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `hirnstammtisch_${name}`);

export type TopicStatus = "open" | "used" | "deleted";

export const topics = createTable(
    "topics",
    {
        id: serial("id").primaryKey(),
        description: varchar("description").notNull(),
        from: varchar("from", { length: 256 }).notNull(),
        for: varchar("for", { length: 256 }),
        status: varchar("status", { length: 256 }).default("open").notNull(),
        usedAt: timestamp("used_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (topic) => ({
        idIndex: index("topics_idx").on(topic.id),
    }),
);

export const user = createTable(
    "user",
    {
        id: serial("id").primaryKey(),
        name: varchar("name", { length: 256 }).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (user) => ({
        idIndex: index("user_idx").on(user.id),
    }),
);
