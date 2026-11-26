import { myListings as seedListings } from "./listingsData.js";

const KEY = "ownerListings";

// Dates for listings that have none (the sample data), taken from the design.
const fallbackDates = [
  "2026-10-10T12:00:00",
  "2026-06-05T12:00:00",
  "2026-04-15T12:00:00",
  "2026-02-20T12:00:00",
  "2025-10-15T12:00:00",
];

const withDates = (list) =>
  list.map((l, i) => (l.createdAt ? l : { ...l, createdAt: fallbackDates[i % fallbackDates.length] }));

// Owner's listings: the saved ones from localStorage, or the sample data the first time.
export function getOwnerListings() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (Array.isArray(saved)) return withDates(saved);
  } catch {
    /* ignore a broken value and fall back to the sample data */
  }
  return withDates(seedListings);
}

function persist(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    return true;
  } catch {
    return false; // storage full (many large pictures)
  }
}

export function getListing(id) {
  return getOwnerListings().find((l) => String(l.id) === String(id));
}

// Adds a new listing, or replaces the one with the same id. Returns false if saving failed.
export function saveListing(listing) {
  const list = getOwnerListings();
  const i = list.findIndex((l) => String(l.id) === String(listing.id));
  const next = i >= 0 ? list.map((l, n) => (n === i ? listing : l)) : [listing, ...list];
  return persist(next);
}

export function deleteListing(id) {
  return persist(getOwnerListings().filter((l) => String(l.id) !== String(id)));
}

export function newId() {
  return `l-${Date.now()}`;
}
