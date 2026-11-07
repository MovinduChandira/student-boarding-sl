import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import { Footer } from "./App.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", email); // TODO: call your backend here
    // Placeholder user until you have a backend
  const user = { name: "User", email: "user@example.com" };
  localStorage.setItem("user", JSON.stringify(user));
  navigate("/dashboard");
  };

  const socials = [
    { name: "Google", icon: <FaGoogle /> },
    { name: "Facebook", icon: <FaFacebookF /> },
    { name: "Apple", icon: <FaApple /> },
  ];

  const input =
    "w-full rounded-xl border border-black/70 bg-[#D9D9D9] px-5 py-4 text-lg text-gray-800 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-white";

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-[#0A4682] from-60% to-[#1B73C4] font-['Albert_Sans',sans-serif]">
      {/* Header: logo only, links back to home */}
      <header className="mx-auto w-full max-w-[1148px] px-6 pb-6 pt-8 md:px-12">
        <Link to="/">
          <img src="/images/logo.png" alt="boarding.lk" className="h-[60px] w-[140px] object-contain md:h-[105px] md:w-[253px]" />
        </Link>
      </header>

      {/* Login card */}
      <main className="flex flex-1 items-start justify-center px-4 pb-24 pt-4">
        <div className="min-h-[520px] w-full max-w-[560px] bg-linear-to-b from-[#0E5BA8] to-[#1479DC] px-6 py-8 text-white sm:px-8">
          <h1 className="text-3xl font-bold">Welcome Back!</h1>
          <p className="mt-6 px-2 text-lg text-blue-100">Login to your account</p>

          <form onSubmit={handleSubmit} className="mt-14">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or Phone Number"
              aria-label="Email or Phone Number"
              className={input}
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              aria-label="Password"
              className={`${input} mt-8`}
              required
            />
            <div className="mt-5 text-right">
              <Link to="/reset-password" className="text-sm font-semibold hover:underline">Forgot password?</Link>
            </div>

            <button
              type="submit"
              className="mt-8 w-full rounded-xl border border-black/70 bg-white py-4 text-lg font-bold text-black hover:bg-gray-100"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-lg">Or continue with</p>
          <div className="mt-6 flex justify-center gap-8">
            {socials.map((s) => (
              <button
                key={s.name}
                type="button"
                aria-label={`Continue with ${s.name}`}
                className="flex h-[62px] w-[62px] items-center justify-center rounded-full border-2 border-black bg-white text-3xl text-black hover:bg-gray-100"
              >
                {s.icon}
              </button>
            ))}
          </div>

          <p className="mt-10 text-center">
            Don’t have an account?{" "}
            <a href="#" className="ml-1 font-bold hover:underline">Register</a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
