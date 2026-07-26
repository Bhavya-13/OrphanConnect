"use client";

import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";

export default function AdminHomePage() {
  return (
    <AdminGuard>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Panel</h1>
        <p className="text-gray-500 mb-8 text-sm">
          Manage orphanage verifications, view donations, and manage your team.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border border-orange-100 rounded-xl p-6 bg-white">
            <h2 className="font-semibold text-gray-800 mb-1">Pending Orphanages</h2>
            <p className="text-sm text-gray-500 mb-4">
              Review and approve or reject new orphanage registrations.
            </p>
            <span className="text-sm text-gray-400">Coming in the next stage</span>
          </div>

          <div className="border border-orange-100 rounded-xl p-6 bg-white">
            <h2 className="font-semibold text-gray-800 mb-1">Donation Ledger</h2>
            <p className="text-sm text-gray-500 mb-4">
              See a complete record of all donations and donors.
            </p>
            <span className="text-sm text-gray-400">Coming in the next stage</span>
          </div>

          <div className="border border-orange-100 rounded-xl p-6 bg-white">
            <h2 className="font-semibold text-gray-800 mb-1">Manage Admins</h2>
            <p className="text-sm text-gray-500 mb-4">
              Promote other users to admin, or remove admin access.
            </p>
            <span className="text-sm text-gray-400">Coming in a later stage</span>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}