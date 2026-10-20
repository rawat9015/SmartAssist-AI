// import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";



// dotenv.config();

// const PORT = process.env.PORT || 5000;

// connect Database 
await connectDB();

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});