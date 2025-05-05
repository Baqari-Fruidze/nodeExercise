import app from "./app.js";
import mongoose from "mongoose";

const port = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL.replace(
  "<PASSWORD>",
  process.env.DB_PASS
).replace("<DB_USERNAME>", process.env.DB_USER);
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Database conected");
  })
  .catch((err) => console.log(err));
app.listen(port, () => {
  console.log("your server is running on port 3000");
});
