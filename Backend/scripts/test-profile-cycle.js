import jwt from "jsonwebtoken";
import config from "../src/config.js";
import app from "../src/app.js";
import pool from "../src/db.js";

function makeToken(userId, role) {
  return jwt.sign({ sub: userId, role }, config.jwt.secret, { expiresIn: "1h" });
}

async function run() {
  console.log("Starting profile endpoints tests...\n");

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  const studentToken = makeToken(1, "student"); // Kavindu Perera
  const ownerToken = makeToken(2, "owner"); // Ruwan Silva

  try {
    // 1. Get Student Profile
    console.log("1. Testing GET /api/profile for student...");
    const studentGetRes = await fetch(`${baseUrl}/api/profile`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const studentProfile = await studentGetRes.json();
    console.log("Initial student profile:", studentProfile);
    if (studentGetRes.status !== 200) throw new Error("Failed to get student profile");
    if (!studentProfile.name || !studentProfile.email) {
      throw new Error("Missing personal registration details in student profile");
    }

    // 2. Update Student Profile
    console.log("\n2. Testing PUT /api/profile for student...");
    const updateStudentRes = await fetch(`${baseUrl}/api/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        name: "Kavindu M. Perera",
        email: "kavindu.perera@example.com",
        phone: "+94710000001",
        age: "23",
        university: "University of Sri Jayewardenepura",
        year: "4th Year",
        faculty: "Faculty of Computing",
      }),
    });
    const updatedStudent = await updateStudentRes.json();
    console.log("Updated student profile:", updatedStudent);
    if (updateStudentRes.status !== 200) throw new Error("Failed to update student profile");
    if (updatedStudent.age !== "23" || updatedStudent.year !== "4th Year" || updatedStudent.name !== "Kavindu M. Perera") {
      throw new Error("Updated student profile fields do not match!");
    }

    // 3. Get Owner Profile
    console.log("\n3. Testing GET /api/profile for owner...");
    const ownerGetRes = await fetch(`${baseUrl}/api/profile`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const ownerProfile = await ownerGetRes.json();
    console.log("Initial owner profile:", ownerProfile);
    if (ownerGetRes.status !== 200) throw new Error("Failed to get owner profile");
    if (!ownerProfile.name || !ownerProfile.nic) {
      throw new Error("Missing personal registration details in owner profile");
    }

    // 4. Update Owner Profile
    console.log("\n4. Testing PUT /api/profile for owner...");
    const updateOwnerRes = await fetch(`${baseUrl}/api/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        name: "Ruwan K. Silva",
        email: "ruwan.silva@example.com",
        phone: "+94710000002",
        nic: "200012345678",
        location: "15/B High Level Road, Nugegoda",
      }),
    });
    const updatedOwner = await updateOwnerRes.json();
    console.log("Updated owner profile:", updatedOwner);
    if (updateOwnerRes.status !== 200) throw new Error("Failed to update owner profile");
    if (updatedOwner.location !== "15/B High Level Road, Nugegoda" || updatedOwner.name !== "Ruwan K. Silva") {
      throw new Error("Updated owner profile fields do not match!");
    }

    console.log("\n All profile API tests PASSED successfully!");
  } finally {
    server.close();
    await pool.end();
  }
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
