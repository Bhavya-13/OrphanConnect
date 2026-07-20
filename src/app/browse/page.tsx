import { getAllOrphanages } from "@/lib/data";
import BrowseClient from "./BrowseClient";

export const dynamic = "force-dynamic";

export default async function BrowsePage() {
  const orphanages = await getAllOrphanages();
  const states = Array.from(new Set(orphanages.map((o) => o.state)));

  return <BrowseClient orphanages={orphanages} states={states} />;
}