import Link from "next/link";
import Image from "next/image";
import { getLeastVisibleOrphanages, getAllOrphanages } from "@/lib/data";
import OrphanageCard from "@/components/OrphanageCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await getLeastVisibleOrphanages(3);
  const all = await getAllOrphanages();

  const totalOrphanages = all.length;
  const totalChildren = all.reduce((sum, o) => sum + o.childrenCount, 0);
  const totalStates = new Set(all.map((o) => o.state)).size;

  // Pull one real story forward for the pull-quote section
  const spotlight = featured[0] ?? all[0];

  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-teal-50/40" />
        <div className="relative max-w-6xl mx-auto px-4 pt-14 sm:pt-20 pb-20 sm:pb-28 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: copy */}
          <div className="relative z-10 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 bg-white shadow-sm ring-1 ring-brand-100 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              {totalOrphanages}+ orphanages waiting to be found
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
              The ones nobody
              <br className="hidden sm:block" />
              <span className="relative inline-block">
                <span className="relative z-10 text-brand-600">hears about.</span>
                <span className="absolute left-0 right-0 bottom-1 h-3 bg-brand-200/70 -z-0 rounded" />
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 mb-8">
              Thousands of small orphanages across India survive on almost no
              visibility and even less funding. OrphanConnect surfaces the
              ones furthest from the spotlight &mdash; and puts them right in
              front of you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4">
              <Link
                href="/browse"
                className="bg-brand-600 text-white px-7 py-3.5 rounded-full font-medium hover:bg-brand-700 hover:-translate-y-0.5 transition-all shadow-md shadow-brand-600/20"
              >
                Browse Orphanages
              </Link>
              <Link
                href="/register"
                className="bg-white border border-gray-200 text-gray-700 px-7 py-3.5 rounded-full font-medium hover:border-brand-300 hover:text-brand-700 transition-colors"
              >
                Register an Orphanage
              </Link>
            </div>
          </div>

          {/* Right: photo collage with overlapping stat card */}
          <div className="relative h-72 sm:h-96 lg:h-[28rem]">
            {spotlight && (
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl rotate-1">
                <Image
                  src={spotlight.imageUrl}
                  alt={spotlight.name}
                  fill
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs uppercase tracking-wide text-white/70 mb-1">
                    Least seen this month
                  </p>
                  <p className="font-serif text-lg font-semibold">{spotlight.name}</p>
                  <p className="text-sm text-white/80">
                    {spotlight.location}, {spotlight.state}
                  </p>
                </div>
              </div>
            )}

            {/* Floating stat chip */}
            <div className="absolute -bottom-6 -left-4 sm:-left-8 bg-white rounded-2xl shadow-xl px-5 py-4 -rotate-2 border border-orange-50">
              <p className="text-2xl font-bold text-brand-600 leading-none">{totalChildren}</p>
              <p className="text-xs text-gray-500 mt-1">children supported</p>
            </div>
          </div>
        </div>

        {/* Diagonal divider into next section */}
        <svg
          className="block w-full text-white"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,60 L1440,0 L1440,60 Z" fill="currentColor" />
        </svg>
      </section>

      {/* STATS */}
      <section className="bg-white pb-4">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 gap-4 sm:gap-8 text-center">
          {[
            { value: totalOrphanages, label: "Orphanages" },
            { value: totalChildren, label: "Children supported" },
            { value: totalStates, label: "States reached" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="opacity-0 animate-fade-up"
              style={{ animationDelay: `${i * 120}ms`, animationFillMode: "forwards" }}
            >
              <p className="text-3xl sm:text-4xl font-serif font-bold text-brand-600">{stat.value}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS — staggered, alternating layout */}
      <section className="max-w-5xl mx-auto px-4 py-20 sm:py-28">
        <div className="text-center mb-14 sm:mb-20">
          <p className="text-brand-600 text-sm font-semibold tracking-wide uppercase mb-3">
            How it works
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
            Three steps to real impact
          </h2>
        </div>

        <div className="space-y-14 sm:space-y-20">
          {[
            {
              n: "01",
              t: "Discover",
              d: "Browse verified orphanages ranked by how little attention they've received, and see exactly what each one needs right now.",
              align: "left",
            },
            {
              n: "02",
              t: "Give",
              d: "Put money toward a specific need or fulfill a request for goods directly. You always choose exactly where your help lands.",
              align: "right",
            },
            {
              n: "03",
              t: "Volunteer",
              d: "Offer your time instead of, or alongside, your money. Find opportunities near you and sign up for a day that works.",
              align: "left",
            },
          ].map((s) => (
            <div
              key={s.n}
              className={`flex flex-col sm:flex-row items-center gap-6 sm:gap-10 ${
                s.align === "right" ? "sm:flex-row-reverse text-center sm:text-right" : "text-center sm:text-left"
              }`}
            >
              <span className="font-serif text-6xl sm:text-7xl font-bold text-brand-100 leading-none shrink-0">
                {s.n}
              </span>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-gray-900 mb-2">{s.t}</h3>
                <p className="text-gray-600 max-w-md">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SPOTLIGHT / PULL QUOTE */}
      {spotlight && (
        <section className="bg-gray-900 text-white py-20 sm:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Image
              src={spotlight.imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <svg className="w-10 h-10 text-brand-400 mx-auto mb-6" fill="currentColor" viewBox="0 0 32 32">
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            <p className="font-serif text-xl sm:text-2xl leading-relaxed mb-6">
              &ldquo;{spotlight.story}&rdquo;
            </p>
            <p className="text-brand-300 font-medium">
              {spotlight.name} &middot; {spotlight.location}, {spotlight.state}
            </p>
          </div>
        </section>
      )}

      {/* ORPHANAGES */}
      <section className="bg-orange-50/40 py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-brand-600 text-sm font-semibold tracking-wide uppercase mb-2">
                Needs your attention
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
                Least visible right now
              </h2>
            </div>
            <Link
              href="/browse"
              className="text-brand-600 text-sm font-medium hover:underline whitespace-nowrap"
            >
              See all orphanages &rarr;
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((o, i) => (
              <div
                key={o.id}
                className="opacity-0 animate-fade-up"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: "forwards" }}
              >
                <OrphanageCard orphanage={o} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="relative max-w-5xl mx-auto px-4 py-20 sm:py-28">
        <div className="bg-brand-600 rounded-[2rem] px-6 sm:px-16 py-14 sm:py-16 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-brand-500/40" />
          <div className="absolute -bottom-16 -left-10 w-56 h-56 rounded-full bg-brand-700/40" />
          <div className="relative">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              A small act. A big difference.
            </h2>
            <p className="text-brand-50 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Whether you give, volunteer, or simply share their story, you
              help a child who would otherwise go unseen.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link
                href="/give"
                className="bg-white text-brand-700 px-7 py-3.5 rounded-full font-medium hover:bg-brand-50 transition-colors"
              >
                Start Giving
              </Link>
              <Link
                href="/volunteer"
                className="border border-white/60 text-white px-7 py-3.5 rounded-full font-medium hover:bg-white/10 transition-colors"
              >
                Volunteer Your Time
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}