import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiCheck, FiChevronDown, FiUser } from "react-icons/fi";
import { Footer } from "./App.jsx";

const propertyTypes = ["Single Room", "Twin Room", "Shared Room", "Shared Dorm"];
const rentPeriods = ["Monthly", "Weekly", "Daily"];
const facilityOptions = ["WiFi", "AC", "Kitchen", "Parking", "Attached washroom", "Meal provided", "Cooking allowed"];
const genderOptions = ["Male", "Female"];

const inputClass =
  "w-full rounded-lg border border-black/20 bg-[#D9D9D9] px-5 py-3.5 text-lg text-black outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-[#E5B95C]";
const labelClass = "mb-2 block text-lg font-bold";

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-4 text-lg font-bold">
      <span className="relative h-11 w-11 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer h-full w-full cursor-pointer appearance-none rounded-lg border border-black/20 bg-[#D9D9D9] checked:bg-[#3A86D8]"
        />
        <FiCheck className="pointer-events-none absolute inset-0 m-auto hidden text-2xl text-white peer-checked:block" />
      </span>
      {label}
    </label>
  );
}

export default function CreateListing() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    title: "",
    address: "",
    description: "",
    propertyType: propertyTypes[0],
    rent: "",
    rentPeriod: rentPeriods[0],
    facilities: [],
    genderPreference: [],
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const toggle = (field, value) =>
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value) ? f[field].filter((v) => v !== value) : [...f[field], value],
    }));

  // Thumbnails for the chosen images (released when the selection changes)
  const previews = useMemo(() => images.map((file) => URL.createObjectURL(file)), [images]);
  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);

  function logout() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  function save(status) {
    // Images need FormData, so the backend should accept multipart/form-data.
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      data.append(key, Array.isArray(value) ? JSON.stringify(value) : value)
    );
    data.append("status", status);
    images.forEach((file) => data.append("images", file));

    // TODO: send `data` to your backend, for example:
    // await fetch(`${API_URL}/listings`, { method: "POST", body: data, headers: { Authorization: `Bearer ${token}` } });
    console.log("Listing", status, Object.fromEntries(data.entries()));

    setMessage(status === "published" ? "Listing published (demo only, not saved to a server yet)." : "Draft saved (demo only).");
    if (status === "published") setTimeout(() => navigate("/owner-home"), 1500);
  }

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-[#0A4682] from-40% to-[#1B73C4] font-['Albert_Sans',sans-serif] text-white">
      {/* Top bar */}
      <header className="border-b border-white/40">
        <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-4 px-6 py-6 md:px-12">
          <div className="flex flex-wrap items-center gap-6 md:gap-12">
            <Link to="/owner-home">
              <img src="/images/logo.png" alt="boarding.lk" className="h-[60px] w-[140px] object-contain md:h-[90px] md:w-[220px]" />
            </Link>
            <h1 className="text-2xl font-bold text-[#E5B95C] md:text-4xl">Create New Listing</h1>
          </div>

          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5B800]">
                <FiUser className="text-3xl text-white" />
              </span>
              <span className="text-xl">Owner</span>
              <FiChevronDown />
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-10 mt-2 w-44 overflow-hidden rounded-lg bg-white text-black shadow-lg">
                <Link to="/owner-home" className="block px-4 py-2 hover:bg-gray-100">My Home</Link>
                <button onClick={logout} className="block w-full px-4 py-2 text-left hover:bg-gray-100">Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="flex-1">
        <form
          onSubmit={(e) => { e.preventDefault(); save("published"); }}
          className="mx-auto grid w-full max-w-[1280px] gap-x-16 gap-y-8 px-6 py-10 md:grid-cols-2 md:px-12"
        >
          {/* Left column */}
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className={labelClass}>Title</label>
              <input id="title" value={form.title} onChange={update("title")} required className={inputClass} />
            </div>
            <div>
              <label htmlFor="address" className={labelClass}>Boarding Map Location</label>
              <input id="address" value={form.address} onChange={update("address")} placeholder="Address" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="description" className={labelClass}>Description</label>
              <textarea id="description" rows={3} value={form.description} onChange={update("description")} className={inputClass} />
            </div>

            <fieldset className="pt-4">
              <legend className="mb-6 text-lg font-bold">Facilities</legend>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {facilityOptions.map((f) => (
                  <Checkbox key={f} label={f} checked={form.facilities.includes(f)} onChange={() => toggle("facilities", f)} />
                ))}
              </div>
            </fieldset>

            <Link
              to="/owner-home"
              className="mt-6 inline-block w-40 rounded-lg bg-[#8CBBEB] py-3.5 text-center text-xl font-bold text-black hover:bg-[#79aee4]"
            >
              Back
            </Link>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div>
              <label htmlFor="type" className={labelClass}>Property Type</label>
              <select id="type" value={form.propertyType} onChange={update("propertyType")} className={inputClass}>
                {propertyTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="rent" className={labelClass}>Rent(Rs)</label>
              <div className="flex gap-4">
                <input
                  id="rent"
                  type="number"
                  min="0"
                  value={form.rent}
                  onChange={update("rent")}
                  placeholder="Amount"
                  required
                  className={inputClass}
                />
                <select aria-label="Rent period" value={form.rentPeriod} onChange={update("rentPeriod")} className={`${inputClass} max-w-[200px]`}>
                  {rentPeriods.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <fieldset className="pt-4">
              <legend className="mb-4 text-lg font-bold">Gender preference</legend>
              <div className="flex gap-12">
                {genderOptions.map((g) => (
                  <Checkbox key={g} label={g} checked={form.genderPreference.includes(g)} onChange={() => toggle("genderPreference", g)} />
                ))}
              </div>
              <p className="mt-2 text-sm text-white/80">Leave both unticked, or tick both, if anyone can apply.</p>
            </fieldset>

            <div className="rounded-lg border border-black/20 bg-[#D9D9D9] p-4 text-black">
              <p className="text-lg font-bold">Upload images</p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <label className="cursor-pointer rounded-xl bg-[#8CBBEB] px-8 py-3 text-lg hover:bg-[#79aee4]">
                  Choose images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(e) => setImages(Array.from(e.target.files))}
                  />
                </label>
                <span className="flex-1 text-center">
                  {images.length === 0 ? "No image chosen" : `${images.length} image${images.length > 1 ? "s" : ""} chosen`}
                </span>
              </div>
              {previews.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {previews.map((src, i) => (
                    <img key={src} src={src} alt={`Selected ${i + 1}`} className="h-16 w-16 rounded-md object-cover" />
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-8 pt-4">
              <button
                type="button"
                onClick={() => save("draft")}
                className="w-48 rounded-xl border-2 border-black bg-[#D9D9D9] py-4 text-lg text-black hover:bg-white"
              >
                Save as Draft
              </button>
              <button className="w-48 rounded-xl bg-[#8CBBEB] py-4 text-xl font-bold text-black hover:bg-[#79aee4]">
                Publish
              </button>
            </div>

            {message && <p role="status" className="font-semibold text-[#E5B95C]">{message}</p>}
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
