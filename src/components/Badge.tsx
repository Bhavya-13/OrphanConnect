export default function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "urgent" | "verified";
}) {
  const styles: Record<string, string> = {
    default: "bg-gray-100 text-gray-700",
    urgent: "bg-red-100 text-red-700",
    verified: "bg-green-100 text-green-700",
  };

  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${styles[variant]}`}>
      {children}
    </span>
  );
}
