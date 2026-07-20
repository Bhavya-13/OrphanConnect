import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getOrphanageById,
  getNeedsByOrphanage,
  getVolunteerRequestsByOrphanage,
} from "@/lib/data";
import Badge from "@/components/Badge";
import DonateModal from "./DonateModal";
import VolunteerSignupForm from "@/components/VolunteerSignupForm";

export const dynamic = "force-dynamic";

export default async function OrphanageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const orphanage = await getOrphanageById(id);
  if (!orphanage) {
    notFound();
  }

  const needs = await getNeedsByOrphanage(id);
  const volunteerRequests = await getVolunteerRequestsByOrphanage(id);
  const moneyNeeds = needs.filter((n) => n.type === "money");
  const goodsNeeds = needs.filter((n) => n.type === "goods");

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="relative w-full h-64 rounded-xl overflow-hidden mb-6">
        <Image
          src={orphanage!.imageUrl}
          alt={orphanage!.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold text-gray-800">{orphanage!.name}</h1>
        {orphanage!.verified && <Badge variant="verified">Verified</Badge>}
      </div>
      <p className="text-gray-500 mb-4">
        {orphanage!.location}, {orphanage!.state} &middot; {orphanage!.childrenCount} children
      </p>
      <p className="text-gray-700 mb-8 max-w-3xl">{orphanage!.story}</p>

      <DonateModal moneyNeeds={moneyNeeds as any} goodsNeeds={goodsNeeds as any} />

      {volunteerRequests.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Volunteer Requests</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {volunteerRequests.map((v) => (
              <div key={v.id} className="border border-orange-100 rounded-lg p-4 bg-white">
                <h4 className="font-semibold text-gray-800">{v.task}</h4>
                <p className="text-sm text-gray-600 mb-2">{v.description}</p>
                <p className="text-sm text-gray-700 mb-3">
                  Date: {v.date} &middot; Slots left: {v.slotsAvailable - v.slotsFilled}/{v.slotsAvailable}
                </p>
                <VolunteerSignupForm requestId={v.id} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}