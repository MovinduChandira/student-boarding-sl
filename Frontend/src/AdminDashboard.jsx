import DashboardLayout from "./DashboardLayout.jsx";
import StatCard from "./StatCard.jsx";

// Placeholder data: replace with values from your backend.
const stats = [
  { label: "Total users", value: "1254" },
  { label: "Active listings", value: "856" },
  { label: "Requests", value: "32" },
  { label: "Revenue (For Month)", value: "Rs 250,000" },
];

// Users in thousands, Oct to Sep
const growth = [
  { m: "Oct", v: 75, c: ["#F4803F", "#EE5A2B"] },
  { m: "Nov", v: 82, c: ["#F08A45", "#E86A33"] },
  { m: "Dec", v: 107, c: ["#F2A040", "#E8872E"] },
  { m: "Jan", v: 120, c: ["#FAC215", "#EAA10C"] },
  { m: "Feb", v: 160, c: ["#FFD21A", "#E89A06"] },
  { m: "Mar", v: 130, c: ["#EBC85A", "#D7A93B"] },
  { m: "Apr", v: 168, c: ["#F7D98A", "#D9B060"] },
  { m: "May", v: 176, c: ["#6FD1C0", "#18A89A"] },
  { m: "Jun", v: 208, c: ["#1DD3C4", "#0AA9B8"] },
  { m: "Jul", v: 187, c: ["#12E0EF", "#08B8D4"] },
  { m: "Aug", v: 220, c: ["#0FC0EE", "#0A9DE0"] },
  { m: "Sep", v: 237, c: ["#10B4FF", "#0A86EA"] },
];
const yTicks = ["250k", "200k", "150k", "100k", "50k", "0"];

function UserGrowthChart() {
  return (
    <section className="mt-10 max-w-[1000px] bg-[#042F5C] p-6">
      <h2 className="text-3xl font-bold text-[#F5B800]">User Growth</h2>

      <div className="mt-6 flex" role="img" aria-label="Bar chart of user growth by month, October to September">
        <p className="mr-2 hidden -rotate-180 text-sm [writing-mode:vertical-rl] sm:block">Users (Thousands)</p>

        <div className="flex-1">
          <div className="flex h-64">
            <div className="relative w-12 shrink-0">
              {yTicks.map((t, i) => (
                <span key={t} className="absolute right-3 -translate-y-1/2 text-sm" style={{ top: `${i * 20}%` }}>
                  {t}
                </span>
              ))}
            </div>
            <div className="relative flex-1">
              {yTicks.map((t, i) => (
                <div key={t} className="absolute inset-x-0 border-t border-white/25" style={{ top: `${i * 20}%` }} />
              ))}
              <div className="absolute inset-0 flex items-end gap-1.5 px-1 sm:gap-3">
                {growth.map((g) => (
                  <div key={g.m} className="flex h-full flex-1 items-end justify-center">
                    <div
                      className="w-full max-w-[34px] rounded-t-md"
                      style={{ height: `${(g.v / 250) * 100}%`, background: `linear-gradient(${g.c[0]}, ${g.c[1]})` }}
                      title={`${g.m}: ${g.v}k users`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="ml-12 mt-2 flex gap-1.5 px-1 text-center text-sm sm:gap-3">
            {growth.map((g) => (
              <span key={g.m} className="flex-1">{g.m}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      <h1 className="text-4xl font-bold text-[#E5B95C] md:text-5xl">Platform Overview</h1>
      <div className="mt-10 grid max-w-[1000px] gap-8 sm:grid-cols-2">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>
      <UserGrowthChart />
    </DashboardLayout>
  );
}
