import app from "./app.js";

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("your server is running on port 3000");
});
