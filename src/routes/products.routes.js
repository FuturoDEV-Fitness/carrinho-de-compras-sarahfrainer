// - Implemente no arquivo products.routes.js uma rota para cadastrar um produto

const { Router } = require('express');

const ProductsController = require('../controllers/ProductsController');

const productsRoutes = new Router();

productsRoutes.post('/', ProductsController.cadastrar);
productsRoutes.get('/', ProductsController.listarTodos);

module.exports = productsRoutes;