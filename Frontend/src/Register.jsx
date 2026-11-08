import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "./App.jsx";
import { homeFor } from "./roles.js";

const roles = [
  { value: "student", label: "Student" },
  { value: "owner", label: "Boarding owner" },
];

const fieldClass =
  "mt-2 w-full rounded-lg bg-[#D9D9D9] px-4 py-3 text-lg text-black outline-none focus:ring-2 focus:ring-[#E5B95C]";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ role: "student", name: "", email: "", phone: "", password: "" });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Temporary: send `form` to your backend here (POST /register).
    // For now the new user is saved in the browser and signed in.
    const user = { name: form.name, email: form.email, phone: form.phone, role: form.role };
    localStorage.setItem("user", JSON.stringify(user));
    navigate(homeFor[form.role]);
  };

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-[#0A4682] from-40% to-[#1B73C4] font-['Albert_Sans',sans-serif] text-white">
      <main className="flex flex-1 justify-center px-4 pb-20 pt-10 md:pt-16">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[760px] rounded-xl bg-linear-to-b from-[#0F5CA6] via-[#0A3A6E] to-[#05234A] px-6 py-10 md:px-0"
        >
          <div className="mx-auto w-full max-w-[420px]">
            <Link to="/" className="flex justify-center">
              <img src="/images/logo.png" alt="boarding.lk" className="h-24 w-auto object-contain" />
            </Link>

            <h1 className="mt-4 text-center text-3xl font-bold text-[#E5B95C] md:text-4xl">Create Your Account</h1>

            <fieldset className="mt-12">
              <legend className="text-lg font-bold">Select your role</legend>
              <div className="mt-4 space-y-3">
                {roles.map((r) => (
                  <label key={r.value} className="flex cursor-pointer items-center gap-3 text-lg">
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={form.role === r.value}
                      onChange={update("role")}
                      className="h-5 w-5 accent-[#1B73C4]"
                    />
                    {r.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-10 space-y-6">
              <label className="block text-lg font-bold">
                Full Name
                <input type="text" value={form.name} onChange={update("name")} required autoComplete="name" className={fieldClass} />
              </label>
              <label className="block text-lg font-bold">
                E-mail Address
                <input type="email" value={form.email} onChange={update("email")} required autoComplete="email" className={fieldClass} />
              </label>
              <label className="block text-lg font-bold">
                Phone Number
                <input type="tel" value={form.phone} onChange={update("phone")} required autoComplete="tel" className={fieldClass} />
              </label>
              <label className="block text-lg font-bold">
                Password
                <input
                  type="password"
                  value={form.password}
                  onChange={update("password")}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className={fieldClass}
                />
              </label>
            </div>

            <button className="mt-10 w-full rounded-lg bg-[#869BB0] py-3 text-xl font-bold text-[#0A4682] hover:bg-[#9aadc0]">
              SignUp
            </button>

            <p className="mt-12 text-center text-lg">
              Already have an account?{" "}
              <Link to="/login" className="text-[#E5B95C] hover:underline">Login</Link>
            </p>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
