
const roomTypes = [
  "Single Room",
  "Shared Room",
  "Entire Room",
];

const genders = ["Male", "Female"];
const facilities = ["Wi-Fi", "AC", "Parking", "Food"];

export default function SearchFilters({
  filters,
  setFilters,
}) {
  const update = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggle = (key, value) => {
    const selected = filters[key];
    update(
      key,
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value]
    );
  };

  return (
    <aside className="rounded-md bg-[#10518D] p-5 text-white">
      <h3 className="mb-5 text-xl font-bold text-[#F5C400]">
        Filters
      </h3>

      {/* Distance */}
      <div className="mb-6">
        <label className="mb-3 block font-semibold">
          Distance (Km)
        </label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={filters.distance}
          onChange={(e) =>
            update("distance", Number(e.target.value))
          }
          className="w-full accent-[#F5C400]"
        />
        <div className="flex justify-between text-sm">
          <span>0 km</span>
          <span>{filters.distance} km</span>
        </div>
      </div>

      {/* Room Type */}
      <div className="mb-6">
        <h4 className="mb-3 font-semibold">Room Type</h4>
        {roomTypes.map((type) => (
          <label
            key={type}
            className="mb-3 flex items-center gap-3"
          >
            <input
              type="checkbox"
              checked={filters.roomTypes.includes(type)}
              onChange={() => toggle("roomTypes", type)}
              className="h-4 w-4 accent-[#F5C400]"
            />
            {type}
          </label>
        ))}
      </div>

      {/* Gender */}
      <div className="mb-6">
        <h4 className="mb-3 font-semibold">
          Gender Preference
        </h4>
        {genders.map((gender) => (
          <label
            key={gender}
            className="mb-3 flex items-center gap-3"
          >
            <input
              type="checkbox"
              checked={filters.genders.includes(gender)}
              onChange={() => toggle("genders", gender)}
              className="h-4 w-4 accent-[#F5C400]"
            />
            {gender}
          </label>
        ))}
      </div>

      {/* Monthly Rent */}
      <div className="mb-6">
        <label className="mb-3 block font-semibold">
          Maximum Monthly Rent (Rs.)
        </label>
        <input
          type="range"
          min="2000"
          max="20000"
          step="500"
          value={filters.maxRent}
          onChange={(e) =>
            update("maxRent", Number(e.target.value))
          }
          className="w-full accent-[#F5C400]"
        />
        <div className="flex justify-between text-sm">
          <span>Rs. 2,000</span>
          <span>Rs. {filters.maxRent.toLocaleString()}</span>
        </div>
      </div>

      {/* Facilities */}
      <div className="mb-6">
        <h4 className="mb-3 font-semibold">
          Facilities
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {facilities.map((facility) => (
            <label
              key={facility}
              className="flex items-center gap-2"
            >
              <input
                type="checkbox"
                checked={filters.facilities.includes(facility)}
                onChange={() =>
                  toggle("facilities", facility)
                }
                className="h-4 w-4 accent-[#F5C400]"
              />
              {facility}
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          setFilters({
            distance: 10,
            roomTypes: [],
            genders: [],
            maxRent: 20000,
            facilities: [],
          })
        }
        className="w-full rounded-md bg-[#F5C400] py-2 font-bold text-[#0A4682]"
      >
        Clear Filters
      </button>
    </aside>
  );
}
