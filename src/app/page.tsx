import { getAllVolunteerRequests, getOrphanageById } from "@/lib/data";
import VolunteerRequestCard from "@/components/VolunteerRequestCard";

export const dynamic = "force-dynamic";

export default async function VolunteerPage() {
  const requests = await getAllVolunteerRequests();

  const withNames = await Promise.all(
    requests.map(async (r) => {
      const orphanage = await getOrphanageById(r.orphanageId);
      return { request: r, orphanageName: orphanage?.name };
    })
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Volunteer Opportunities</h1>
      <p className="text-gray-500 mb-6">
        Orphanages across the network are looking for help. Pick a task that fits your time and skills.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {withNames.map(({ request, orphanageName }) => (
          <VolunteerRequestCard
            key={request.id}
            request={request}
            orphanageName={orphanageName}
          />
        ))}
      </div>

      {withNames.length === 0 && (
        <p className="text-gray-500">No volunteer requests at the moment.</p>
      )}
    </div>
  );
}