const express = require('express');
const bodyParser = require('body-parser');

const productsRoutes = require('./routes/products.routes');
const clientsRoutes = require('./routes/clients.routes');
const ordersRoutes = require('./routes/orders.routes');


const app = express();

// Configurando body-parser para analisar JSON
app.use(bodyParser.json());

// Middleware para usar as rotas de produtos
app.use('/products', productsRoutes);
app.use('/clients', clientsRoutes);
app.use('/orders', ordersRoutes);

// Middleware para tratamento de erros de JSON malformado
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ mensagem: 'JSON malformado' });
  }
  next();
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
