import express from 'express';
import { buscarProdutos, criarProduto, buscarProdutoId, atualizarProduto, deletarProduto } from '../controllers/produtoController.js';

const router = express.Router();

    router.get('/', buscarProdutos);

    router.get('/:id', buscarProdutoId);

    router.post('/', criarProduto);

    router.put('/:id', atualizarProduto);

    router.delete('/:id', deletarProduto);


    export default router;