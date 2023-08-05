import { Router } from "express";
import {
    getClientes,
    updateClientes,
    createClientes,
    getClientesOrderedByPurchaseOrder,
    getClientesCatalog,
    contactsTypes,
    purchaseContacts,
    deleteContacts,
    createContacts
} from "../controllers/clientes.controller"

const router = Router();

router.post("/clientes", getClientes);
router.post("/clientes_catalog", getClientesCatalog);
router.post("/clientes_ordered", getClientesOrderedByPurchaseOrder);
router.patch("/clientes/update", updateClientes);
router.post("/clientes/create", createClientes);
router.post("/clientes/contactstypes", contactsTypes);
router.post("/clientes/purchasecontacts", purchaseContacts);
router.delete("/clientes/delete_contacts", deleteContacts);
router.post("/clientes/create_contacts", createContacts);

export default router;