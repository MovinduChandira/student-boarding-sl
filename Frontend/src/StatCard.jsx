export default function StatCard({ label, value }) {
  return (
    <div className="flex min-h-[150px] flex-col justify-between rounded-2xl border border-[#E5B95C]/50 border-l-2 border-l-[#E5B95C] bg-linear-to-b from-[#2B7BC4] to-[#16406F] px-8 py-6 text-white shadow-lg">
      <p className="text-xl">{label}</p>
      <p className="text-5xl font-bold text-[#EFD08A]">{value}</p>
    </div>
  );
}
