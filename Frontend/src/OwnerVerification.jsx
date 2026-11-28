import { useState } from "react";

import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCheckCircle,
  FiShield,
  FiSearch,
} from "react-icons/fi";

import DashboardLayout from "./DashboardLayout.jsx";

import {
  owners,
  verificationCriteria,
} from "./ownersData.js";

import {
  getOwnerVerification,
  saveOwnerVerification,
} from "./ownerVerificationStorage.js";

export default function OwnerVerification() {
  const [records, setRecords] = useState(() =>
    Object.fromEntries(
      owners.map((owner) => [
        owner.id,
        getOwnerVerification(owner.id),
      ])
    )
  );

  const [activeTab, setActiveTab] = useState("Pending");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  const tabs = ["Pending", "Verified", "Rejected"];

  function updateRecord(ownerId, changes) {
    const updated = {
      ...records[ownerId],
      ...changes,
    };

    setRecords((previous) => ({
      ...previous,
      [ownerId]: updated,
    }));
  }

  function updateCheckbox(ownerId, criterionId, checked) {
    updateRecord(ownerId, {
      checks: {
        ...records[ownerId].checks,
        [criterionId]: checked,
      },
    });
  }

  function changeStatus(ownerId, status) {
    const record = records[ownerId];

    const allChecked = verificationCriteria.every(
      (criterion) => record.checks[criterion.id] === true
    );

    if (status === "Verified" && !allChecked) {
      return;
    }

    const updated = {
      ...record,
      status,
      ...(status === "Pending" ? { checks: {} } : {}),
    };

    const saved = saveOwnerVerification(ownerId, updated);

    if (!saved) return;

    setRecords((previous) => ({
      ...previous,
      [ownerId]: updated,
    }));

    const owner = owners.find(
      (item) => item.id === ownerId
    );

    setMessage(
      status === "Verified"
        ? `${owner.name} has been verified successfully.`
        : status === "Rejected"
        ? `${owner.name}'s verification has been rejected.`
        : `${owner.name}'s verification has been reopened.`
    );
  }

  const visibleOwners = owners.filter((owner) => {
    const matchesStatus =
      records[owner.id].status === activeTab;

    const matchesSearch =
      `${owner.name} ${owner.id} ${owner.location}`
        .toLowerCase()
        .includes(query.trim().toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout role="admin">

      {/* PAGE HEADING */}

      <div className="mb-8">

        <h1 className="flex items-center gap-3 text-3xl font-bold text-[#E5B95C] md:text-4xl">
          <FiShield />
          Owner Verification
        </h1>

        <p className="mt-3 text-white/80">
          Review boarding owners and complete the
          verification requirements.
        </p>

      </div>

      {/* STATUS SUMMARY */}

      <div className="mb-8 grid gap-4 sm:grid-cols-3">

        {tabs.map((tab) => {
          const count = owners.filter(
            (owner) => records[owner.id].status === tab
          ).length;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setMessage("");
              }}
              className={`border p-5 text-left transition-colors ${
                activeTab === tab
                  ? "border-[#F5C400] bg-[#1565B8]"
                  : "border-white/30 bg-[#3886C8]"
              }`}
            >

              <p className="font-semibold text-white">
                {tab} Owners
              </p>

              <p className="mt-2 text-3xl font-bold text-[#F5C400]">
                {count}
              </p>

            </button>
          );
        })}

      </div>

      {/* SEARCH BAR */}

      <label className="mb-6 flex items-center gap-3 rounded-lg bg-white px-4 py-3 text-gray-800">

        <FiSearch size={22} />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by owner name or ID..."
          className="w-full outline-none"
        />

      </label>

      {/* STATUS MESSAGE */}

      {message && (
        <div
          role="status"
          className="mb-6 flex items-center gap-3 rounded-md border border-white/30 bg-[#104D87] p-4 text-white"
        >
          <FiCheckCircle className="text-[#F5C400]" />
          {message}
        </div>
      )}

      <h2 className="mb-5 text-2xl font-bold text-[#E5B95C]">
        {activeTab} Owners ({visibleOwners.length})
      </h2>

      {/* OWNER LIST */}

      <div className="space-y-6">

        {visibleOwners.length === 0 && (
          <div className="border border-white/30 bg-[#3886C8] p-8 text-center">
            No {activeTab.toLowerCase()} owners found.
          </div>
        )}

        {visibleOwners.map((owner) => {
          const record = records[owner.id];

          const completed = verificationCriteria.filter(
            (criterion) =>
              record.checks[criterion.id] === true
          ).length;

          const allChecked =
            completed === verificationCriteria.length;

          const pending = record.status === "Pending";

          return (
            <article
              key={owner.id}
              className="border border-white/30 bg-[#3886C8] p-5 md:p-7"
            >

              {/* OWNER INFORMATION */}

              <div className="flex flex-wrap items-start gap-5">

                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#F5B800]">

                  <FiUser size={42} />

                </div>

                <div className="min-w-0 flex-1">

                  <h3 className="text-2xl font-bold">
                    {owner.name}
                  </h3>

                  <p className="mt-1 text-sm text-white/80">
                    Owner ID: {owner.id}
                  </p>

                  <div className="mt-4 space-y-2 text-sm">

                    <p className="flex items-center gap-2">
                      <FiMail className="text-[#F5C400]" />
                      {owner.email}
                    </p>

                    <p className="flex items-center gap-2">
                      <FiPhone className="text-[#F5C400]" />
                      {owner.phone}
                    </p>

                    <p className="flex items-center gap-2">
                      <FiMapPin className="text-[#F5C400]" />
                      {owner.location}
                    </p>

                  </div>

                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    record.status === "Verified"
                      ? "bg-green-600 text-white"
                      : record.status === "Rejected"
                      ? "bg-red-600 text-white"
                      : "bg-[#E5B95C] text-black"
                  }`}
                >
                  {record.status}
                </span>

              </div>

              {/* VERIFICATION CHECKLIST */}

              <div className="mt-6 border-t border-white/30 pt-6">

                <h4 className="mb-5 text-xl font-bold text-[#F5D080]">
                  Verification Criteria
                </h4>

                <div className="grid gap-4 lg:grid-cols-2">

                  {verificationCriteria.map((criterion) => (
                    <label
                      key={criterion.id}
                      className="flex items-center gap-3 bg-[#0A4682]/40 p-3"
                    >

                      <input
                        type="checkbox"
                        checked={!!record.checks[criterion.id]}
                        disabled={!pending}
                        onChange={(e) =>
                          updateCheckbox(
                            owner.id,
                            criterion.id,
                            e.target.checked
                          )
                        }
                        className="h-5 w-5 accent-[#F5C400]"
                      />

                      <span>{criterion.label}</span>

                    </label>
                  ))}

                </div>

                {/* PROGRESS BAR */}

                <p className="mb-2 mt-5 text-sm">
                  {completed} of {verificationCriteria.length}
                  {" "}criteria completed
                </p>

                <div className="h-2 overflow-hidden rounded-full bg-[#0A4682]">

                  <div
                    className="h-full bg-[#F5C400] transition-all"
                    style={{
                      width: `${
                        (completed /
                          verificationCriteria.length) *
                        100
                      }%`,
                    }}
                  />

                </div>

                {/* ADMIN REMARKS */}

                <label className="mt-6 block font-semibold">
                  Admin Remarks

                  <textarea
                    value={record.remarks}
                    disabled={!pending}
                    onChange={(e) =>
                      updateRecord(owner.id, {
                        remarks: e.target.value,
                      })
                    }
                    placeholder="Enter verification remarks..."
                    rows={3}
                    className="mt-2 w-full rounded-md bg-white p-3 font-normal text-gray-800 outline-none"
                  />

                </label>

                {/* ACTION BUTTONS */}

                <div className="mt-6 flex flex-wrap gap-3">

                  {pending ? (
                    <>

                      <button
                        type="button"
                        disabled={!allChecked}
                        onClick={() =>
                          changeStatus(owner.id, "Verified")
                        }
                        className="flex items-center gap-2 rounded-md bg-[#F5B800] px-6 py-3 font-bold text-[#0A4682] hover:bg-[#FFD34D] disabled:cursor-not-allowed disabled:opacity-40"
                      >

                        <FiCheckCircle />
                        Verify Owner

                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          changeStatus(owner.id, "Rejected")
                        }
                        className="rounded-md bg-[#D9D9D9] px-6 py-3 font-semibold text-red-700 hover:bg-white"
                      >
                        Reject
                      </button>

                    </>
                  ) : (

                    <button
                      type="button"
                      onClick={() =>
                        changeStatus(owner.id, "Pending")
                      }
                      className="rounded-md bg-[#8CBBEB] px-6 py-3 font-semibold text-[#0A4682]"
                    >
                      Reopen Verification
                    </button>

                  )}

                </div>

                {pending && !allChecked && (
                  <p className="mt-3 text-sm text-white/80">
                    Complete all verification criteria
                    before approving this owner.
                  </p>
                )}

              </div>

            </article>
          );
        })}

      </div>

      <p className="mt-8 text-xs text-white/70">
        Frontend demonstration using sample owner records.
      </p>

    </DashboardLayout>
  );
}