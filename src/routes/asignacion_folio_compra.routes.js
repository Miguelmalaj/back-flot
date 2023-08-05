import { Router } from "express";
import {
    getNombresLotesCliente,
    getLoteCliente,
    updateLoteCliente
} from '../controllers/asignacion_folio_compra.controller'

const router = Router();
router.post("/foliocompra/getNombresLotesCliente", getNombresLotesCliente);
router.post("/foliocompra/getLoteCliente", getLoteCliente);
router.patch("/foliocompra/updatelotecliente", updateLoteCliente);

export default router;