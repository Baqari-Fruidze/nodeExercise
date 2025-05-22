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
 *           type: integer
 *           description: Amount of product in stock
 *
 * paths:
 *   /products:
 *     get:
 *       summary: Get all products
 *       tags:
 *         - products
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
