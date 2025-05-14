import { sql } from "../config/db.js";

export const buscarQuartos = async (req, res) => {
    try {
        const quartos = await sql`
        SELECT * FROM quartos
        ORDER BY id DESC
        `;

        console.log('quartos: ', quartos);
        res.status(200).json({ success: true, data: quartos });

    } catch (error) {
        console.error('Erro ao buscar quartos: ', error);
        res.status(500).json({ success: false, message: 'Erro interno no servidor' });
    }
};

export const criarQuarto = async (req, res) => {
    const { imagem_url, nome, descricao, preco, quantidade } = req.body;

    if (!nome || !preco || !quantidade) {
        return res.status(400).json({ success: false, message: 'Preencha todos os campos obrigatórios!' });
    }

    try {
        const novoQuarto = await sql`
        INSERT INTO quartos (imagem_url, nome, descricao, preco, quantidade)
        VALUES (${imagem_url}, ${nome}, ${descricao}, ${preco}, ${quantidade})
        RETURNING *;
        `;
        console.log('Novo quarto criado: ', novoQuarto);
        res.status(201).json({ success: true, data: novoQuarto[0] });

    } catch (error) {
        console.error('Erro ao criar quarto: ', error);
        res.status(500).json({ success: false, message: 'Erro interno no servidor' });
    }
};

export const buscarQuartoId = async (req, res) => {
    const { id } = req.params;

    try {
        const quarto = await sql`
        SELECT * FROM quartos WHERE id = ${id}
        `;

        if (!quarto.length) {
            return res.status(404).json({ success: false, message: 'Quarto não encontrado' });
        }

        res.status(200).json({ success: true, data: quarto[0] });
    } catch (error) {
        console.error('Erro ao buscar quarto: ', error);
        res.status(500).json({ success: false, message: 'Erro interno no servidor' });
    }
};

export const atualizarQuarto = async (req, res) => {
    const { id } = req.params;
    const { imagem_url, nome, descricao, preco, quantidade } = req.body;

    try {
        const quartoAtualizado = await sql`
        UPDATE quartos
        SET imagem_url = ${imagem_url}, nome = ${nome}, descricao = ${descricao}, preco = ${preco}, quantidade = ${quantidade}
        WHERE id = ${id}
        RETURNING *;
        `;

        if (!quartoAtualizado.length) {
            return res.status(404).json({ success: false, message: 'Quarto não encontrado' });
        }

        res.status(200).json({ success: true, data: quartoAtualizado[0] });
    } catch (error) {
        console.error('Erro ao atualizar quarto: ', error);
        res.status(500).json({ success: false, message: 'Erro interno no servidor' });
    }
};

export const deletarQuarto = async (req, res) => {
    const { id } = req.params;

    try {
        const quartoDeletado = await sql`
        DELETE FROM quartos WHERE id = ${id}
        RETURNING *;
        `;

        if (!quartoDeletado.length) {
            return res.status(404).json({ success: false, message: 'Quarto não encontrado' });
        }

        res.status(200).json({
            success: true,
            data: quartoDeletado[0]
        });
    } catch (error) {
        console.error('Erro ao deletar quarto: ', error);
        res.status(500).json({ success: false, message: 'Erro interno no servidor' });
    }
};