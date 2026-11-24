import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiEdit2,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCheckCircle,
  FiCreditCard,
  FiFileText,
  FiSave,
  FiX,
} from "react-icons/fi";
import DashboardLayout from "./DashboardLayout.jsx";
import { profileApi } from "./api.js";

const inputClass =
  "w-full rounded-md border border-gray-300 bg-[#D9D9D9] px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-[#F5C400]";

function getInitialProfile(role) {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {}

  if (role === "student") {
    return {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      age: "",
      university: "",
      year: "",
      faculty: "",
    };
  }

  return {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    nic: "",
    location: "",
    verified: false,
    plan: "Basic Plan",
  };
}

function ProfileAvatar({ size = "large" }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-[#F5B800] ${
        size === "large" ? "h-24 w-24" : "h-20 w-20"
      }`}
    >
      <FiUser className="text-5xl text-white" />
    </div>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-1 shrink-0 text-xl text-[#F5C400]" />

      <div className="min-w-0">
        <p className="text-sm font-semibold text-white/80">
          {label}
        </p>

        <p className="break-words text-base text-white">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

export default function UserProfile({
  role = "student",
  editMode = false,
}) {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(() =>
    getInitialProfile(role)
  );

  const isStudent = role === "student";

  const isTesting =
    window.location.pathname.startsWith("/test-");

  const profilePath = isTesting
    ? `/test-${role}-profile`
    : `/${role}-profile`;

  const editPath = isTesting
    ? `/test-${role}-profile/edit`
    : `/${role}-profile/edit`;

  useEffect(() => {
    let mounted = true;
    profileApi
      .get()
      .then((data) => {
        if (mounted && data) {
          setProfile((prev) => ({
            ...prev,
            ...data,
          }));
        }
      })
      .catch((err) => {
        console.warn("Could not fetch profile from backend:", err);
      });

    return () => {
      mounted = false;
    };
  }, [role]);

  function updateField(field, value) {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function saveProfile(e) {
    e.preventDefault();

    try {
      const updated = await profileApi.update(profile);
      if (updated) {
        setProfile((prev) => ({ ...prev, ...updated }));
        try {
          const user = JSON.parse(localStorage.getItem("user")) || {};
          user.name = updated.name;
          user.email = updated.email;
          user.phone = updated.phone;
          localStorage.setItem("user", JSON.stringify(user));
        } catch {}
      }

      navigate(profilePath, {
        state: { updated: true },
      });
    } catch (err) {
      alert(err.message || "Failed to update profile. Please try again.");
    }
  }

  const universities = [
    "University of Sri Jayewardenepura",
    "University of Colombo",
    "University of Moratuwa",
    "University of Kelaniya",
    "University of Peradeniya",
    "University of Ruhuna",
    "Other",
  ];

  const faculties = [
    "Faculty of Computing",
    "Faculty of Engineering",
    "Faculty of Management Studies and Commerce",
    "Faculty of Applied Sciences",
    "Faculty of Humanities and Social Sciences",
    "Faculty of Medicine",
    "Other",
  ];

  // =========================================
  // EDIT PROFILE PAGE
  // =========================================

  if (editMode) {
    return (
      <DashboardLayout role={role}>
        <div className="mx-auto max-w-5xl">

          <h1 className="mb-8 text-3xl font-bold text-[#E5B95C]">
            My Profile
          </h1>

          <form
            onSubmit={saveProfile}
            className="grid gap-10 lg:grid-cols-2"
          >

            {/* LEFT SIDE */}
            <div className="flex flex-col items-center gap-5 pt-3">

              <ProfileAvatar />

              <h2 className="text-xl font-bold">
                {profile.name || "User"}
              </h2>

              <p className="text-white/80">
                {isStudent
                  ? "Registered Student"
                  : "Boarding Owner"}
              </p>

              <button
                type="button"
                onClick={() => navigate(profilePath)}
                className="flex items-center gap-2 bg-[#65A9E0] px-6 py-2 text-white hover:bg-[#4B94CF]"
              >
                <FiX />
                Cancel
              </button>

            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-4">

              <div>
                <label className="mb-1 block font-semibold">
                  Full Name
                </label>

                <input
                  required
                  value={profile.name}
                  onChange={(e) =>
                    updateField("name", e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              {isStudent && (
                <div>
                  <label className="mb-1 block font-semibold">
                    Age
                  </label>

                  <input
                    type="number"
                    min="16"
                    max="100"
                    placeholder="Enter your age"
                    value={profile.age}
                    onChange={(e) =>
                      updateField("age", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block font-semibold">
                  Email
                </label>

                <input
                  required
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    updateField("email", e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold">
                  Phone
                </label>

                <input
                  required
                  type="tel"
                  value={profile.phone}
                  onChange={(e) =>
                    updateField("phone", e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              {isStudent ? (
                <>

                  <div>
                    <label className="mb-1 block font-semibold">
                      University
                    </label>

                    <select
                      value={profile.university}
                      onChange={(e) =>
                        updateField("university", e.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="">
                        Select University
                      </option>

                      {universities.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block font-semibold">
                      Year of Study
                    </label>

                    <select
                      value={profile.year}
                      onChange={(e) =>
                        updateField("year", e.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="">
                        Select Year
                      </option>

                      {[
                        "1st Year",
                        "2nd Year",
                        "3rd Year",
                        "4th Year",
                        "5th Year",
                      ].map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block font-semibold">
                      Faculty
                    </label>

                    <select
                      value={profile.faculty}
                      onChange={(e) =>
                        updateField("faculty", e.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="">
                        Select Faculty
                      </option>

                      {faculties.map((faculty) => (
                        <option key={faculty} value={faculty}>
                          {faculty}
                        </option>
                      ))}
                    </select>
                  </div>

                </>
              ) : (
                <>

                  <div>
                    <label className="mb-1 block font-semibold">
                      NIC Number
                    </label>

                    <input
                      required
                      value={profile.nic}
                      onChange={(e) =>
                        updateField("nic", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-semibold">
                      Location
                    </label>

                    <input
                      placeholder="Enter your location"
                      value={profile.location}
                      onChange={(e) =>
                        updateField("location", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>

                </>
              )}

              <button
                type="submit"
                className="mt-4 flex items-center gap-2 bg-[#65A9E0] px-7 py-3 font-semibold text-white hover:bg-[#4B94CF]"
              >
                <FiSave />
                Save Changes
              </button>

            </div>
          </form>
        </div>
      </DashboardLayout>
    );
  }

  // =========================================
  // STUDENT PROFILE SUMMARY
  // =========================================

  if (isStudent) {
    return (
      <DashboardLayout role="student">
        <div className="mx-auto max-w-5xl">

          <h1 className="mb-2 text-3xl font-bold text-[#E5B95C]">
            My Profile
          </h1>

          <p className="mb-8 text-white/80">
            View and manage your student information.
          </p>

          <div className="overflow-hidden rounded-lg bg-[#1B73C4] shadow-lg">

            <div className="grid gap-8 p-8 md:grid-cols-[230px_1fr]">

              {/* STUDENT AVATAR */}
              <div className="flex flex-col items-center gap-4 border-white/20 md:border-r md:pr-8">

                <ProfileAvatar />

                <h2 className="text-center text-2xl font-bold">
                  {profile.name || "Student"}
                </h2>

                <p className="text-center text-sm text-white/80">
                  Registered Student
                </p>

                <Link
                  to={editPath}
                  className="flex items-center gap-2 bg-[#65A9E0] px-6 py-2 font-semibold hover:bg-[#4B94CF]"
                >
                  <FiEdit2 />
                  Edit Profile
                </Link>

              </div>

              {/* STUDENT DETAILS */}
              <div className="grid gap-6 sm:grid-cols-2">

                <Detail
                  icon={FiUser}
                  label="Full Name"
                  value={profile.name}
                />

                <Detail
                  icon={FiUser}
                  label="Age"
                  value={profile.age}
                />

                <Detail
                  icon={FiMail}
                  label="Email"
                  value={profile.email}
                />

                <Detail
                  icon={FiPhone}
                  label="Phone"
                  value={profile.phone}
                />

                <Detail
                  icon={FiMapPin}
                  label="University"
                  value={profile.university}
                />

                <Detail
                  icon={FiFileText}
                  label="Year of Study"
                  value={profile.year}
                />

                <Detail
                  icon={FiFileText}
                  label="Faculty"
                  value={profile.faculty}
                />

              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // =========================================
  // OWNER PROFILE SUMMARY
  // =========================================

  return (
    <DashboardLayout role="owner">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold text-[#E5B95C]">
          My Profile
        </h1>

        <p className="mb-8 text-white/80">
          View and manage your profile information.
        </p>

        <div className="rounded-lg bg-[#1B73C4] p-8 shadow-lg">

          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">

            {/* OWNER AVATAR */}
            <div className="flex flex-col items-center justify-center gap-4 border-white/30 lg:border-r lg:pr-8">

              <ProfileAvatar />

              <h2 className="text-center text-2xl font-bold">
                {profile.name || "Owner"}
              </h2>

              <p className="text-sm text-white/80">
                Boarding Owner
              </p>

              <Link
                to={editPath}
                className="flex items-center gap-2 bg-[#65A9E0] px-6 py-2 font-semibold hover:bg-[#4B94CF]"
              >
                <FiEdit2 />
                Edit Profile
              </Link>

            </div>

            {/* OWNER DETAILS */}
            <div className="grid gap-7 sm:grid-cols-2">

              <Detail
                icon={FiUser}
                label="Name"
                value={profile.name}
              />

              <Detail
                icon={FiCreditCard}
                label="NIC Number"
                value={profile.nic}
              />

              <Detail
                icon={FiMail}
                label="Email"
                value={profile.email}
              />

              <div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-[#F5C400]" />

                  <span className="font-semibold">
                    Verified Status
                  </span>
                </div>

                <span className="mt-2 inline-block rounded-full bg-[#65A9E0] px-4 py-1 text-sm">
                  {profile.verified
                    ? "Verified"
                    : "Not Verified"}
                </span>
              </div>

              <Detail
                icon={FiPhone}
                label="Phone"
                value={profile.phone}
              />

              <div>
                <div className="flex items-center gap-2">
                  <FiFileText className="text-[#F5C400]" />

                  <span className="font-semibold">
                    Listing Plan
                  </span>
                </div>

                <p className="mt-2">
                  {profile.plan || "Basic Plan"}
                </p>

                <span className="mt-2 inline-block rounded-full bg-[#65A9E0] px-4 py-1 text-sm">
                  {profile.plan || "Basic Plan"}
                </span>
              </div>

              <Detail
                icon={FiMapPin}
                label="Location"
                value={profile.location}
              />

            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
