import { sql } from "../config/db.js";

export const buscarClientes = async(req, res) => {
    try {
        const clientes = await sql `
        SELECT * FROM clientes
        ORDER BY id DESC
        `;

        console.log('clientes: ', clientes);
        res.status(200).json({success: true , data: clientes});

    } catch (error) {
        console.error('Erro ao buscar clientes: ', error);
        res.status(500).json({ success: false, message: 'Erro interno no servidor' });
    }
};

export const criarCliente = async(req, res) => {
    const {nome, email, telefone, senha} = req.body

    if(!nome || !email || !telefone || !senha){
        return res.status(400).json({success: false, message: 'Preencha todos os campos!'})
    }

    try {
        const novoCliente = await sql `
        INSERT INTO clientes (nome, telefone, email, senha)
        VALUES (${nome}, ${telefone}, ${email}, ${senha})
        RETURNING *;
        `
        console.log('Novo cliente criado: ', novoCliente);
        res.status(201).json({ success: true, data: novoCliente[0] });

    } catch (error) {
        console.error('Erro ao criar cliente: ', error);
        res.status(500).json({ success: false, message: 'Erro interno no servidor' });
    }
};

export const buscarClienteId = async(req, res) => {
    const { id } = req.params;

    try {
        const cliente = await sql `
        SELECT * FROM clientes WHERE id =${id}
        `
        
        res.status(200).json({ success: true, data: cliente[0] });
    } catch (error) {
        console.error('Erro ao buscar cliente: ', error);
        res.status(500).json({ success: false, message: 'Erro interno no servidor' });
    }
};

export const atualizarCliente = async(req, res) => {
    const { id } = req.params;
    const { nome , email, telefone, senha } = req.body;

    try {
        const clienteAtualizado = await sql `
        UPDATE  clientes SET nome = ${nome}, email = ${email}, telefone = ${telefone}, senha = ${senha}
        WHERE id = ${id} 
        RETURNING *
        `

        if(clienteAtualizado.length === 0){
            return res.status(404).json({success: false, message: 'Cliente não encontrado'})
        }

        res.status(200).json({ success: true, data: clienteAtualizado[0] });
        
    } catch (error) {
        console.error('Erro ao atualizar cliente: ', error);
        res.status(500).json({ success: false, message: 'Erro interno no servidor' });
    }
};

export const deletarCliente = async(req, res) => {
    const { id } = req.params;

    try {
        const clienteDeletado = await sql `
        DELETE FROM clientes WHERE id = ${id}
        RETURNING *;
        `

        if(clienteDeletado.length === 0){
            return res.status(404).json({success: false, message: 'cliente não encontrado'})
        }

        res.status(200).json({ 
            success: true, 
            data: clienteDeletado[0] 
        });
        
    } catch (error) {
        console.error('Erro ao deletar cliente: ', error);
        res.status(500).json({ success: false, message: 'Erro interno no servidor' });
        
    }

};