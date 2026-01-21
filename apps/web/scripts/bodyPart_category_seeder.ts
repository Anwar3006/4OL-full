import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
import slugify from "slugify";
import { BODY_PARTS, CONDITION_CATEGORIES } from "./condition.const";
import { supabase } from "@/lib/supabase";

// Helper to sanitize ltree paths (No spaces, only alphanumeric and underscores)
const toPath = (text: string) => text.replace(/[^a-zA-Z0-9]/g, "");

async function seed() {
  console.log("🧼 Wiping existing anatomical and category data...");
  // await db.delete(bodyParts);
  // await db.delete(categories);

  // --- 1. DATA STRUCTURE: ANATOMY (System -> Region -> Organ -> Sub-part) ---
  const anatomySeed = BODY_PARTS;
  // --- 2. DATA STRUCTURE: NHS CATEGORIES ---
  const categorySeed = CONDITION_CATEGORIES;

  // --- 3. RECURSIVE SEEDING FUNCTIONS ---

  async function seedBodyParts(
    items: any[],
    parentId: string | null = null,
    parentPath: string = "",
    level: number = 0,
  ) {
    for (const item of items) {
      const currentPath = parentPath
        ? `${parentPath}.${toPath(item.name)}`
        : toPath(item.name);

      const { data: inserted, error } = await supabase
        .from("body_parts")
        .insert({
          name: item.name,
          parent_id: parentId,
          path: currentPath,
          level,
          mesh_id: item.meshId || null,
        })
        .select("id")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (item.children) {
        await seedBodyParts(
          item.children,
          inserted?.id,
          currentPath,
          level + 1,
        );
      }
    }
  }

  async function seedCategories(
    items: any[],
    parentId: string | null = null,
    parentPath: string = "",
    level: number = 0,
  ) {
    for (const item of items) {
      const currentPath = parentPath
        ? `${parentPath}.${toPath(item.name)}`
        : toPath(item.name);

      const { data: inserted, error } = await supabase
        .from("categories")
        .insert({
          name: item.name,
          slug: slugify(item.name, { lower: true }),
          description: item.description,
          parent_id: parentId,
          path: currentPath,
          level,
        })
        .select("id")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (item.children) {
        await seedCategories(
          item.children,
          inserted.id,
          currentPath,
          level + 1,
        );
      }
    }
  }

  console.log("🦴 Seeding Anatomy Hierarchy...");
  await seedBodyParts(anatomySeed);

  console.log("📁 Seeding NHS Categories Hierarchy...");
  await seedCategories(categorySeed);

  console.log("✅ Database successfully seeded!");
}

seed().catch((e) => {
  console.error("❌ Seeding failed");
  console.error(e);
  process.exit(1);
});
