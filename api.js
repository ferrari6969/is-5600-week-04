const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

function handleRoot (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
}

async function listProducts (req, res) {
    const { offset = 0, limit = 25, tag } = req.query

    res.json(await Products.list({
      offset: Number(offset),
      limit: Number(limit),
      tag
    }))
}

async function getProduct (req, res, next) {
    const { id } = req.params
    const product = await Products.get(id)

    if (!product) {
      return next()
    }

    return res.json(product)
}

async function createProduct (req, res) {
    const product = await Products.create(req.body)
    res.status(201).json(product)
}

async function updateProduct (req, res) {
    const { id } = req.params
    const updatedProduct = await Products.update(id, req.body)

    res.status(200).json(updatedProduct)
}

async function deleteProduct (req, res) {
    const { id } = req.params
    await Products.remove(id)

    res.status(202).json({ message: `Product ${id} deleted` })
}

module.exports = autoCatch({
    handleRoot,
    listProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
})
