import express from 'express';
import { buscarQuartos, buscarQuartoId, criarQuarto, atualizarQuarto, deletarQuarto } from '../controllers/quartosController.js';

const router = express.Router();

    router.get('/', buscarQuartos);

    router.get('/:id', buscarQuartoId);

    router.post('/', criarQuarto);

    router.put('/:id', atualizarQuarto);

    router.delete('/:id', deletarQuarto);


    export default router;