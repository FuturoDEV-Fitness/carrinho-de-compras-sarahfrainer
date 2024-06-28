const { Router } = require('express')

const ClientsController = require('../controllers/ClientsController')

const clientsRoutes = new Router()

clientsRoutes.post('/', ClientsController.criar)


module.exports = clientsRoutes;