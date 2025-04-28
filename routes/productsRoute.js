import express from "express";
import fs from "fs";
const readProductsData = () => {
  return JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
};
const productsRouter = express.Router();
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

// app.use("/products", productsRouter);

productsRouter.route("/").get(getProducts).post(createProducts);
productsRouter.route("/:id").put(editProduct).delete(deleteProduct);
productsRouter.route("/buy/:id").post(buyProduct);

export default productsRouter;
