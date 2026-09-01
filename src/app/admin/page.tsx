"use client";

import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";

const cards = [
  {
    href: "/admin/pending",
    title: "Pending Orphanages",
    description: "Review and approve or reject new orphanage registrations.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    accent: "bg-amber-100 text-amber-700",
  },
  {
    href: "/admin/ledger",
    title: "Donation Ledger",
    description: "See a complete record of all donations and donors.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
    accent: "bg-green-100 text-green-700",
  },
  {
    href: "/admin/team",
    title: "Manage Admins",
    description: "Promote other users to admin, or remove admin access.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
    accent: "bg-blue-100 text-blue-700",
  },
];

export default function AdminHomePage() {
  return (
    <AdminGuard>
      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            Admin
          </span>
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2 tracking-tight">Admin Panel</h1>
          <p className="text-gray-500 text-sm">
            Manage orphanage verifications, view donations, and manage your team.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative bg-white rounded-2xl p-6 border border-orange-100 hover:border-brand-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 opacity-0 animate-fade-up"
              style={{ animationDelay: `${i * 70}ms`, animationFillMode: "forwards" }}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.accent}`}>
                {card.icon}
              </div>
              <h2 className="font-semibold text-gray-900 mb-1 group-hover:text-brand-600 transition-colors">
                {card.title}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
              <span className="absolute top-6 right-6 text-gray-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all">
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </AdminGuard>
  );
}