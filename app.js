import express from "express";
import fs from "fs";
import morgan from "morgan";
import productRouter from "./routes/productRoute.js";
import { get } from "http";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
console.log(process.env.DB_USER);
const app = express();
app.use(express.json());
// console.log(app.get("env"));
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Helper function to read fresh data

const getUser = (req, res) => {
  res.send("get users");
};
const createUser = (req, res) => {
  res.send("create users");
};

const editUser = (req, res) => {
  res.send("edit user");
};
const deleteUser = (req, res) => {
  res.send("delte user");
};

/////////////////////////////////////////////////////////////////////////////

// const productsRouter = express.Router();
app.use("/products", productRouter);

// productsRouter.route("/").get(getProducts).post(createProducts);
// productsRouter.route("/:id").put(editProduct).delete(deleteProduct);
// productsRouter.route("/buy/:id").post(buyProduct);

///////////////

const usersRouter = express.Router();
app.use("/users", usersRouter);

usersRouter.route("/").get(getUser).post(createUser);
usersRouter.route("/:id").put(editUser).delete(deleteUser);

// // პროდუქტების მიღება
// app.get("/products", getProducts);
// // ახალი პროდუქტის დამატება
// app.post("/products", createProducts);
// საერთო როუტი ერთანირი სახელების მქონეებისთვის
// პროდუქტის შეცვლა
// app.put("/products/:id", editProduct);
// // წაშლა
// app.delete("/products/:id", deleteProduct);
//saerTo routi

// ყიდვა და რაოდენობაზე ერთს გამოკლება
// app.post("/products/buy/:id", buyProduct);

// პროდუქტების რაოდენის დათვლა
// app.get("/products/count", (req, res) => {
//   const products = readProductsData();
//   const count = products.length;
//   res.json({ count });
// });

// ყველაზე ძვირიანი
// app.get("/products/most-expensive", (req, res) => {
//   const products = readProductsData();
//   let mostExpensiveProduct = products[0];
//   products.forEach((product) => {
//     product.price > mostExpensiveProduct.price
//       ? (mostExpensiveProduct = product)
//       : null;
//   });
//   res.status(201).json(mostExpensiveProduct);
// });

// ყველას წაშლა
// app.delete("/products/delete-all", (req, res) => {
//   fs.writeFileSync("./data/products.json", "[]");
//   const products = readProductsData();
//   res
//     .status(200)
//     .json({ message: "All products have been deleted successfully" });
// });

app.listen(3000, () => {
  console.log("your server is running on port 3000");
});
