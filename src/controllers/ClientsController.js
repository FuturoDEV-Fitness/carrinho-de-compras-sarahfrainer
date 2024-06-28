const { Pool } = require('pg');

const conexao = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'LabComerce'
});

class ClientsController {
    async criar(request, response) {
        try {
            const dados = request.body;

            // Verifique se todos os campos obrigatórios estão presentes
            if (!dados.nome || !dados.cpf || !dados.email || !dados.contact) {
                return response.status(400).json({
                    mensagem: 'O nome, cpf, email e contact são obrigatórios'
                });
            }

            // Execute a query para inserir o cliente
            const client = await conexao.query(`
                INSERT INTO clients
                (nome, email, cpf, contact)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `, [dados.nome, dados.email, dados.cpf, dados.contact]);

            // Verifique se foi inserido com sucesso
            if (client.rows.length > 0) {
                return response.status(201).json(client.rows[0]);
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

module.exports = new ClientsController();
