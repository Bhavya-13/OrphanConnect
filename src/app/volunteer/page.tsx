import { getAllVolunteerRequests, getOrphanageById } from "@/lib/data";
import VolunteerBrowser from "./VolunteerBrowser";

export const dynamic = "force-dynamic";

export default async function VolunteerPage() {
  const requests = await getAllVolunteerRequests();

  const withNames = await Promise.all(
    requests.map(async (r) => {
      const orphanage = await getOrphanageById(r.orphanageId);
      return {
        id: r.id,
        task: r.task,
        description: r.description,
        date: r.date,
        slotsAvailable: r.slotsAvailable,
        slotsFilled: r.slotsFilled,
        orphanageName: orphanage?.name ?? "",
      };
    })
  );

  return <VolunteerBrowser requests={withNames} />;
}