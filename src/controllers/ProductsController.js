// Implemente os métodos de cada rota dentro do arquivo ProductController.js

const { Pool } = require('pg');

const conexao = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'LabComerce'
});

class ProductsController {
    async cadastrar(request, response) {
        try {
            const dados = request.body;

            // Verifique se todos os campos obrigatórios estão presentes
            if (!dados.name || !dados.voltage || !dados.category_id) {
                return response.status(400).json({
                    mensagem: 'O nome, voltagem e categoria do produto são obrigatórios'
                });
            }

            // Execute a query para inserir o cliente
            const product = await conexao.query(`
                INSERT INTO products
                (name, amount, color, voltage, description, category_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `, [dados.name, dados.amount, dados.color, dados.voltage, dados.description, dados.category_id]);



            // Verifique se foi inserido com sucesso
            if (product.rows.length > 0) {
                return response.status(201).json(product.rows[0]);
            } else {
                throw new Error('Falha ao inserir o cliente');
            }
        } catch (error) {
            console.error('Erro ao cadastrar o cliente:', error.message);
            return response.status(500).json({
                mensagem: 'Houve um erro ao cadastrar o cliente'
            });
        }
    }
}

module.exports = new ProductsController();
