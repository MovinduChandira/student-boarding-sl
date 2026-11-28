import { owners, verificationCriteria } from "./ownersData.js";

const STORAGE_KEY = "boarding_owner_verification";

export function getVerificationRecords() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function getOwnerVerification(ownerId) {
  const records = getVerificationRecords();

  return records[ownerId] || {
    status: "Pending",
    checks: {},
    remarks: "",
  };
}

export function saveOwnerVerification(ownerId, record) {
  if (!owners.some((owner) => owner.id === ownerId)) {
    return false;
  }

  if (
    record.status === "Verified" &&
    !verificationCriteria.every(
      (criterion) => record.checks?.[criterion.id] === true
    )
  ) {
    return false;
  }

  const records = getVerificationRecords();

  records[ownerId] = {
    ...record,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(records)
  );

  return true;
}

export function isOwnerVerified(ownerId) {
  const record = getOwnerVerification(ownerId);

  return (
    record.status === "Verified" &&
    verificationCriteria.every(
      (criterion) => record.checks?.[criterion.id] === true
    )
  );
}