const { Pool } = require('pg')

const conexao = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'LabComerce'
})


class ClientsController {
    async criar(request, response) {

        try {
            const dados = request.body;

            if (!dados.nome || !dados.cpf || !dados.email || !dados.contact) {
                return response.status(400).json({
                    mensagem: 'O nome, cpf, email e contact são obrigatórios'
                })
            }

            const client = await conexao.query(`
            INSERT INTO clients
             (nome,email,cpf,contact)
             values
             ($1,$2,$3,$4)
             returning *
        `, [dados.nome, dados.email, dados.cpf, dados.contact])

            response.status(201).json(clients.rows[0])
        } catch (error) {
            response.status(500).json({
                mensagem: 'Houve um erro ao cadastrar o serviço'
            })
        }
    }


}





module.exports = new ClientsController()
