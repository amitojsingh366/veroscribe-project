import { db } from "./client";
import { seedDemoData } from "./seed";
import { physicians } from "./schema";

async function main() {
  const [existingPhysician] = await db
    .select({ id: physicians.id })
    .from(physicians)
    .limit(1);

  if (existingPhysician) {
    console.log("Demo data already exists; skipping seed");
    return;
  }

  await seedDemoData();
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
