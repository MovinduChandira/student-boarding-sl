import { Link, Navigate, useNavigate } from "react-router-dom";
import { Footer } from "./App.jsx";

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();

  // Not logged in -> send to the login page
  if (!user) return <Navigate to="/login" replace />;

  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-[#0A4682] from-40% to-[#1B73C4] font-['Albert_Sans',sans-serif]">
      {/* Top bar */}
      <header className="mx-auto flex w-full max-w-[1148px] items-center justify-between px-6 pb-6 pt-8 md:px-12">
        <Link to="/">
          <img
            src="/images/logo.png"
            alt="boarding.lk"
            className="h-[60px] w-[140px] object-contain md:h-[105px] md:w-[253px]"
          />
        </Link>
        <button
          onClick={handleLogout}
          className="rounded-full bg-[#EFD08A] px-8 py-3 text-lg font-bold text-black hover:bg-[#e6c26e] md:px-12"
        >
          Logout
        </button>
      </header>

      {/* Welcome card */}
      <main className="flex flex-1 items-start justify-center px-6 py-10 md:py-16">
        <section className="w-full max-w-[900px] bg-linear-to-b from-[#0F5CA6] to-[#1478D8] px-6 py-16 text-center text-white md:py-24">
          <h1 className="text-3xl font-bold md:text-5xl">
            Welcome to <span className="text-[#E5B95C]">Boarding.lk</span>
          </h1>
          <p className="mt-4 text-xl font-semibold">Hello, {user.name}</p>
          <p className="mx-auto mt-8 max-w-md font-semibold">
            You are logged in. Find verified student boarding near your campus.
          </p>
          <Link
            to="/"
            className="mt-10 inline-block rounded-full bg-[#8CBBEB] px-10 py-4 text-lg font-bold text-black hover:bg-[#79aee4]"
          >
            Browse Listings
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}