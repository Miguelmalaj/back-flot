import { Router } from "express"
import multer from "multer";

import {
    tipovehiculos,
    get_tipovehiculos,
    create_orden_compra,
    get_orden_compra,
    update_orden_compra,
    send_pdf,
    get_ordenes_de_compra,
    get_vins_to_orden_compra,
    create_vins_with_orden_compra,
    update_vins_with_orden_compra,
    get_vins_to_estatus,
    get_statustyt_catalogo,
    update_vins_with_status,
    send_pdf_status,
    create_vins_status_bitacora,
    create_new_statustyt,
    get_vins_to_resumen,
    delete_tipos_orden_compra,
    post_tipos_orden_compra,
    exists_orden_compra,
    update_tipos_orden_compra,
    delete_vins_of_orden_compra,
    update_vins_with_status_recibo_factura,
    get_vins_vehicles,
    get_vins_vehicles_historial,
    get_tipos_vehiculos_por_orden,
    update_tipos_vehiculos,
    update_modelo_vins,
    delete_domicilios_orden_compra,
    post_domicilios_orden_compra,
    param_formato_facturacion,
    updatePrintedVINS,
    tiposveh_by_orden_cliente,
    set_client_number_bitacora,
    getDirectories,
    createDirectory,
    updateDirectory,
    getCityDestiny,
    getAsigCDO,
    getSinisters,
    createSinister,
    existVINSinister,
    updateVINSinister,
    getSinistersEstatus,
    updateEstatusVINSinister,
    pendingDocumentsSummary,
    updateDateAsignadoHistorial,
    updateDateAsignadoAsigVINS,
    updateDateAsignadoAsigVINS2,
    cancel_vin_factura,
    all_summary_vins,
    get_patio_ubicaciones
} from "../controllers/orden_de_compra.controller"

const router = Router();

const upload = multer(); 

router.post("/tipovehiculos", tipovehiculos);
router.post("/get_tipovehiculos", get_tipovehiculos);
router.post("/create_orden_compra", upload.single('file'), create_orden_compra);
router.post("/exists_orden_compra", exists_orden_compra);
router.patch("/update_orden_compra", upload.single('file'), update_orden_compra);
router.post("/post_tipos_orden_compra", post_tipos_orden_compra);
router.post("/post_domicilios_orden_compra", post_domicilios_orden_compra);
router.delete("/delete_tipos_orden_compra", delete_tipos_orden_compra);
router.delete("/delete_domicilios_orden_compra", delete_domicilios_orden_compra);
router.patch("/update_tipos_orden_compra", update_tipos_orden_compra);
router.post("/get_orden_compra",get_orden_compra);
router.post("/send_pdf",send_pdf);

router.post("/asignarvins/send_pdf",send_pdf_status);
router.post("/asignarvins/get_ordenes_de_compra", get_ordenes_de_compra);
router.post("/asignarvins/get_vins_to_orden_compra", get_vins_to_orden_compra);
router.post("/asignarvins/get_statustyt_catalogo", get_statustyt_catalogo);
router.post("/asignarvins/get_patios_ubicaciones", get_patio_ubicaciones);
router.post("/asignarvins/create_vins_with_orden_compra", create_vins_with_orden_compra);
router.patch("/asignarvins/update_vins_with_orden_compra", update_vins_with_orden_compra);
router.delete("/asignarvins/delete_vins_of_orden_compra", delete_vins_of_orden_compra);
router.post("/asignarvins/get_vins_to_estatus", get_vins_to_estatus);
router.patch("/asignarvins/update_vins_with_status", upload.single('file') , update_vins_with_status);
router.patch("/asignarvins/update_vins_with_status_recibo_factura", upload.single('file') , update_vins_with_status_recibo_factura);
router.post("/asignarvins/create_vins_status_bitacora", create_vins_status_bitacora);
router.post("/asignarvins/create_new_statustyt", create_new_statustyt);
router.post("/asignarvins/get_vins_to_resumen", get_vins_to_resumen);
router.post("/asignarvins/param_formato_facturacion", param_formato_facturacion);
router.post("/asignarvins/updatePrintedVINS", updatePrintedVINS);
router.post("/asignarvins/tiposveh_by_orden_cliente", tiposveh_by_orden_cliente);
router.post("/asignarvins/set_client_number_bitacora", set_client_number_bitacora);
router.post("/asignarvins/all_summary_vins", all_summary_vins);
router.patch("/asignarvins/cancelvinfact", cancel_vin_factura); 

router.patch("/ordencompra/update_modelo_vins", update_modelo_vins);
router.get("/ordencompra/get_asig_cdo", getAsigCDO);
router.post("/ordencompra/get_sinisters", getSinisters);
router.post("/ordencompra/create_sinister", createSinister);
router.post("/ordencompra/exist_vin_sinister", existVINSinister);
router.patch("/ordencompra/update_vin_sinister", updateVINSinister);
router.get("/ordencompra/get_sinisters_estatus", getSinistersEstatus);
router.patch("/ordencompra/update_estatus_vin_sinister", updateEstatusVINSinister);
router.post("/ordencompra/pending_documents_summary", pendingDocumentsSummary);
router.patch("/ordencompra/update_date_asignado_historial", updateDateAsignadoHistorial);
router.patch("/ordencompra/update_date_asignado_AsigVINS", updateDateAsignadoAsigVINS);
router.patch("/ordencompra/update_date_asignado_AsigVINS2", updateDateAsignadoAsigVINS2);

router.post("/directory/get_directories", getDirectories);
router.post("/directory/create_directory", createDirectory);
router.patch("/directory/update_directory", updateDirectory);
router.get("/directory/get_city_destiny", getCityDestiny);

router.post("/bitacora/get_vins_vehicles", get_vins_vehicles);
router.post("/bitacora/get_vins_vehicles_historial", get_vins_vehicles_historial);

router.patch("/asignadoscdos/update_tipos_vehiculos", update_tipos_vehiculos);

router.post("/resumen/get_tipos_vehiculos", get_tipos_vehiculos_por_orden);

export default router;                                                           