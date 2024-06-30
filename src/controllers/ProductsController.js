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

            // Execute a query para inserir o produto
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
                throw new Error('Falha ao inserir o produto');
            }
        } catch (error) {
            console.error('Erro ao cadastrar o produto:', error.message);
            return response.status(500).json({
                mensagem: 'Houve um erro ao cadastrar o produto'
            });
        }
    }

    async listarTodos(request, response) {
        try {
            const result = await conexao.query(`
                SELECT * FROM products
            `);

            if (result.rows.length > 0) {
                return response.status(200).json(result.rows);
            } else {
                return response.status(404).json({ mensagem: 'Nenhum produto encontrado' });
            }
        } catch (error) {
            console.error('Erro ao listar os produtos:', error.message);
            return response.status(500).json({
                mensagem: 'Houve um erro ao listar os produtos'
            });
        }
    }

    //Implemente no arquivo products.routes.js uma rota para listar um produto com detalhes (use join para os relacionamentos com a categoria)

    async ProdutoComDetalhes(request, response) {
        try {
            const id = request.params.id;
    
            const produto = await conexao.query(`
                SELECT 
                    p.id, 
                    p.name, 
                    p.amount, 
                    p.color, 
                    p.voltage, 
                    p.description, 
                    c.id as category_id, 
                    c.name as category_name 
                FROM products p
                INNER JOIN categories c ON p.category_id = c.id
                WHERE p.id = $1
            `, [id]);
    
            if (produto.rows.length === 0) {
                return response.status(404).json({
                    mensagem: 'Não foi encontrado um produto com esse id'
                });
            }
    
            response.json(produto.rows[0]);
        } catch (error) {
            response.status(500).json({
                mensagem: 'Houve um erro ao listar o produto'
            });
        }
    }
    
    
    }


module.exports = new ProductsController();
