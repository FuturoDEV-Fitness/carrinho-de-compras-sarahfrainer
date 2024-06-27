const { Router } = require('express')

const ClientsController = require('../controllers/ClientsController')

const clientsRoutes = new Router()

clientsRoutes.post('/', ClientsController.criar)
clientsRoutes.get('/', ClientsController.listarTodos)
clientsRoutes.get('/:id', ClientsController.listarUm)
clientsRoutes.delete('/:id', ClientsController.deletar)

module.exports = clientsRoutes;