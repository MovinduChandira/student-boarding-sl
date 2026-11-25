import { useSyncExternalStore } from "react";

const STORAGE_KEY = "boardinglk_student_favourites";
const EVENT_NAME = "boardinglk-favourites-changed";

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) || "[]";
}

function subscribe(callback) {
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

function parseFavourites(value) {
  try {
    const ids = JSON.parse(value);
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

export function getFavourites() {
  return parseFavourites(getSnapshot());
}

export function toggleFavourite(id) {
  const current = getFavourites();

  const updated = current.includes(id)
    ? current.filter((itemId) => itemId !== id)
    : [...current, id];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );

  window.dispatchEvent(new Event(EVENT_NAME));
}

export function useFavourites() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot
  );

  return parseFavourites(snapshot);
}