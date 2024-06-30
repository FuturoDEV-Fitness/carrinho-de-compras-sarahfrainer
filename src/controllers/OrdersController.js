const { Pool } = require('pg');

const conexao = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'LabComerce'
});

class OrdersController {
    async cadastrarPedido(request, response) {
        try {
            const dados = request.body;

            // Inicia uma transação
            const client = await conexao.connect();

            // Insere o pedido na tabela orders
            const pedidoQuery = `
                INSERT INTO orders (client_id, total, address, observations)
                VALUES ($1, $2, $3, $4)
                RETURNING id
            `;
            const pedidoValues = [dados.client_id, dados.total, dados.address, dados.observations];
            const pedidoResult = await client.query(pedidoQuery, pedidoValues);
            const orderId = pedidoResult.rows[0].id;

            // Insere os itens do pedido na tabela orders_items
            for (let item of dados.orders_items) {
                // Consulta o preço do produto na tabela orders_items (não parece ser necessário neste contexto, talvez seja orders_items e products)
                const produtoAtual = await client.query(`
                    SELECT price FROM products 
                    WHERE id = $1
                `, [item.product_id]);

                // Insere o item na tabela orders_items
                const itemQuery = `
                    INSERT INTO orders_items (order_id, product_id, amount, price)
                    VALUES ($1, $2, $3, $4)
                `;
                const itemValues = [orderId, item.product_id, item.amount, produtoAtual.rows[0].price];
                await client.query(itemQuery, itemValues);
            }

            // Commit da transação
            await client.query('COMMIT');
            response.status(201).json({ mensagem: 'Pedido criado com sucesso' });
        } catch (error) {
            // Rollback da transação em caso de erro
            await client.query('ROLLBACK');
            console.error('Erro ao cadastrar o pedido:', error.message);
            response.status(500).json({ mensagem: 'Houve um erro ao cadastrar o pedido' });
        }
    }
}

module.exports = new OrdersController();
