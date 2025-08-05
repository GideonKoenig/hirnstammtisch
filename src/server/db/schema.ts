import { sql } from "drizzle-orm";
import {
    boolean,
    index,
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
} from "drizzle-orm/pg-core";
import { user } from "@/server/db/auth-schema";
export * from "@/server/db/auth-schema";

export const visibilityEnum = pgEnum("visibility", ["everyone", "members"]);

export const assetTypeEnum = pgEnum("asset_type", [
    "recording",
    "profile-image",
]);

export const event = pgTable(
    "event",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        title: text("title").notNull(),
        speaker: text("speaker")
            .notNull()
            .references(() => user.id),
        recording: text("recording").references(() => asset.id),
        slidesUrl: text("slides_url"),
        deleted: boolean("deleted").notNull().default(false),
        maxAttendees: integer("max_attendees"),
        date: timestamp("date", { withTimezone: true }),
        speakerNotes: text("speaker_notes"),
        createdAt: timestamp("created_at", { withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (event) => [index("events_idx").on(event.id)],
);

export const eventAttendee = pgTable(
    "event_attendee",
    {
        eventId: text("event_id").references(() => event.id),
        userId: text("user_id").references(() => user.id),
        createdAt: timestamp("created_at", { withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (eventAttendee) => [
        index("event_attendee_idx").on(
            eventAttendee.eventId,
            eventAttendee.userId,
        ),
    ],
);

export const asset = pgTable("asset", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    type: assetTypeEnum("type").notNull(),
    uploadthingId: text("uploadthing_id").notNull(),
    url: text("url").notNull(),
    uploadedBy: text("uploaded_by").references(() => user.id),
    createdAt: timestamp("created_at", { withTimezone: true })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});

export const preference = pgTable(
    "preference",
    {
        userId: text("user_id")
            .notNull()
            .references(() => user.id),
        slidesVisibility: visibilityEnum("slides_visibility").notNull(),
    },
    (preference) => [index("preference_idx").on(preference.userId)],
);
