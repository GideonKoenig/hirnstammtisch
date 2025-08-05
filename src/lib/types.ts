import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type asset, event, user, type preference } from "@/server/db/schema";
import { type RedactedField } from "@/lib/permissions/types";

export const EventSchema = createSelectSchema(event);
export const EventInsertSchema = createInsertSchema(event);

export const UserSchema = createSelectSchema(user);
export const UserInsertSchema = createInsertSchema(user);

export type Event = typeof event.$inferSelect;
export type EventInsert = typeof event.$inferInsert;
export type Asset = typeof asset.$inferSelect;
export type AssetInsert = typeof asset.$inferInsert;
export type Preference = typeof preference.$inferSelect;

export type ClientEvent = Omit<Event, "slidesUrl" | "recording"> & {
    slidesUrl: RedactedField<string | null>;
    recording: RedactedField<string | null>;
};

export type ClientUser = Omit<typeof user.$inferSelect, "updatedAt"> & {
    updatedAt: Date;
};
