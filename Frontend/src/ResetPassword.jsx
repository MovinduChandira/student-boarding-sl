import { useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "./App.jsx";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Send reset link to:", email); // TODO: call your backend here
    setSent(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-[#0A4682] from-60% to-[#1B73C4] font-['Albert_Sans',sans-serif]">
      {/* Header: logo only, links back to home */}
      <header className="mx-auto w-full max-w-[1148px] px-6 pb-6 pt-8 md:px-12">
        <Link to="/">
          <img src="/images/logo.png" alt="boarding.lk" className="h-[60px] w-[140px] object-contain md:h-[105px] md:w-[253px]" />
        </Link>
      </header>

      {/* Reset card */}
      <main className="flex flex-1 items-start justify-center px-4 pb-24 pt-4">
        <div className="min-h-[440px] w-full max-w-[500px] bg-linear-to-b from-[#0E5BA8] to-[#1479DC] px-6 py-10 text-white sm:px-8">
          <h1 className="mt-4 text-3xl font-bold">Reset Password</h1>
          <p className="mt-5 max-w-[400px] text-base leading-snug text-blue-100">
            Enter your email and we’ll send you a link to reset your password
          </p>

          <form onSubmit={handleSubmit} className="mt-14">
            <label htmlFor="email" className="block text-base">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setSent(false); }}
              className="mt-3 w-full rounded-xl border border-black/70 bg-[#D9D9D9] px-5 py-4 text-lg text-gray-800 outline-none focus:ring-2 focus:ring-white"
              required
            />

            <button
              type="submit"
              className="mt-14 w-full rounded-xl border border-black/70 bg-white py-4 text-lg font-bold text-black hover:bg-gray-100"
            >
              Send Reset Link
            </button>
          </form>

          {sent && (
            <p role="status" className="mt-4 text-center text-sm text-amber-300">
              If an account exists for that email, a reset link has been sent.
            </p>
          )}

          <p className="mt-6 text-center">
            <Link to="/login" className="font-semibold text-blue-100 hover:underline">Back to Login</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
