// - Implemente no arquivo products.routes.js uma rota para cadastrar um produto

const { Router } = require('express');
const bodyParser = require('body-parser');

const ProductsController = require('../controllers/ProductsController');

const productsRoutes = new Router();

productsRoutes.post('/', ProductsController.cadastrar);
productsRoutes.get('/', ProductsController.listarTodos);
productsRoutes.get('/:id', ProductsController.ProdutoComDetalhes);

module.exports = productsRoutes;