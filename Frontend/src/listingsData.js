
/*
  Boarding.lk - Listing Data

  Temporary frontend data for testing.

  Original listings and owner listings are preserved.

  Additional demo fields:
  - title
  - distanceKm
  - genders
  - facilities

  Replace sample data with backend data later.
*/

// ==========================================
// ALL BOARDING LISTINGS
// ==========================================

export const allListings = [
  {
    id: 1,
    title: "Modern Room near USJ",
    type: "Single Room",
    place: "Nugegoda, Colombo",
    price: "Rs. 16,000/ month",
    img: "/images/single-room-2.jpg",
    distanceKm: 2.5,
    genders: ["Male", "Female"],
    facilities: ["Wi-Fi", "AC"],
  },
  {
    id: 2,
    title: "Comfortable Twin Room",
    type: "Twin Room",
    place: "Nugegoda, Colombo",
    price: "Rs. 12,000/ month",
    img: "/images/twin-room.jpg",
    distanceKm: 3,
    genders: ["Male"],
    facilities: ["Wi-Fi", "Parking"],
  },
  {
    id: 3,
    title: "Special Shared Room",
    type: "Shared Room",
    place: "Pasal Mawatha, Nugegoda, Colombo",
    price: "Rs. 10,000/ month",
    img: "/images/shared-room.jpg",
    distanceKm: 2.5,
    genders: ["Female"],
    facilities: ["Wi-Fi", "Food"],
  },
  {
    id: 4,
    title: "Cozy Room for Girls",
    type: "Single Room",
    place: "Maharagama, Colombo",
    price: "Rs. 15,000/ month",
    img: "/images/single-room.jpg",
    distanceKm: 4,
    genders: ["Female"],
    facilities: ["Wi-Fi", "AC"],
  },
  {
    id: 5,
    title: "Affordable Shared Room",
    type: "Shared Room",
    place: "Treasure garden, Nugegoda, Colombo",
    price: "Rs. 9,000/ month",
    img: "/images/shared-room-2.jpg",
    distanceKm: 3.5,
    genders: ["Male"],
    facilities: ["Wi-Fi", "Parking"],
  },
  {
    id: 6,
    title: "Spacious Twin Room",
    type: "Twin Room",
    place: "Nugegoda, Colombo",
    price: "Rs. 12,000/ month",
    img: "/images/twin-room-2.jpg",
    distanceKm: 2,
    genders: ["Female"],
    facilities: ["Wi-Fi", "Food"],
  },
  {
    id: 7,
    title: "Student Shared Dorm",
    type: "Shared Dorm",
    place: "Maharagama, Colombo",
    price: "Rs. 9,000/ month",
    img: "/images/shared-dorm.jpg",
    distanceKm: 5,
    genders: ["Male"],
    facilities: ["Wi-Fi", "Food"],
  },
  {
    id: 8,
    title: "Private Single Room",
    type: "Single Room",
    place: "Pasal Mawatha, Nugegoda, Colombo",
    price: "Rs. 17,000/ month",
    img: "/images/single-room-3.jpg",
    distanceKm: 1.5,
    genders: ["Female"],
    facilities: ["Wi-Fi", "AC", "Parking"],
  },
];

// ==========================================
// OWNER'S LISTINGS
// Original Salha data - unchanged
// ==========================================

export const myListings = [
  {
    id: 101,
    status: "Active",
    type: "Single Room",
    place: "Maharagama, Colombo",
    price: "Rs. 15,000/ month",
    img: "/images/single-room.jpg",
  },
  {
    id: 102,
    status: "Occupied",
    type: "Shared Room",
    place: "Pasal Mawatha, Nugegoda, Colombo",
    price: "Rs. 10,000/ month",
    img: "/images/shared-room.jpg",
  },
  {
    id: 103,
    status: "Featured",
    type: "Twin Room",
    place: "Maharagama, Colombo",
    price: "Rs. 12,000/ month",
    img: "/images/twin-room-2.jpg",
  },
  {
    id: 104,
    status: "Inactive",
    type: "Single Room",
    place: "Nugegoda, Colombo",
    price: "Rs. 16,000/ month",
    img: "/images/single-room-2.jpg",
  },
  {
    id: 105,
    status: "Active",
    type: "Twin Room",
    place: "Nugegoda, Colombo",
    price: "Rs. 12,000/ month",
    img: "/images/twin-room.jpg",
  },
];

