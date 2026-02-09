require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const emailService = require("./src/services/email.service");

let seedProducts;

// ✅ SAFE REQUIRE (this is the key)
try {
  seedProducts = require("./src/seed/seedProducts");
} catch (err) {
  console.log("seedProducts not found, skipping seeding");
}

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    // ✅ ONLY run if file exists
    if (seedProducts) {
      try {
        await seedProducts();
      } catch (err) {
        console.log("Seeding failed, continuing app start");
      }
    }

    app.listen(PORT, () => {
      console.log(`Server: http://localhost:${PORT}`);

      // Test email service configuration AFTER server starts (non-blocking)
      emailService.testEmailConnection().catch((error) => {
        console.error("Email test failed:", error.message);
      });
    });
  })
  .catch((err) => console.error("MongoDB error:", err.message));