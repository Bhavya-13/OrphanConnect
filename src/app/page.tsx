import Link from "next/link";
import { getLeastVisibleOrphanages, getAllOrphanages } from "@/lib/data";
import OrphanageCard from "@/components/OrphanageCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await getLeastVisibleOrphanages(3);
  const all = await getAllOrphanages();

  const totalOrphanages = all.length;
  const totalChildren = all.reduce((sum, o) => sum + o.childrenCount, 0);
  const totalStates = new Set(all.map((o) => o.state)).size;

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-orange-50 via-orange-50/50 to-transparent py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full mb-6">
            Every child deserves to be seen
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Give visibility.
            <br />
            <span className="text-brand-600">Give hope.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Thousands of orphanages across India go unseen and underfunded simply
            because no one knows they exist. OrphanConnect brings the ones nobody
            hears about right to you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/browse"
              className="bg-brand-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-brand-700 transition-colors"
            >
              Browse Orphanages
            </Link>
            <Link
              href="/register"
              className="bg-white border border-brand-600 text-brand-600 px-8 py-4 rounded-lg font-medium hover:bg-brand-50 transition-colors"
            >
              Register an Orphanage
            </Link>
          </div>

          {/* Scroll cue */}
          <div className="mt-16 flex flex-col items-center text-gray-400">
            <span className="text-sm mb-2">Scroll to meet them</span>
            <span className="animate-bounce text-2xl">&darr;</span>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-y border-orange-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-brand-600">{totalOrphanages}</p>
            <p className="text-gray-600 mt-1">Orphanages on the platform</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-brand-600">{totalChildren}</p>
            <p className="text-gray-600 mt-1">Children being supported</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-brand-600">{totalStates}</p>
            <p className="text-gray-600 mt-1">States reached</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">How it works</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Three simple steps to make a real difference in a child&apos;s life.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 border border-orange-100 text-center">
            <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 font-bold text-lg flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Discover</h3>
            <p className="text-sm text-gray-600">
              Browse verified orphanages and see exactly what each one needs right
              now, from money to everyday supplies.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-orange-100 text-center">
            <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 font-bold text-lg flex items-center justify-center mx-auto mb-4">
              2
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Give</h3>
            <p className="text-sm text-gray-600">
              Donate money towards a specific need, or fulfill a request for goods
              directly. You choose where your help goes.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-orange-100 text-center">
            <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 font-bold text-lg flex items-center justify-center mx-auto mb-4">
              3
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Volunteer</h3>
            <p className="text-sm text-gray-600">
              Give your time too. Find volunteer opportunities near you and sign up
              for a day that works for you.
            </p>
          </div>
        </div>
      </section>

      {/* ORPHANAGES SECTION */}
      <section className="bg-orange-50/40 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-3xl font-bold text-gray-800">Least visible right now</h2>
            <Link
              href="/browse"
              className="text-brand-600 text-sm font-medium hover:underline whitespace-nowrap"
            >
              See all &rarr;
            </Link>
          </div>
          <p className="text-gray-500 mb-10 max-w-2xl">
            These orphanages have received the fewest profile views. They need your
            attention the most, so give them a look first.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((o) => (
              <OrphanageCard key={o.id} orphanage={o} />
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          A small act. A big difference.
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
          Whether you give, volunteer, or simply share, you help a child who would
          otherwise go unseen.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/browse"
            className="bg-brand-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-brand-700 transition-colors"
          >
            Start Giving
          </Link>
          <Link
            href="/volunteer"
            className="bg-white border border-brand-600 text-brand-600 px-8 py-4 rounded-lg font-medium hover:bg-brand-50 transition-colors"
          >
            Volunteer Your Time
          </Link>
        </div>
      </section>
    </div>
  );
}