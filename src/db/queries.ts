import { db } from "./index.ts";
import { projects } from "./schema.ts";

export async function getProjects() {
  try {
    const results = await db.select().from(projects);
    return results;
  } catch (error) {
    console.error("Database query failed inside getProjects:", error);
    throw new Error("Database query failed. Please try again later.", { cause: error });
  }
}

export interface NewProjectInput {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  scale: string;
  description: string;
  method?: string;
  material?: string;
  outcome?: string;
  image?: string | null;
  glb?: string | null;
}

export async function createProject(input: NewProjectInput) {
  try {
    const [inserted] = await db.insert(projects).values({
      id: input.id,
      title: input.title,
      subtitle: input.subtitle,
      category: input.category,
      scale: input.scale,
      description: input.description,
      method: input.method || "",
      material: input.material || "",
      outcome: input.outcome || "",
      image: input.image || null,
      glb: input.glb || null,
    }).returning();
    return inserted;
  } catch (error) {
    console.error("Database insert failed inside createProject:", error);
    throw new Error("Failed to save project. Please try again later.", { cause: error });
  }
}
