import { Router } from "express";
import {
    getNombresLotesCliente,
    getLoteCliente,
    // updateLoteCliente
} from '../controllers/resumen_contratos.controller'

const router = Router();
router.post("/resumen/getNombresLotesCliente", getNombresLotesCliente);
router.post("/resumen/getLoteCliente", getLoteCliente);
// router.patch("/resumen/updatelotecliente", updateLoteCliente);

export default router;