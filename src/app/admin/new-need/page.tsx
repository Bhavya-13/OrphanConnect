import AdminGuard from "@/components/AdminGuard";
import { getAllOrphanages } from "@/lib/data";
import NewNeedClient from "./NewNeedClient";

export const dynamic = "force-dynamic";

export default async function NewNeedPage() {
  const orphanages = await getAllOrphanages();
  return (
    <AdminGuard>
      <NewNeedClient orphanages={orphanages} />
    </AdminGuard>
  );
}