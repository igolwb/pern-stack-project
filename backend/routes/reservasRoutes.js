import express from 'express';
import {criarReserva} from '../controllers/reservasController.js';

const router = express.Router();

    router.post('/', criarReserva);

    export default router;