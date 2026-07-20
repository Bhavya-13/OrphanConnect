import { VolunteerRequest } from "@/lib/types";

export default function VolunteerRequestCard({
  request,
  orphanageName,
}: {
  request: VolunteerRequest;
  orphanageName?: string;
}) {
  const slotsLeft = request.slotsAvailable - request.slotsFilled;

  return (
    <div className="border border-orange-100 rounded-lg p-4 bg-white">
      <h4 className="font-semibold text-gray-800">{request.task}</h4>
      {orphanageName && <p className="text-sm text-gray-500 mb-1">{orphanageName}</p>}
      <p className="text-sm text-gray-600 mb-2">{request.description}</p>
      <p className="text-sm text-gray-700 mb-1">
        Date: <span className="font-medium">{request.date}</span>
      </p>
      <p className="text-sm text-gray-700">
        Slots left: <span className="font-medium">{slotsLeft}</span> / {request.slotsAvailable}
      </p>
    </div>
  );
}
