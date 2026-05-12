import { ChoosePhysicianHero } from "@/components/booking/ChoosePhysicianHero";
import { PhysicianDirectory } from "@/components/booking/PhysicianDirectory";
import { getPhysicians } from "@/lib/api";

export default async function BookPage() {
  const physicians = await getPhysicians();

  return (
    <main className="gradient-bg min-h-[calc(100vh-65px)]">
      <section className="mx-auto max-w-7xl px-5 pb-10 md:px-10">
        <ChoosePhysicianHero />
        <PhysicianDirectory physicians={physicians} />
      </section>
    </main>
  );
}
