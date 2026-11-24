import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import { Footer } from "./App.jsx";
import { homeFor } from "./roles.js";
import { authApi } from "./api.js";

const socials = [
  { name: "Google", icon: <FaGoogle /> },
  { name: "Facebook", icon: <FaFacebookF /> },
  { name: "Apple", icon: <FaApple /> },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // The backend checks the password and decides the role from the real account.
      const { user } = await authApi.login(email, password);
      localStorage.setItem("user", JSON.stringify(user));
      navigate(homeFor[user.role]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-[#0A4682] from-40% to-[#1B73C4] font-['Albert_Sans',sans-serif] text-white">
      <header className="mx-auto w-full max-w-[1148px] px-6 pb-6 pt-8 md:px-12">
        <Link to="/">
          <img src="/images/logo.png" alt="boarding.lk" className="h-[60px] w-[140px] object-contain md:h-[105px] md:w-[253px]" />
        </Link>
      </header>

      <main className="flex flex-1 items-start justify-center px-6 pb-20 pt-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[560px] bg-linear-to-b from-[#0F5CA6] to-[#1478D8] px-8 py-10 md:px-10"
        >
          <h1 className="text-3xl font-bold">Welcome Back!</h1>
          <p className="mt-3 text-lg">Login to your account</p>

          <div className="mt-12 space-y-6">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or Phone Number"
              aria-label="Email or phone number"
              required
              className="w-full rounded-lg border border-black bg-[#D9D9D9] px-5 py-3.5 text-lg text-black outline-none placeholder:text-gray-600"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              aria-label="Password"
              required
              className="w-full rounded-lg border border-black bg-[#D9D9D9] px-5 py-3.5 text-lg text-black outline-none placeholder:text-gray-600"
            />
          </div>

          <div className="mt-5 text-right">
            <Link to="/reset-password" className="text-sm font-semibold hover:underline">
              Forgot password?
            </Link>
          </div>

          {error && (
            <p role="alert" className="mt-5 rounded-lg bg-red-100 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="mt-6 w-full rounded-lg border border-black bg-white py-3.5 text-lg font-bold text-black hover:bg-gray-100 disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-6 text-center text-lg">Or continue with</p>
          <div className="mt-5 flex justify-center gap-6">
            {socials.map((s) => (
              <button
                key={s.name}
                type="button"
                aria-label={`Continue with ${s.name}`}
                className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-black bg-white text-2xl text-black hover:bg-gray-100"
              >
                {s.icon}
              </button>
            ))}
          </div>

          <p className="mt-8 text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="font-bold hover:underline">Register</Link>
          </p>
        </form>
      </main>

      <Footer />
    </div>
  );
}
