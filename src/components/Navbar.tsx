"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { useToast } from "@/lib/useToast";

export default function Navbar() {
  const { user, role, signOut } = useAuth();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    showToast("You have been signed out.", "info");
  };

  const closeMenu = () => setOpen(false);

  const links = (
    <>
      <Link href="/browse" onClick={closeMenu} className="hover:text-brand-600">
        Browse Orphanages
      </Link>
      <Link href="/give" onClick={closeMenu} className="hover:text-brand-600">
        Give
      </Link>
      <Link href="/volunteer" onClick={closeMenu} className="hover:text-brand-600">
        Volunteer
      </Link>
      {role === "orphanage" && (
        <Link href="/dashboard" onClick={closeMenu} className="text-brand-600 hover:text-brand-700 font-semibold">
          Dashboard
        </Link>
      )}
      {role !== "orphanage" && role !== "admin" && (
        <Link href="/register" onClick={closeMenu} className="hover:text-brand-600">
          Register Orphanage
        </Link>
      )}
      {role === "admin" && (
        <Link href="/admin" onClick={closeMenu} className="text-brand-600 hover:text-brand-700 font-semibold">
          Admin
        </Link>
      )}
      {user ? (
        <button onClick={handleSignOut} className="text-left text-gray-600 hover:text-brand-600">
          Sign out
        </button>
      ) : (
        <Link href="/login" onClick={closeMenu} className="hover:text-brand-600">
          Sign in
        </Link>
      )}
    </>
  );

  return (
    <header className="bg-white border-b border-orange-100 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-brand-600" onClick={closeMenu}>
          Orphan<span className="text-gray-800">Connect</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600 items-center">
          {links}
        </nav>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-700 p-1"
          aria-label="Toggle menu"
        >
          {open ? (
            // X icon
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger icon
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {open && (
        <nav className="md:hidden border-t border-orange-100 bg-white px-4 py-4 flex flex-col gap-4 text-sm font-medium text-gray-600">
          {links}
        </nav>
      )}
    </header>
  );
}