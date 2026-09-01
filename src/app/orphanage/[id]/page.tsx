import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getOrphanageById,
  getNeedsByOrphanage,
  getVolunteerRequestsByOrphanage,
} from "@/lib/data";
import Badge from "@/components/Badge";
import DonateModal from "./DonateModal";
import Link from "next/link";
import { formatDate } from "@/lib/formatDate";

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
  const isOpen = (n: any) => {
    if (n.type === "money") {
      return (n.amountRaised ?? 0) < (n.amountNeeded ?? 0);
    }
    return (n.quantityFulfilled ?? 0) < (n.quantityNeeded ?? 0);
  };

  const openNeeds = needs.filter(isOpen);
  const moneyNeeds = openNeeds.filter((n) => n.type === "money");
  const goodsNeeds = openNeeds.filter((n) => n.type === "goods");

  return (
    <div>
      {/* HERO IMAGE with overlaid info */}
      <section className="relative w-full h-72 sm:h-96 lg:h-[26rem]">
        <Image
          src={orphanage!.imageUrl}
          alt={orphanage!.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-5xl mx-auto px-4 pb-8 w-full">
            <div className="flex items-center gap-2 mb-3">
              {orphanage!.verified && <Badge variant="verified">Verified</Badge>}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
              {orphanage!.name}
            </h1>
            <div className="flex items-center gap-2 text-white/80 text-sm sm:text-base">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <span>{orphanage!.location}, {orphanage!.state}</span>
              <span className="text-white/40">&middot;</span>
              <span>{orphanage!.childrenCount} children</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        {/* Story */}
        <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-12 max-w-3xl">
          {orphanage!.story}
        </p>

        {/* Needs / donate section */}
        <DonateModal moneyNeeds={moneyNeeds as any} goodsNeeds={goodsNeeds as any} />

        {/* Volunteer requests */}
        {volunteerRequests.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
                Volunteer Requests
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {volunteerRequests.map((v) => (
                <div
                  key={v.id}
                  className="border border-orange-100 rounded-2xl p-5 bg-white hover:shadow-md hover:border-brand-200 transition-all"
                >
                  <h4 className="font-semibold text-gray-900 mb-1">{v.task}</h4>
                  <p className="text-sm text-gray-600 mb-3">{v.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pt-3 border-t border-orange-50">
                    <span>{formatDate(v.date)}</span>
                    <span className="font-medium text-gray-700">
                      {v.slotsAvailable - v.slotsFilled}/{v.slotsAvailable} slots left
                    </span>
                  </div>
                  <Link
                    href="/volunteer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                  >
                    Apply on the Volunteer page
                    <span aria-hidden>&rarr;</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}