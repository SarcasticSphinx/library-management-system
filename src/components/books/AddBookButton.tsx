import { Plus } from "lucide-react";
export default function AddBookButton({ onClick }: { onClick: () => void }) { return <button type="button" onClick={onClick} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"><Plus size={17} /> Add book</button>; }
