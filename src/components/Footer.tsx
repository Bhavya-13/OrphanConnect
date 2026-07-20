export default function Footer() {
  return (
    <footer className="bg-white border-t border-orange-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-500 flex flex-col md:flex-row justify-between gap-2">
        <p>OrphanConnect — making lesser-known orphanages visible.</p>
        <p>&copy; {new Date().getFullYear()} OrphanConnect</p>
      </div>
    </footer>
  );
}
