"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { useToast } from "@/lib/useToast";

export default function Navbar() {
  const { user, role, signOut } = useAuth();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    showToast("You have been signed out.", "info");
  };

  const closeMenu = () => setOpen(false);

  const navItems = [
    { href: "/browse", label: "Browse" },
    { href: "/give", label: "Give" },
    { href: "/volunteer", label: "Volunteer" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-orange-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-1.5 font-serif text-xl font-bold text-gray-900 shrink-0"
        >
          <span className="w-2 h-2 rounded-full bg-brand-500" />
          Orphan<span className="text-brand-600">Connect</span>
        </Link>

        {/* Desktop nav pill group */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-full p-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                isActive(item.href)
                  ? "bg-white text-brand-700 shadow-sm"
                  : "text-gray-600 hover:text-brand-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right side: role links + auth */}
        <div className="hidden md:flex items-center gap-3">
          {role === "orphanage" && (
            <Link
              href="/dashboard"
              onClick={closeMenu}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-brand-600"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              Dashboard
            </Link>
          )}
          {role === "admin" && (
            <Link
              href="/admin"
              onClick={closeMenu}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-brand-600"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              Admin
            </Link>
          )}
          {role !== "orphanage" && role !== "admin" && (
            <Link
              href="/register"
              onClick={closeMenu}
              className="text-sm font-medium text-gray-600 hover:text-brand-600"
            >
              Register Orphanage
            </Link>
          )}

          {user ? (
            <button
              onClick={handleSignOut}
              className="text-sm font-medium text-gray-500 hover:text-brand-600 border border-gray-200 rounded-full px-4 py-2 transition-colors"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              onClick={closeMenu}
              className="text-sm font-medium bg-brand-600 text-white rounded-full px-5 py-2 hover:bg-brand-700 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile hamburger button (animates into X) */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden relative w-9 h-9 flex items-center justify-center text-gray-700"
          aria-label="Toggle menu"
        >
          <span
            className={`absolute w-5 h-0.5 bg-current rounded transition-all duration-300 ${
              open ? "rotate-45" : "-translate-y-1.5"
            }`}
          />
          <span
            className={`absolute w-5 h-0.5 bg-current rounded transition-all duration-300 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute w-5 h-0.5 bg-current rounded transition-all duration-300 ${
              open ? "-rotate-45" : "translate-y-1.5"
            }`}
          />
        </button>
      </div>

      {/* Mobile menu dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out border-t border-orange-100 bg-white ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="px-4 py-4 flex flex-col gap-1 text-sm font-medium text-gray-600">
          {navItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className={`px-3 py-2.5 rounded-lg transition-colors opacity-0 animate-fade-up ${
                isActive(item.href) ? "bg-brand-50 text-brand-700" : "hover:bg-gray-50"
              }`}
              style={{ animationDelay: `${i * 40}ms`, animationFillMode: "forwards" }}
            >
              {item.label}
            </Link>
          ))}

          {role === "orphanage" && (
            <Link href="/dashboard" onClick={closeMenu} className="px-3 py-2.5 rounded-lg hover:bg-gray-50 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              Dashboard
            </Link>
          )}
          {role === "admin" && (
            <Link href="/admin" onClick={closeMenu} className="px-3 py-2.5 rounded-lg hover:bg-gray-50 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              Admin
            </Link>
          )}
          {role !== "orphanage" && role !== "admin" && (
            <Link href="/register" onClick={closeMenu} className="px-3 py-2.5 rounded-lg hover:bg-gray-50">
              Register Orphanage
            </Link>
          )}

          <div className="border-t border-gray-100 mt-2 pt-3">
            {user ? (
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50"
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className="block text-center bg-brand-600 text-white rounded-full px-4 py-2.5 font-medium hover:bg-brand-700"
              >
                Sign in
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}