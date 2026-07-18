import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  category: text("category").notNull(),
  scale: text("scale").notNull(),
  description: text("description").notNull(),
  method: text("method"),
  material: text("material"),
  outcome: text("outcome"),
  image: text("image"), // For base64 image data
  glb: text("glb"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
