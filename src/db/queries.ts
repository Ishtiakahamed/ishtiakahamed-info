import { eq } from "drizzle-orm";
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
  },
  {
    id: "proj-default-3",
    title: "Structural Column & Beam Junction Model",
    subtitle: "Reinforced Concrete Detailing",
    category: "physical",
    scale: "1:10",
    description: "A scaled physical structural model illustrating shear reinforcement stirrups, rebar lap splices, and beam-column joint anchoring according to ACI/BNBC structural guidelines.",
    method: "Rebar bending, transparent resin casing, wire tying",
    material: "Miniature steel rebar, clear epoxy resin, plywood base",
    outcome: "Clear 3D visual representation of structural joint rebar congestion and concrete anchorage.",
    image: null,
    glb: null
  },
  {
    id: "proj-default-4",
    title: "Multi-Story Building Cross-Section & Elevation",
    subtitle: "CAD Structural Detailing",
    category: "autocad",
    scale: "1:100",
    description: "2D AutoCAD cross-sectional elevation drawing detailing floor slab thickness, beam dimensions, footing depth, staircase flights, and structural grid lines for a 5-story building.",
    method: "AutoCAD 2D, block attribution, dynamic dimensioning",
    material: "DWG Format, PDF Vector Export",
    outcome: "Complete set of structural working drawings for construction execution.",
    image: null,
    glb: null
  },
  {
    id: "proj-default-5",
    title: "Pratt Truss Bridge Scale Model",
    subtitle: "Structural Engineering Maquette",
    category: "physical",
    scale: "1:50",
    description: "A precision-engineered Pratt truss bridge model tested for load distribution. Demonstrates tension and compression member performance under vertical point loads.",
    method: "Laser cutting, gusset plate riveting, deflection testing",
    material: "Balsa wood, acrylic gusset plates, steel micro-bolts",
    outcome: "High strength-to-weight ratio structural prototype verified with physical load testing.",
    image: null,
    glb: null
  },
  {
    id: "proj-default-6",
    title: "3D Mechanical & Plumbing Isometric Piping Plan",
    subtitle: "AutoCAD 3D & Isometric",
    category: "autocad",
    scale: "1:25",
    description: "Isometric 3D CAD drawing showing water supply, drainage piping routes, valve placement, and pipe invert levels for a commercial building project.",
    method: "Isometric CAD drafting, 3D pipe routing, layer color coding",
    material: "Digital DWG File, Isometric Layout",
    outcome: "Clash-free MEP coordination drawing for plumbing technicians.",
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

export async function deleteProject(id: string) {
  try {
    const [deleted] = await db.delete(projects).where(eq(projects.id, id)).returning();
    return deleted;
  } catch (error) {
    console.error("Database delete failed inside deleteProject:", error);
    throw new Error("Failed to delete project. Please try again later.", { cause: error });
  }
}

