/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - description
 *         - category
 *         - stock
 *
 *
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the product
 *         price:
 *           type: number
 *           description: The price of the product
 *         description:
 *           type: string
 *           description: Info about the product
 *         category:
 *           type: string
 *           description: Product category
 *         stock:
 *           type: number
 *           description: Amount of product in stock
 *         id:
 *           type: number
 *           description: Unique identifier for the product
 *         slug:
 *           type: string
 *           description: URL-friendly version of the product name
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the product was created
 *         archived:
 *           type: boolean
 *           description: Whether the product is archived (soft deleted)
 *         status:
 *           type: string
 *           description: Virtual property indicating if product is available or not
 *         priceWithTax:
 *           type: number
 *           description: Virtual property showing price with 20% tax
 *         capacity:
 *           type: number
 *           description: Virtual property showing total value (price * stock)
 *
 * paths:
 *   /products:
 *     get:
 *       summary: Get all products
 *       tags:
 *         - products
 *       parameters:
 *         - in: query
 *           name: sort
 *           schema:
 *             type: string
 *           description: Sort by field (prefix with - for descending order, e.g. -price)
 *         - in: query
 *           name: fields
 *           schema:
 *             type: string
 *           description: Comma-separated list of fields to include (e.g. name,price,category)
 *         - in: query
 *           name: page
 *           schema:
 *             type: number
 *           description: Page number for pagination
 *         - in: query
 *           name: limit
 *           schema:
 *             type: number
 *           description: Number of items per page
 *       responses:
 *         '200':
 *           description: A list of all products
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Product'
 */
