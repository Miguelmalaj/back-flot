import { Router } from "express";
import {
    createLote, 
    getFoliosLotes,
    getNombresLotesCliente,
    getLoteCliente,
    getVINSRegistered,
    updateLote,
    getvinscliente,
    getVinsDisponiblesCliente,
    deleteLote,
    updateRegistrosOracle,
    nameAlreadyExists,
    changeNameBloq
} from "../controllers/asignacion_lotes.controller"

const router = Router();

router.post("/createLote", createLote );
router.post("/updateLote", updateLote );
router.post("/nameAlreadyExists", nameAlreadyExists );
router.post("/changeNameBloq", changeNameBloq );
router.post("/getFoliosLotes", getFoliosLotes);
router.post("/getNombresLotesCliente", getNombresLotesCliente);
router.post("/getLoteCliente", getLoteCliente);
router.post("/getvinsregistered", getVINSRegistered);
router.post("/getvinscliente", getvinscliente);
router.post("/getvinsdisponiblescliente", getVinsDisponiblesCliente);
router.post("/updateregistrosoracle", updateRegistrosOracle);
router.delete("/deleteLote", deleteLote);

export default router;
