import { Router } from "express";
import multer from "multer";
import {
    getVinsCliente,
    createPermisoDesvio,
    getVinsClientToCancel,
    cancelFolioDesvio,
    getFoliosDesvioByCliente,
    getvinsclientetoDPP2orExt,
    createDPPFase2,
    createExtensionPermiso,
    getFechasExtensionesByVIN,
    downloadPDF,
    updatePermisoDesvio,
    getVinsClientToResumen,
    datesPermisoDesvioByFolio,
    getVinsClientToResumenPrint,
    datesPermisoDesvioByFolioDPP,
    get_ordenes_de_compra,
    get_limite_credito,
    update_nuevos_campos,
    fechaDePago,
    datesByVIN
} from "../controllers/datos_dpp_contado.controller"

const router = Router();
const upload = multer();

router.post("/dpp_contado/getvinscliente", getVinsCliente);//-done
router.post("/dpp_contado/getvinsclienttocancel", getVinsClientToCancel);
router.post("/dpp_contado/getvinsclienttoresumen", getVinsClientToResumen);
router.post("/dpp_contado/getvinsclienttoresumenPrint", getVinsClientToResumenPrint);
router.post("/dpp_contado/createpermisodesvio", createPermisoDesvio);
router.patch("/dpp_contado/updatepermisodesvio", updatePermisoDesvio);
router.patch("/dpp_contado/cancelfoliodesvio", cancelFolioDesvio);
router.post("/dpp_contado/getfoliosdesviobycliente", getFoliosDesvioByCliente);
router.post("/dpp_contado/getvinsclientetoDPP2orExt", getvinsclientetoDPP2orExt);
router.patch("/dpp_contado/createDPPFase2",createDPPFase2);
router.post("/dpp_contado/createExtensionPermiso", upload.single('file') ,createExtensionPermiso);
router.post("/dpp_contado/getFechasExtensionesByVIN", getFechasExtensionesByVIN);
router.post("/dpp_contado/downloadPDF", downloadPDF);
// router.post("/dpp_contado/datesPermisoDesvioByFolio", datesPermisoDesvioByFolio);
// router.post("/dpp_contado/datesPermisoDesvioByFolioDPP", datesPermisoDesvioByFolioDPP);
router.post("/dpp_contado/get_ordenes_de_compra", get_ordenes_de_compra);
router.post("/dpp_contado/get_limite_credito", get_limite_credito);
router.post("/dpp_contado/fechaDePago", fechaDePago);
router.post("/dpp_contado/datesByVIN", datesByVIN);
router.patch("/dpp_contado/update_nuevos_campos", update_nuevos_campos);

export default router;