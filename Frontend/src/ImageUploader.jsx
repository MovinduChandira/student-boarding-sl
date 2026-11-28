import { useRef } from "react";

// Reads a File into a data URL so the picture can also be saved in localStorage.
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ id: crypto.randomUUID(), name: file.name, url: reader.result });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Image picker with thumbnails and a cross to remove each one.
 *
 * images   array of { id, name, url }
 * onChange called with the new array
 * max      most pictures allowed
 */
export default function ImageUploader({ images, onChange, max = 8 }) {
  const inputRef = useRef(null);

  async function addFiles(e) {
    const files = Array.from(e.target.files || [])
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, Math.max(0, max - images.length));
    e.target.value = ""; // lets the same file be picked again after removing it
    if (files.length === 0) return;
    const added = await Promise.all(files.map(readFile));
    onChange([...images, ...added]);
  }

  function remove(id) {
    onChange(images.filter((img) => img.id !== id));
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={addFiles}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={images.length >= max}
        className="w-full rounded-lg border-2 border-dashed border-white/70 px-4 py-6 text-center text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {images.length >= max ? `Maximum ${max} images` : "Click to upload images"}
      </button>

      {images.length > 0 && (
        <ul className="mt-4 grid grid-cols-3 gap-3">
          {images.map((img) => (
            <li key={img.id} className="group relative aspect-square overflow-hidden rounded-lg bg-black/20">
              <img src={img.url} alt={img.name || "Listing"} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(img.id)}
                aria-label={`Remove ${img.name || "image"}`}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-sm font-bold leading-none text-white hover:bg-red-600"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
