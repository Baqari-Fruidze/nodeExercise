import fs from "fs";
import Product from "../models/productModel.js";
import filterServise from "../services/filterServise.js";
import mongoose from "mongoose";

const getProducts = async (req, res) => {
  // const queryObj = { ...req.query };
  const query = filterServise(Product.find(), req.query);

  try {
    const product = await query;
    res.json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const createProducts = async (req, res) => {
  try {
    const newProduct = new Product({
      ...req.body,
      id: Date.now(),
      createdAt: new Date(),
    });

    // Validate against schema requirements
    // await newProduct.validate();

    // Save to database
    await newProduct.save();

    // Return success response
    res.status(201).json(newProduct);
  } catch (error) {
    // Simple error handling
    // if (error.name === "ValidationError") {
    //   return res.status(400).send("Validation failed: Missing required fields");
    // }

    res.status(500).send({ message: error.message });
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

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findOneAndDelete({ id: Number(id) });

    if (!deletedProduct) {
      return res.status(404).send("Product not found");
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const buyProduct = async (req, res) => {
  //   const products = readProductsData();
  //   const productIndex = products.findIndex(
  //     (product) => product.id === Number(req.params.id)
  //   );
  //   if (productIndex === -1) {
  //     return res.status(404).json({ message: " this product do not exists" });
  //   }
  //   if (products[productIndex].stock < 1) {
  //     return res.status(400).json({ message: "stock is zero" });
  //   }
  //   const targetProduct = {
  //     ...products[productIndex],
  //     stock: products[productIndex].stock - 1,
  //   };
  //   products[productIndex] = targetProduct;
  //   fs.writeFileSync("./data/products.json", JSON.stringify(products));
  //   res.json(targetProduct);

  const produckToCkeck = await Product.findOne({ id: Number(req.params.id) });
  if (!produckToCkeck) {
    return res.status(404).send("can not find product");
  }
  if (produckToCkeck.stock >= 1) {
    const productToUpdate = await Product.findOneAndUpdate(
      { id: Number(req.params.id) },
      { $inc: { stock: -1 } },
      { new: true }
    );
    return res.json(productToUpdate);
  } else {
    return res.status(400).send("out of stock");
  }
};
const getCategoryStats = async (req, res) => {
  const stats = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        numProducts: { $sum: 1 },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    { $sort: { avgPrice: -1 } },
  ]);
  res.json(stats);
};
export {
  getProducts,
  createProducts,
  editProduct,
  deleteProduct,
  buyProduct,
  getCategoryStats,
};
