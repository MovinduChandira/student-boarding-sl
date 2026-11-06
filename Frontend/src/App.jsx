import { useState } from "react";
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FiArrowRightCircle } from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";

/* ---------- Colours taken from the design ---------- */
// page gradient: #0A4682 -> #1B73C4 | footer: #1B73C4 | gold: #D4A12A
// cards: #D9D9D9 | blue buttons: #3A86D8 / #0D7BF0 | stat cards: #0F5496

/* ---------- Data ---------- */
const stats = [
  { icon: "house", value: "12 +", label: "Boarding areas covered" },
  { icon: "building", value: "150+", label: "Active Listings" },
  { icon: "users", value: "100+", label: "Registered Students" },
  { icon: "star", value: "4.6/5", label: "Average Rating" },
];

const listings = [
  { id: 1, type: "Shared Room", place: "Pasal Mawatha,Nugegoda, Colombo", price: "Rs. 10,000/ month", img: "/images/shared-room.jpg" },
  { id: 2, type: "Twin Room", place: "Nugegoda,Colombo", price: "Rs. 12,000/month", img: "/images/twin-room.jpg" },
  { id: 3, type: "Single Room", place: "Maharagama, Colombo", price: "Rs. 15,000/month", img: "/images/single-room.jpg" },
];

const studentReviews = [
  { stars: 5, text: "\"I'm from Jaffna and knew nothing about Nugegoda when I started my first year. Boarding.lk showed me the distance to campus and real photos before I even messaged the owner. Found my room in two days.\"", name: "Nimasha Perera, Faculty of Computing, 1st year" },
  { stars: 4, text: "\"What I liked most was messaging the owner directly instead of going through a broker. No extra fees, no pressure, and I could ask about meals and Wi-Fi before deciding.\"", name: "Kasun Fernando, Faculty of Management Studies, 2nd year" },
];

const ownerReviews = [
  { stars: 5, text: "\"My annex used to sit empty for weeks between tenants. After listing on Boarding.lk, I started getting genuine student inquiries within days, not random calls from people who weren't even students.\"", name: "Mrs. Chandrika Wijesinghe, Boarding Owner, Nugegoda" },
  { stars: 4, text: "\"The review system keeps both sides honest. I know the students contacting me are verified, and they can see I'm a trusted owner too. It just makes the whole process smoother.\"", name: "Mr. Sunil Rathnayake, Boarding Owner, Gangodawila" },
];

/* ---------- Icons ---------- */
const Y = "#F5B800";
function StatIcon({ name }) {
  const common = { width: 36, height: 36, viewBox: "0 0 24 24", fill: Y };
  if (name === "house") return <svg {...common}><path d="M12 3 1.5 12.5H5V21h5.5v-6h3v6H19v-8.5h3.5z" /></svg>;
  if (name === "building")
    return (
      <svg {...common}>
        <path d="M3 21V9h7v12zm8 0V3h10v18zM5 11v2h2v-2zm0 4v2h2v-2zm8-9v2h2V6zm4 0v2h2V6zm-4 4v2h2v-2zm4 0v2h2v-2zm-4 4v2h2v-2zm4 0v2h2v-2z" fillRule="evenodd" />
      </svg>
    );
  if (name === "users")
    return (
      <svg {...common}>
        <circle cx="12" cy="7" r="3.2" /><circle cx="5" cy="9" r="2.6" /><circle cx="19" cy="9" r="2.6" />
        <path d="M6.5 19c0-3.2 2.5-5.5 5.5-5.5s5.5 2.3 5.5 5.5zM0 17c0-2.3 1.8-4 4.2-4 .8 0 1.6.2 2.2.6C5 14.8 4.3 16 4.2 17zm24 0c0-2.3-1.8-4-4.2-4-.8 0-1.6.2-2.2.6 1.4 1.2 2.1 2.4 2.2 3.4z" />
      </svg>
    );
  return <svg {...common}><polygon points="12,1.5 15,8.8 23,9.4 17,14.6 18.8,22.4 12,18.3 5.2,22.4 7,14.6 1,9.4 9,8.8" /></svg>;
}

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
const PinIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
    <path d="M12 21.5s7-6.4 7-12a7 7 0 0 0-14 0c0 5.6 7 12 7 12z" /><circle cx="12" cy="9.5" r="2.6" />
  </svg>
);
const HeartIcon = ({ filled }) => (
  <svg width="30" height="30" viewBox="0 0 24 24" {...stroke} fill={filled ? "#e11d48" : "none"} stroke={filled ? "#e11d48" : "#111"}>
    <path d="M12 20.5s-8-5-8-10.5A4.6 4.6 0 0 1 12 7.2 4.6 4.6 0 0 1 20 10c0 5.5-8 10.5-8 10.5z" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
);
const MailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
    <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
  </svg>
);

/* ---------- Sections ---------- */
function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Home", to: "/" },
    { label: "Login", to: "/login" },
    { label: "About Us", to: "/about" },
  ];
  return (
    <header className="relative mx-auto flex max-w-[1148px] items-center justify-between px-6 pb-6 pt-8 md:px-12">
      <Link to="/">
        <img src="/images/logo.png" alt="boarding.lk" className="h-[60px] w-[140px] object-contain md:h-[105px] md:w-[253px]" />
      </Link>
      <nav className="hidden items-center gap-12 text-lg font-medium text-white md:flex">
  {links.map((l) => (
    <Link
      key={l.label}
      to={l.to}
      className="relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-0 after:bg-[#D4A12A] after:transition-all after:duration-300 hover:after:w-full"
    >
      {l.label}
    </Link>
  ))}
</nav>
      <button className="text-3xl text-white md:hidden" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        ☰
      </button>
      {open && (
        <nav className="absolute left-0 right-0 top-full z-10 flex flex-col gap-4 bg-[#0A3F78] p-6 text-lg text-white md:hidden">
          {links.map((l) => (
            <Link key={l.label} to={l.to} onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function Hero() {
  const [query, setQuery] = useState("");
  return (
    <section className="mx-auto grid max-w-[1148px] items-center gap-10 px-6 py-6 md:grid-cols-[1.3fr_1fr] md:px-12">
      <div className="text-white">
        <p className="text-lg font-medium">JOIN FOR FREE</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight md:text-[50px] md:leading-[58px]">
          Find Your <span className="text-[#D4A12A]">Safe Boarding</span>
          <br />
          Stay Close to Campus
        </h1>
        <p className="mt-5 max-w-md text-lg leading-snug">
          Get started with the easiest and most trusted way to find verified student boarding near your university.
        </p>

        <form
          className="mt-8 flex max-w-[480px] items-center rounded-lg border-2 border-white bg-white"
          onSubmit={(e) => { e.preventDefault(); console.log("Search:", query); }}
        >
          <span className="pl-3 text-gray-500"><PinIcon /></span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by location..."
            aria-label="Search by location"
            className="min-w-0 flex-1 px-3 py-2.5 text-lg text-gray-800 outline-none placeholder:text-gray-400"
          />
          <button className="self-stretch rounded-md bg-[#1B73C4] px-10 text-lg font-semibold text-white hover:bg-[#165fa3]">
            Search
          </button>
        </form>

        <div className="mt-10 flex flex-wrap gap-10 md:pl-4">
          <a href="#listings" className="flex h-14 w-44 items-center justify-center rounded-full border border-[#1B73C4] bg-[#0A3F78] text-lg font-semibold">
            Explore more
          </a>
          <a href="#" className="flex h-14 w-44 items-center justify-center rounded-full bg-[#0D7BF0] text-lg font-semibold hover:bg-[#0a68cc]">
            Join Now
          </a>
        </div>
      </div>

      <img
        src="/images/hero.jpg"
        alt="Student boarding building"
        className="h-72 w-full rounded-2xl object-cover md:h-[400px]"
      />
    </section>
  );
}

function WhyChooseUs() {
  return (
    <section className="mx-auto mt-14 grid max-w-[1148px] gap-8 px-6 md:grid-cols-[330px_1fr] md:px-12">
      <div className="text-white">
        <p className="text-lg font-medium">WHY CHOOSE US?</p>
        <h2 className="mt-3 text-3xl font-bold leading-tight">
          Your Trusted Partner in <span className="text-[#D4A12A]">Student Housing</span>
        </h2>
        <p className="mt-4 text-[15px] leading-snug">
          At Boarding.lk, we make finding student accommodation simple, safe, and stress-free. Every listing is verified by our team, so you can search, compare, and connect with boarding owners near your campus with confidence.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:self-start">
        {stats.map((s) => (
          <div key={s.label} className="flex h-[127px] flex-col justify-end bg-[#0F5496] p-3 text-white">
            <StatIcon name={s.icon} />
            <div className="mt-1 text-[28px] font-bold leading-tight">{s.value}</div>
            <div className="text-sm leading-tight">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ListingCard({ item }) {
  const [liked, setLiked] = useState(false);
  return (
   <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-[#D9D9D9]">
      <img src={item.img} alt={item.type} className="h-[250px] w-full object-cover" />
      <div className="flex flex-1 flex-col px-5 pb-6 pt-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-[22px] font-bold text-black">{item.type}</h3>
            <p className="mt-1 flex items-start gap-2 text-sm text-gray-500">
              <span className="mt-0.5 shrink-0"><PinIcon size={20} /></span>
              <span>{item.place}</span>
            </p>
          </div>
          <button onClick={() => setLiked(!liked)} aria-pressed={liked} aria-label="Save listing" className="mr-1 mt-1">
            <HeartIcon filled={liked} />
          </button>
        </div>
        <p className="mt-5 mb-4 text-[22px] font-semibold text-black">{item.price}</p>
        <button className="mx-auto mt-auto block w-[78%] rounded-full bg-[#3A86D8] py-2.5 text-xl font-semibold text-white hover:bg-[#2f74c0]">
  View Details
</button>
      </div>
    </article>
  );
}

function RecentListings() {
  return (
    <section id="listings" className="mx-auto mt-16 max-w-[1148px] px-6 md:px-14">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Recent Listings</h2>
        <button aria-label="Next listings" className="mr-10 text-[40px] text-black hover:opacity-70">
  <FiArrowRightCircle strokeWidth={1.5} />
</button>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-14">
        {listings.map((l) => <ListingCard key={l.id} item={l} />)}
      </div>
    </section>
  );
}

function ReviewCard({ r }) {
  return (
    <figure className="relative rounded-2xl bg-[#D9D9D9] px-6 pb-4 pt-5">
      <div className="text-xl tracking-[0.35em] text-black" aria-label={`${r.stars} out of 5 stars`}>
        {"★".repeat(r.stars)}
      </div>
      <span className="absolute right-6 top-2 text-5xl font-black leading-none text-[#4B3FB5]" aria-hidden="true">❞</span>
      <blockquote className="mt-3 text-[15px] italic leading-snug text-[#333]">{r.text}</blockquote>
      <figcaption className="mt-4 text-[15px] italic text-[#333]">— {r.name}</figcaption>
    </figure>
  );
}

function Testimonials() {
  return (
    <section className="mx-auto mt-14 max-w-[1148px] px-6 pb-16 md:px-12">
      <h2 className="text-center text-3xl font-medium text-white">TESTIMONIALS</h2>
      <p className="mt-3 text-center font-semibold text-[#E5A82B]">Real experience and real stories of students</p>

      <div className="mx-auto mt-10 max-w-[860px]">
        <h3 className="mb-3 text-[15px] font-bold italic text-[#E5A82B]">Student testimonials</h3>
        <div className="grid gap-8 md:grid-cols-2 md:gap-20">
          {studentReviews.map((r) => <ReviewCard key={r.name} r={r} />)}
        </div>

        <h3 className="mb-3 mt-14 text-[15px] font-bold italic text-[#E5A82B]">Boarding owner testimonials</h3>
        <div className="grid gap-8 md:grid-cols-2 md:gap-20">
          {ownerReviews.map((r) => <ReviewCard key={r.name} r={r} />)}
        </div>
      </div>
    </section>
  );
}

export function Footer() {

  const social = [
  { name: "Twitter", icon: <FaTwitter />, color: "#000", href: "#" },
  { name: "Facebook", icon: <FaFacebookF />, color: "#1877F2", href: "#" },
  { name: "Instagram", icon: <FaInstagram />, color: "#E4405F", href: "#" },
  { name: "LinkedIn", icon: <FaLinkedinIn />, color: "#000", href: "#" },
];
  return (
    <footer className="bg-[#1B73C4] text-white">
      <div className="mx-auto grid max-w-[1148px] gap-8 px-6 pb-6 pt-8 md:grid-cols-[1.1fr_0.8fr_0.9fr_1.3fr] md:px-12">
        <div>
          <img src="/images/logo.png" alt="boarding.lk" className="h-14 w-auto" />
          <p className="mt-3 max-w-[230px] text-[15px] leading-snug">
            A smart boarding rental platform connecting university students with verified boarding owners across Sri Lanka.
          </p>
         <div className="mt-3 flex gap-3 pl-5">
  {social.map((s) => (
    <a
      key={s.name}
      href={s.href}
      aria-label={s.name}
      style={{ color: s.color }}
      className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px]"
    >
      {s.icon}
    </a>
  ))}
</div>
        </div>

        <div>
          <h4 className="font-bold">Quick Links</h4>
          <ul className="mt-3 space-y-2 pl-2 text-[15px]">
            <li>Home</li><li>About Us</li><li>FAQ</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold">Our Services</h4>
          <ul className="mt-3 space-y-2 text-[15px]">
            <li>Verified Listings</li><li>Reviews &amp; Ratings</li><li>Report a Problem</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold">Contact Info</h4>
          <ul className="mt-3 space-y-3 text-[15px]">
            <li className="flex gap-3"><PinIcon size={22} />University of Sri Jayewardenepura, Gangodawila, Nugegoda</li>
            <li className="flex items-center gap-3"><PhoneIcon />+94 77 123 4567</li>
            <li className="flex items-center gap-3"><MailIcon />hello@boarding.lk</li>
          </ul>
        </div>
      </div>

      <div className="px-6 pb-4 pt-6 text-center text-[15px] leading-snug">
        <p>© 2026 Boarding.lk. All rights reserved.</p>
        <p>Privacy Policy · Terms of Service</p>
      </div>
    </footer>
  );
}


/* ---------- Page ---------- */
export function Home()  {
  return (
    <div className="bg-linear-to-b from-[#0A4682] from-40% to-[#1B73C4] font-['Albert_Sans',sans-serif]">
      <Navbar />
      <main>
        <Hero />
        <WhyChooseUs />
        <RecentListings />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
