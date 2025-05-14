import express from 'express';
import { buscarClientes, buscarClienteId, criarCliente, atualizarCliente, deletarCliente } from '../controllers/clientesController.js';

const router = express.Router();

    router.get('/', buscarClientes);

    router.get('/:id', buscarClienteId);

    router.post('/', criarCliente);

    router.put('/:id', atualizarCliente);

    router.delete('/:id', deletarCliente);


    export default router;