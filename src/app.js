import express from "express";
import cors from "cors"
import morgan from "morgan";
import path from 'path'
import multer from "multer";

import config from "./config"
import Clientes from "./routes/clientes.routes"
import AsignacionLotes from "./routes/asignacion_lotes.routes"
import AsignacionReferencia from "./routes/asignacion_referencia.routes"
import AsignacionFolioCompra from "./routes/asignacion_folio_compra.routes"
import ResumenContratos from "./routes/resumen_contratos.routes"
import OrdenDeCompra from "./routes/orden_de_compra.routes"
import datosDPPYContado from "./routes/datos_dpp_contado.routes"
import Login from "./routes/auth.routes"

const app = express()

app.set('port', config.port)

app.use(cors())
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(express.json({ limit: '10mb' }))

app.use("/api", Clientes);
app.use("/api", AsignacionLotes);
app.use("/api", AsignacionReferencia);
app.use("/api", AsignacionFolioCompra);
app.use("/api", ResumenContratos);
app.use("/api", OrdenDeCompra);
app.use("/api", datosDPPYContado);
app.use("/api", Login);

app.use(express.static(path.join(__dirname, 'public')))

app.get( '*', ( req, res ) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'))
})

export default app
