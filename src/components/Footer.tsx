import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  const exploreLinks = [
    { href: "/browse", label: "Browse Orphanages" },
    { href: "/give", label: "Give" },
    { href: "/volunteer", label: "Volunteer" },
  ];

  const involvedLinks = [
    { href: "/register", label: "Register an Orphanage" },
    { href: "/login", label: "Sign in" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-14 sm:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 font-serif text-xl font-bold text-white mb-3"
            >
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              Orphan<span className="text-brand-400">Connect</span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Connecting lesser-known orphanages across India with the
              donors and volunteers who&apos;d never have found them
              otherwise.
            </p>

            {/* Social pills */}
            <div className="flex items-center gap-2 mt-6">
              {[
                {
                  label: "Instagram",
                  path: "M12 2c2.7 0 3.05.01 4.12.06 1.07.05 1.8.22 2.44.47.66.26 1.22.6 1.77 1.15.55.55.89 1.11 1.15 1.77.25.64.42 1.37.47 2.44.05 1.07.06 1.42.06 4.12s-.01 3.05-.06 4.12c-.05 1.07-.22 1.8-.47 2.44a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.44.47-1.07.05-1.42.06-4.12.06s-3.05-.01-4.12-.06c-1.07-.05-1.8-.22-2.44-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.44C2.01 15.05 2 14.7 2 12s.01-3.05.06-4.12c.05-1.07.22-1.8.47-2.44.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45 2.53c.64-.25 1.37-.42 2.44-.47C8.95 2.01 9.3 2 12 2zm0 1.8c-2.65 0-2.96.01-4.01.06-.87.04-1.34.18-1.65.3-.42.16-.71.35-1.02.66-.31.31-.5.6-.66 1.02-.12.31-.26.78-.3 1.65-.05 1.05-.06 1.36-.06 4.01s.01 2.96.06 4.01c.04.87.18 1.34.3 1.65.16.42.35.71.66 1.02.31.31.6.5 1.02.66.31.12.78.26 1.65.3 1.05.05 1.36.06 4.01.06s2.96-.01 4.01-.06c.87-.04 1.34-.18 1.65-.3.42-.16.71-.35 1.02-.66.31-.31.5-.6.66-1.02.12-.31.26-.78.3-1.65.05-1.05.06-1.36.06-4.01s-.01-2.96-.06-4.01c-.04-.87-.18-1.34-.3-1.65a2.7 2.7 0 0 0-.66-1.02 2.7 2.7 0 0 0-1.02-.66c-.31-.12-.78-.26-1.65-.3-1.05-.05-1.36-.06-4.01-.06zm0 3.06a5.14 5.14 0 1 1 0 10.28 5.14 5.14 0 0 1 0-10.28zm0 1.8a3.34 3.34 0 1 0 0 6.68 3.34 3.34 0 0 0 0-6.68zm5.34-1.99a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z",
                },
                {
                  label: "Twitter",
                  path: "M22.46 5.94c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.37 8.6 8.6 0 0 1-2.72 1.04 4.28 4.28 0 0 0-7.29 3.9A12.14 12.14 0 0 1 3.16 4.9a4.28 4.28 0 0 0 1.32 5.71c-.7-.02-1.36-.22-1.94-.53v.05a4.28 4.28 0 0 0 3.43 4.2 4.3 4.3 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98A8.59 8.59 0 0 1 2 18.9a12.1 12.1 0 0 0 6.56 1.92c7.87 0 12.18-6.52 12.18-12.18l-.01-.55a8.7 8.7 0 0 0 2.13-2.15z",
                },
                {
                  label: "Facebook",
                  path: "M13.5 22v-8.5h2.85l.43-3.31H13.5V8.05c0-.96.27-1.61 1.64-1.61h1.75V3.49C16.56 3.42 15.55 3.34 14.38 3.34c-2.44 0-4.11 1.49-4.11 4.22v2.63H7.4v3.31h2.87V22h3.23z",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-brand-500 text-gray-300 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Explore column */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4">
              Explore
            </p>
            <ul className="space-y-2.5 text-sm">
              {exploreLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-brand-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get involved column */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4">
              Get involved
            </p>
            <ul className="space-y-2.5 text-sm">
              {involvedLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-brand-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-gray-500 text-center sm:text-left">
          <p>&copy; {year} OrphanConnect. Making lesser-known orphanages visible.</p>
          <p className="flex items-center justify-center sm:justify-end gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Built for the children who deserve to be seen.
          </p>
        </div>
      </div>
    </footer>
  );
}