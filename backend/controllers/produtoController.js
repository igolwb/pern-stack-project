import { sql } from "../../config/db.js";

export const buscarProdutos = async(req, res) => {
    try {
        const produtos = await sql `
        SELECT * FROM produtos
        ORDER BY id DESC
        `;

        console.log('produtos: ', produtos);
        res.status(200).json({success: true , data: produtos});

    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ success: false, message: 'Erro interno no servidor' });
    }
};

export const criarProduto = async(req, res) => {
    const {nome, preco, imagem} = req.body

    if(!nome || !imagem || !preco){
        return res.status(400).json({success: false, message: 'Preencha todos os campos!'})
    }

    try {
        const novoProduto = await sql `
        INSERT INTO produtos (nome, imagem, preco)
        VALUES (${nome}, ${imagem}, ${preco})
        RETURNING *;
        `
        console.log('Novo produto criado:', novoProduto);
        res.status(201).json({ success: true, data: novoProduto[0] });

    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ success: false, message: 'Erro interno no servidor' });
    }
};

export const buscarProdutoId = async(req, res) => {
    const { id } = req.params;

    try {
        const produto = await sql `
        SELECT * FROM produtos WHERE id =${id}
        `
        
        res.status(200).json({ success: true, data: produto[0] });
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({ success: false, message: 'Erro interno no servidor' });
    }
};

export const atualizarProduto = async(req, res) => {
    const { id } = req.params;
    const { nome , imagem, preco } = req.body;

    try {
        const produtoAtualizado = await sql `
        UPDATE  produtos SET nome = ${nome}, imagem = ${imagem}, preco = ${preco}
        WHERE id = ${id} 
        RETURNING *
        `//Atualizar Produtos

        if(produtoAtualizado.length === 0){
            return res.status(404).json({success: false, message: 'Produto não encontrado'})
        }

        res.status(200).json({ success: true, data: produtoAtualizado[0] });
        
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ success: false, message: 'Erro interno no servidor' });
    }
};

export const deletarProduto = async(req, res) => {
    const { id } = req.params;

    try {
        const produtoDeletado = await sql `
        DELETE FROM produtos WHERE id = ${id}
        RETURNING *;
        `

        if(produtoDeletado.length === 0){
            return res.status(404).json({success: false, message: 'Produto não encontrado'})
        }

        res.status(200).json({ 
            success: true, 
            data: produtoDeletado[0] 
        });
        
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).json({ success: false, message: 'Erro interno no servidor' });
        
    }

};