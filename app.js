import express from "express";
import fs from "fs";
const app = express();
app.use(express.json());

// Helper function to read fresh data
const readProductsData = () => {
  return JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
};

// const date = ()=>{
//   return   {const date = new Date()
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate();}
// }

// function calculateDate() {
//   const date = new Date();
//   const year = date.getFullYear().toString();
//   const month = (date.getMonth() + 1).toString().padStart(2, "0");
//   const day = date.getDate().toString().padStart(2, "0");
//   const createdAt = year + "/" + month + "/" + day;
//   return createdAt;
// }

app.get("/products", (req, res) => {
  const products = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
  res.json(products);
  console.log(products);
});
// პროდუქტების რაოდენის დათვლა
app.get("/products/count", (req, res) => {
  const products = readProductsData();
  const count = products.length;
  res.json({ count });
});

// ყველაზე ძვირიანი
app.get("/products/most-expensive", (req, res) => {
  const products = readProductsData();
  let mostExpensiveProduct = products[0];
  products.forEach((product) => {
    product.price > mostExpensiveProduct.price
      ? (mostExpensiveProduct = product)
      : null;
  });
  res.status(201).json(mostExpensiveProduct);
});
// ახალი პროდუქტის დამატება
app.post("/products", (req, res) => {
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
});

// ყველას წაშლა
app.delete("/products/delete-all", (req, res) => {
  fs.writeFileSync("./data/products.json", "[]");
  const products = readProductsData();
  res
    .status(200)
    .json({ message: "All products have been deleted successfully" });
});

// პროდუქტის შეცვლა
app.put("/products/:id", (req, res) => {
  const products = readProductsData();
  const productIndex = products.findIndex(
    (product) => product.id === Number(req.params.id)
  );
  // products[productIndex] = { ...products[productIndex], newProduct };
  const newProduct = { ...products[productIndex], ...req.body };
  products[productIndex] = newProduct;
  fs.writeFileSync("./data/products.json", JSON.stringify(products));
  res.json(newProduct);
});

// წაშლა
app.delete("/products/:id", (req, res) => {
  const products = readProductsData();
  const newData = products.filter(
    (product) => product.id !== Number(req.params.id)
  );
  fs.writeFileSync("./data/products.json", JSON.stringify(newData));
  res.status(204).send("product deleted");
});

// ყიდვა და რაოდენობაზე ერთს გამოკლება
app.post("/buy/:id", (req, res) => {
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
});

app.listen(3000, () => {
  console.log("your server is running on port 3000");
});
