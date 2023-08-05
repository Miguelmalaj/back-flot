import { Router } from "express";
import {
    getNombresLotesCliente,
    getLoteCliente,
    updateLoteCliente
} from '../controllers/asignacion_referencia.controller'

const router = Router();
router.post("/referencia/getNombresLotesCliente", getNombresLotesCliente);
router.post("/referencia/getLoteCliente", getLoteCliente);
router.patch("/referencia/updatelotecliente", updateLoteCliente);

export default router;