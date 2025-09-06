require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
console.log("MONGODB_URI:", process.env.MONGODB_URI); // debug print
mongoose
  .connect(process.env.MONGODB_URI, { dbName: "ecommerce" })
  .then(() => console.log("✅ Connected"))
  .catch((e) => console.error("❌ Connection error:", e));
