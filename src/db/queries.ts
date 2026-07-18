import { db } from "./index.ts";
import { projects } from "./schema.ts";

const defaultProjects = [
  {
    id: "proj-default-1",
    title: "Preparation of a Model of Pile Foundation",
    subtitle: "Physical Maquette",
    category: "physical",
    scale: "1:20",
    description: "This project is a physical model of a pile foundation system. The model demonstrates how a pile cap transfers structural loads into the underlying soil through friction and end-bearing piles. It features realistic concrete texture, reinforcement detail visualization, and labeled soil layers for educational display.",
    method: "Hand crafting, 3D printing, acrylic laser cutting",
    material: "Cast plaster, acrylic sheet, steel wires, modeling sand",
    outcome: "A high-fidelity physical model used as an educational display in the civil engineering lab.",
    image: null,
    glb: null
  },
  {
    id: "proj-default-2",
    title: "Typical 2-Bedroom Residential Floor Plan",
    subtitle: "Architectural Drafting",
    category: "autocad",
    scale: "1:50",
    description: "A comprehensive 2D CAD architectural plan of a modern two-bedroom residential apartment. The drafting features detailed dimension lines, wall layers, door and window schedules, furniture placement layout, and electrical symbol mappings following standard engineering conventions.",
    method: "2D drafting, layer mapping, layout scaling",
    material: "Digital CAD File, Plotter Sheet",
    outcome: "A submission-ready architectural blueprint compliant with municipal building code requirements.",
    image: null,
    glb: null
  }
];

export async function getProjects() {
  try {
    let results = await db.select().from(projects);
    if (results.length === 0) {
      console.log("Database is empty. Seeding default engineering projects...");
      for (const proj of defaultProjects) {
        await db.insert(projects).values(proj).onConflictDoNothing();
      }
      results = await db.select().from(projects);
    }
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
