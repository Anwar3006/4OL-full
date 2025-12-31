import { db } from "@4ol/db";
import { bodyParts, categories } from "@4ol/db/models/conditions.model";
import { sql } from "drizzle-orm";
import slugify from "slugify";

// Helper to sanitize ltree paths (No spaces, only alphanumeric and underscores)
const toPath = (text: string) => text.replace(/[^a-zA-Z0-9]/g, "");

async function seed() {
  console.log("🧼 Wiping existing anatomical and category data...");
  await db.delete(bodyParts);
  await db.delete(categories);

  // --- 1. DATA STRUCTURE: ANATOMY (System -> Region -> Organ -> Sub-part) ---
  const anatomySeed = [
    {
      name: "Musculoskeletal System",
      meshId: "sys_musculo",
      children: [
        {
          name: "Upper Limbs",
          meshId: "reg_upper_limb",
          children: [
            {
              name: "Hand",
              meshId: "organ_hand",
              children: [{ name: "Phalanges" }, { name: "Metacarpals" }],
            },
          ],
        },
      ],
    },
    {
      name: "Nervous System",
      meshId: "sys_nervous",
      children: [
        {
          name: "Head",
          meshId: "reg_head",
          children: [
            {
              name: "Brain",
              meshId: "organ_brain",
              children: [{ name: "Frontal Lobe" }, { name: "Cerebellum" }],
            },
          ],
        },
      ],
    },
  ];

  // --- 2. DATA STRUCTURE: NHS CATEGORIES ---
  const categorySeed = [
    {
      name: "Reproductive Health",
      children: [
        {
          name: "Pregnancy and childbirth",
          children: [
            { name: "Antenatal care" },
            { name: "Complications in pregnancy" },
          ],
        },
      ],
    },
    {
      name: "Infections and poisoning",
      children: [
        {
          name: "Infectious diseases",
          children: [
            { name: "Bacterial infections" },
            { name: "Viral infections" },
          ],
        },
      ],
    },
  ];

  // --- 3. RECURSIVE SEEDING FUNCTIONS ---

  async function seedBodyParts(
    items: any[],
    parentId: string | null = null,
    parentPath: string = "",
    level: number = 0
  ) {
    for (const item of items) {
      const currentPath = parentPath
        ? `${parentPath}.${toPath(item.name)}`
        : toPath(item.name);

      const [inserted] = await db
        .insert(bodyParts)
        .values({
          name: item.name,
          parentId,
          path: currentPath,
          level,
          meshId: item.meshId || null,
        })
        .returning();

      if (item.children) {
        await seedBodyParts(item.children, inserted.id, currentPath, level + 1);
      }
    }
  }

  async function seedCategories(
    items: any[],
    parentId: string | null = null,
    parentPath: string = "",
    level: number = 0
  ) {
    for (const item of items) {
      const currentPath = parentPath
        ? `${parentPath}.${toPath(item.name)}`
        : toPath(item.name);

      const [inserted] = await db
        .insert(categories)
        .values({
          name: item.name,
          slug: slugify(item.name, { lower: true }),
          parentId,
          path: currentPath,
          level,
        })
        .returning();

      if (item.children) {
        await seedCategories(
          item.children,
          inserted.id,
          currentPath,
          level + 1
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
