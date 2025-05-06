import fs from "fs";
import mongoose from "mongoose";

const readProductsData = async () => {
  // return JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
  const Product = mongoose.model("Product", productSchema);
  const products = await Product.find({});
  return products;
};

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true },
  slug: { type: String },
  createdAt: { type: Date, default: Date.now },
});
productSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});
const Product = mongoose.model("Product", productSchema);

const getProducts = async (req, res) => {
  const products = await readProductsData();
  console.log(products);
  res.json(products);
};
const createProducts = async (req, res) => {
  const products = await readProductsData();

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
    // products.push(newProduct);
    // fs.copyFileSync("./data/products.json", "./data/products_backup.json");
    // fs.writeFileSync("./data/products.json", JSON.stringify(products));
    await Product.create(newProduct);

    res.status(201).json(newProduct);
  } else {
    res.status(409).send("product already exists");
  }
};

// const editProduct = async(req, res) => {
//   const products =  await readProductsData();
//   const productIndex = products.findIndex(
//     (product) => product.id === Number(req.params.id)
//   );
//   // products[productIndex] = { ...products[productIndex], newProduct };
//   const newProduct = { ...products[productIndex], ...req.body };
//   products[productIndex] = newProduct;
//   fs.writeFileSync("./data/products.json", JSON.stringify(products));
//   res.json(newProduct);
// };

const editProduct = async (req, res) => {
  const { id } = req.params;
  const updatedProduct = req.body;

  try {
    // Find and update the product by its id
    const product = await Product.findOneAndUpdate(
      { id: Number(id) }, // Find product by the 'id' field
      updatedProduct, // The updated data
      { new: true } // Return the updated document (default is to return the old one)
    );

    if (!product) {
      return res.status(404).send("Product not found");
    }

    // Send the updated product back as the response
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the product");
  }
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
export { getProducts, createProducts, editProduct, deleteProduct, buyProduct };
