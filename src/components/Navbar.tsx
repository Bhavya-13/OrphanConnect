import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-white border-b border-orange-100 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-brand-600">
          Orphan<span className="text-gray-800">Connect</span>
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-gray-600">
          <Link href="/browse" className="hover:text-brand-600">
            Browse Orphanages
          </Link>
          <Link href="/volunteer" className="hover:text-brand-600">
            Volunteer
          </Link>
          <Link href="/register" className="hover:text-brand-600">
            Register Orphanage
          </Link>
          <Link href="/admin/new-need" className="hover:text-brand-600">
            Post a Need
          </Link>
        </nav>
      </div>
    </header>
  );
}