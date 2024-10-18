import { sql } from "drizzle-orm";
import { boolean, index, pgTableCreator, serial, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `hirnstammtisch_${name}`);

export const TopicsTable = createTable(
    "topics",
    {
        id: serial("id").primaryKey(),
        description: varchar("description").notNull(),
        suggestedBy: varchar("suggested_by", { length: 256 }).notNull(),
        speaker: varchar("speaker", { length: 256 }).notNull(),
        deleted: boolean("deleted").notNull(),
        eventAt: timestamp("event_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (topic) => ({
        idIndex: index("topics_idx").on(topic.id),
    }),
);

export const UserTable = createTable(
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
