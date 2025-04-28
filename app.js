import express from "express";
import fs from "fs";
import morgan from "morgan";
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log("ola midllware");
  next();
});
app.use(morgan("dev"));

// Helper function to read fresh data
const readProductsData = () => {
  return JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
};

const getProducts = (req, res) => {
  const products = readProductsData();
  res.json(products);
};
const createProducts = (req, res) => {
  const products = readProductsData();

  const newProduct = {
    ...req.body,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };

  const uniqueChecker = products.every(
    (product) => product.name !== newProduct.name
  );

  if (!newProduct.price || !newProduct.name) {
    return res.status(400).send("name and price are required fields");
  } else if (uniqueChecker) {
    products.push(newProduct);
    fs.copyFileSync("./data/products.json", "./data/products_backup.json");
    fs.writeFileSync("./data/products.json", JSON.stringify(products));
    res.status(201).json(newProduct);
  } else {
    res.status(409).send("product already exists");
  }
};

const editProduct = (req, res) => {
  const products = readProductsData();
  const productIndex = products.findIndex(
    (product) => product.id === Number(req.params.id)
  );
  // products[productIndex] = { ...products[productIndex], newProduct };
  const newProduct = { ...products[productIndex], ...req.body };
  products[productIndex] = newProduct;
  fs.writeFileSync("./data/products.json", JSON.stringify(products));
  res.json(newProduct);
};
const deleteProduct = (req, res) => {
  const products = readProductsData();
  const newData = products.filter(
    (product) => product.id !== Number(req.params.id)
  );
  fs.writeFileSync("./data/products.json", JSON.stringify(newData));
  res.status(204).send("product deleted");
};
const buyProduct = (req, res) => {
  const products = readProductsData();
  const productIndex = products.findIndex(
    (product) => product.id === Number(req.params.id)
  );
  if (productIndex === -1) {
    return res.status(404).json({ message: " this product do not exists" });
  }
  if (products[productIndex].stock < 1) {
    return res.status(400).json({ message: "stock is zero" });
  }
  const targetProduct = {
    ...products[productIndex],
    stock: products[productIndex].stock - 1,
  };
  products[productIndex] = targetProduct;
  fs.writeFileSync("./data/products.json", JSON.stringify(products));
  res.json(targetProduct);
};

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

const productsRouter = express.Router();
app.use("/products", productsRouter);

productsRouter.route("/").get(getProducts).post(createProducts);
productsRouter.route("/:id").put(editProduct).delete(deleteProduct);
productsRouter.route("/buy/:id").post(buyProduct);

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
