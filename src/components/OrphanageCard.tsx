import Image from "next/image";
import Link from "next/link";
import { Orphanage } from "@/lib/types";
import Badge from "@/components/Badge";

export default function OrphanageCard({ orphanage }: { orphanage: Orphanage }) {
  return (
    <Link
      href={`/orphanage/${orphanage.id}`}
      className="block bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative w-full h-40">
        <Image
          src={orphanage.imageUrl}
          alt={orphanage.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-800">{orphanage.name}</h3>
          {orphanage.verified && <Badge variant="verified">Verified</Badge>}
        </div>
        <p className="text-sm text-gray-500 mb-2">
          {orphanage.location}, {orphanage.state}
        </p>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{orphanage.story}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{orphanage.childrenCount} children</span>
          <span>{orphanage.views} profile views</span>
        </div>
      </div>
    </Link>
  );
}
