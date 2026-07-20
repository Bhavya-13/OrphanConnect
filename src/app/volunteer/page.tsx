import { getAllVolunteerRequests, getOrphanageById } from "@/lib/data";
import VolunteerRequestCard from "@/components/VolunteerRequestCard";

export default function VolunteerPage() {
  const requests = getAllVolunteerRequests();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Volunteer Opportunities</h1>
      <p className="text-gray-500 mb-6">
        Orphanages across the network are looking for help. Pick a task that fits your time and skills.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {requests.map((r) => {
          const orphanage = getOrphanageById(r.orphanageId);
          return (
            <VolunteerRequestCard key={r.id} request={r} orphanageName={orphanage?.name} />
          );
        })}
      </div>

      {requests.length === 0 && (
        <p className="text-gray-500">No volunteer requests at the moment.</p>
      )}
    </div>
  );
}
