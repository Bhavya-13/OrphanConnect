import Image from "next/image";
import Link from "next/link";
import { Orphanage } from "@/lib/types";
import Badge from "@/components/Badge";

export default function OrphanageCard({ orphanage }: { orphanage: Orphanage }) {
  return (
    <Link
      href={`/orphanage/${orphanage.id}`}
      className="group block bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden hover:shadow-lg hover:border-brand-300 transition-all duration-200"
    >
      <div className="relative w-full h-44 overflow-hidden">
        <Image
          src={orphanage.imageUrl}
          alt={orphanage.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {orphanage.verified && (
          <div className="absolute top-3 right-3">
            <Badge variant="verified">Verified</Badge>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-brand-600 transition-colors">
          {orphanage.name}
        </h3>
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          <span>{orphanage.location}, {orphanage.state}</span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{orphanage.story}</p>
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-orange-50">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            {orphanage.childrenCount} children
          </span>
          <span className="text-brand-600 font-medium group-hover:translate-x-0.5 transition-transform">
            View &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}