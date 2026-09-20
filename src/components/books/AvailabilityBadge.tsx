type Props = { availableCopies: number; totalCopies: number };

export default function AvailabilityBadge({ availableCopies, totalCopies }: Props) {
  const available = availableCopies > 0;
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${available ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
    {available ? `${availableCopies} / ${totalCopies} available` : "Out of stock"}
  </span>;
}
