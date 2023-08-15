import axios from "axios";
import path from 'path'
import { getConnection, querys, sql, storedProcedures } from "../database";
import { GMDates, PrevEntregDates, TyTDates, endPointTiposVehiculos } from "./helpers/constantes";
import { FechaDeHoy, invertirCadenaFecha, revertDate } from "./helpers/helpers";

const defaultDate = "1900-01-01"
const emptyString = ""

export const tipovehiculos = async ( req, res ) => {
    // const cuery = querys.addTipoVehiculo;

    try {
        const data = await getDataASP(); 
        const pool = await getConnection();
        for (const row of data['data']) {
            await pool.request()
            .input("Empresa",sql.Int, 1)
            .input("Sucursal",sql.Int,1)
            .input("NombreTipo",sql.VarChar,row.nombreTipo)
            .input("PaqueteTipo",sql.VarChar,row.paqueteTipo.trim())
            .input("Descripcion",sql.VarChar,row.descripcion.replace('  ',' ').trim())
            // .query( cuery );
            .execute( storedProcedures.spf_ordenCompraTipoVehiculo_crear );

        }  
        res.json({"msg":"registro completo"})

    } catch (error) {
        res.status(500);
        res.send(error.message);  
    }
}

const getDataASP = async () => {
    try {
        return await axios.get(endPointTiposVehiculos);
    } catch (error) {
        console.error(error)
    }
}

export const get_tipovehiculos = async ( req,res ) => {
    // const { Empresa, Sucursal } = req.body;
    // const cuery = querys.getTipoVehiculos;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            // .input("Empresa", sql.Int, Sucursal)
            // .input("Sucursal", sql.Int, Sucursal)
            // .query( cuery );
            // .execute( storedProcedures.spf_descripTipoVehiculos_leer );
            .execute( storedProcedures.spf_tipoVehiculosFlotillas_leer );

            res.json(result.recordset);

    } catch (error) {
        res.status(500);
        res.send(error.message);  
    }
}

export const post_tipos_orden_compra = async ( req, res ) => {
    const { agencia: { Empresa, Sucursal }, OrdenCompra } = req.body;

    try {
        const pool = await getConnection();
        for (const vehiculo of OrdenCompra.TiposYCantidades) {
            await pool.request()
            .input("Empresa",           sql.Int,      Empresa)   
            .input("Sucursal",          sql.Int,      Sucursal)  
            .input("OrdenCompra",       sql.VarChar,  OrdenCompra.OrdenCompra.toUpperCase()) 
            .input("TipoVehiculo",      sql.VarChar,  vehiculo.TipoVehiculo.toUpperCase())   
            .input("Cantidad",          sql.Int,      vehiculo.Cantidad)   
            .input("Asignados",         sql.Int,      vehiculo.Asignados)   
            .input("CDO",               sql.Int,      vehiculo.CDO)   
            .input("Seleccionados",     sql.Int,      vehiculo.Seleccionados) 
            .input("Num_cliente",       sql.Int,      OrdenCompra.Num_cliente)    
            .execute( storedProcedures.spf_logisticaOrdenCompra_tiposVeh_crear )
        }

        
        res.json({"isPosted": true})
        
    } catch (error) {
        res.status(500);
        res.send(error.message); 
    }

}

export const post_domicilios_orden_compra = async ( req, res ) => {
    const { agencia: { Empresa, Sucursal }, OrdenCompra } = req.body;

    try {

        const pool = await getConnection();

        for (const dom of OrdenCompra.InformacionDomicilio) {

            //spf_domicilioOrdenCompra_crear
            await pool.request()
            .input("Empresa",             sql.Int,      Empresa)   
            .input("Sucursal",            sql.Int,      Sucursal)
            .input("OrdenDeCompra",       sql.VarChar,  OrdenCompra.OrdenCompra.toUpperCase().trim()) 
            .input("PersonaReceptor",     sql.VarChar,  dom.PersonaReceptor.toUpperCase().trim()) 
            .input("CelularDeContacto",   sql.VarChar,  dom.CelularDeContacto.trim()) 
            .input("Agencia",             sql.VarChar,  dom.Agencia) 
            .input("CiudadDestino",       sql.VarChar,  dom.CiudadDestino.toUpperCase().trim()) 
            .input("DomicilioDeEntrega",  sql.VarChar,  dom.DomicilioDeEntrega.toUpperCase().trim()) 
            .input("NumeroDistribuidor",  sql.Int,      dom.NumeroDistribuidor == "" ? 0 : dom.NumeroDistribuidor) 
            .input("Num_cliente",         sql.Int,      OrdenCompra.Num_cliente)
            .input("Patio",               sql.VarChar,  dom.Patio)
            .execute( storedProcedures.spf_domicilioOrdenCompra_crear )
        }

        res.json({"isPosted": true})

    } catch (error) {
        res.status(500);
        res.send(error.message);  
        
    }
}

const create_orden_callback = async (req,res,cuerpo) => {
    /* const body = JSON.parse(cuerpo.body);
    const agencia = JSON.parse(cuerpo.agencia);
    let hasPDF = 'S';
    let bufferFicticio = '';
    // let cuery = querys.insertBinaryFilePDFnull;
    // let cuery = querys.insertBinaryFile;

    if ( req.file === undefined ) {
        // cuery = querys.insertBinaryFilePDFnull;
        hasPDF = 'N'
        bufferFicticio = Buffer.from('buffer ficticio')
    }
    
    try {

        const pool = await getConnection();

            await pool.request()
            .input("Empresa",       sql.Int,       agencia.Empresa)
            .input("Sucursal",      sql.Int,       agencia.Sucursal)
            .input("Cliente",       sql.VarChar,   body.Cliente)
            .input("Ubicacion",     sql.VarChar,   body.Ubicacion)
            .input("Num_cliente",   sql.Int,       body.Num_cliente)
            .input("OrdenCompra",   sql.VarChar,   body.OrdenCompra.toUpperCase())
            .input("Cantidad",      sql.Int,       body.Cantidad)
            .input("DocumentoPDF",  sql.VarBinary, hasPDF === 'S' ? req.file.buffer : bufferFicticio)
            .input("hasPDF", sql.VarChar,  hasPDF)
            .execute( storedProcedures.spf_ordenCompraBinaryFile_crear );

            for (const vehiculo of body.TiposYCantidades) {
                await pool.request()
                .input("Empresa",       sql.Int,      agencia.Empresa)   
                .input("Sucursal",      sql.Int,      agencia.Sucursal)  
                .input("OrdenCompra",   sql.VarChar,  body.OrdenCompra.toUpperCase()) 
                .input("TipoVehiculo",  sql.VarChar,  vehiculo.TipoVehiculo.toUpperCase())   
                .input("Cantidad",      sql.Int,      vehiculo.Cantidad)   
                .input("Asignados",     sql.Int,      vehiculo.Asignados)   
                .input("CDO",           sql.Int,      vehiculo.CDO)   
                .input("Seleccionados", sql.Int,      vehiculo.Seleccionados) 
                .input("Num_cliente",   sql.Int,      body.Num_cliente)  
                .execute( storedProcedures.spf_logisticaOrdenCompra_tiposVeh_crear )

            }

            for (const infoDom of body.InformacionDomicilio) {
                await pool.request()
                .input("Empresa",             sql.Int,      agencia.Empresa)   
                .input("Sucursal",            sql.Int,      agencia.Sucursal)  
                .input("OrdenDeCompra",       sql.VarChar,  body.OrdenCompra.toUpperCase()) 
                .input("PersonaReceptor",     sql.VarChar,  infoDom.PersonaReceptor) 
                .input("CelularDeContacto",   sql.VarChar,  infoDom.CelularDeContacto) 
                .input("Agencia",             sql.VarChar,  infoDom.Agencia) 
                .input("CiudadDestino",       sql.VarChar,  infoDom.CiudadDestino) 
                .input("DomicilioDeEntrega",  sql.VarChar,  infoDom.DomicilioDeEntrega) 
                .input("NumeroDistribuidor",  sql.Int,      infoDom.NumeroDistribuidor == "" ? 0 : infoDom.NumeroDistribuidor)
                .input("Num_cliente",         sql.Int,      body.Num_cliente)  
                .input("Patio",               sql.VarChar,  infoDom.Patio)
                .execute( storedProcedures.spf_domicilioOrdenCompra_crear )
                
            } 


            pool.close();
            
            res.json({"isCreated":true})

    } catch (error) {
        res.status(500);
        res.send(error.message);  
        
    } */

}

export const create_orden_compra = async (req,res) => {
    const cuerpo = req.body;
    // create_orden_callback(req,res,cuerpo);
    const body = JSON.parse(cuerpo.body);
    const agencia = JSON.parse(cuerpo.agencia);
    let hasPDF = 'S';
    let bufferFicticio = '';
    // let cuery = querys.insertBinaryFilePDFnull;
    // let cuery = querys.insertBinaryFile;

    if ( req.file === undefined ) {
        // cuery = querys.insertBinaryFilePDFnull;
        hasPDF = 'N'
        bufferFicticio = Buffer.from('buffer ficticio')
    }
    
    try {

        const pool = await getConnection();

            await pool.request()
            .input("Empresa",       sql.Int,       agencia.Empresa)
            .input("Sucursal",      sql.Int,       agencia.Sucursal)
            .input("Cliente",       sql.VarChar,   body.Cliente)
            .input("Ubicacion",     sql.VarChar,   body.Ubicacion)
            .input("Num_cliente",   sql.Int,       body.Num_cliente)
            .input("OrdenCompra",   sql.VarChar,   body.OrdenCompra.toUpperCase())
            .input("Cantidad",      sql.Int,       body.Cantidad)
            .input("DocumentoPDF",  sql.VarBinary, hasPDF === 'S' ? req.file.buffer : bufferFicticio)
            .input("hasPDF", sql.VarChar,  hasPDF)
            .execute( storedProcedures.spf_ordenCompraBinaryFile_crear );

            for (const vehiculo of body.TiposYCantidades) {
                await pool.request()
                .input("Empresa",       sql.Int,      agencia.Empresa)   
                .input("Sucursal",      sql.Int,      agencia.Sucursal)  
                .input("OrdenCompra",   sql.VarChar,  body.OrdenCompra.toUpperCase()) 
                .input("TipoVehiculo",  sql.VarChar,  vehiculo.TipoVehiculo.toUpperCase())   
                .input("Cantidad",      sql.Int,      vehiculo.Cantidad)   
                .input("Asignados",     sql.Int,      vehiculo.Asignados)   
                .input("CDO",           sql.Int,      vehiculo.CDO)   
                .input("Seleccionados", sql.Int,      vehiculo.Seleccionados) 
                .input("Num_cliente",   sql.Int,      body.Num_cliente)  
                .execute( storedProcedures.spf_logisticaOrdenCompra_tiposVeh_crear )

            }

            for (const infoDom of body.InformacionDomicilio) {
                await pool.request()
                .input("Empresa",             sql.Int,      agencia.Empresa)   
                .input("Sucursal",            sql.Int,      agencia.Sucursal)  
                .input("OrdenDeCompra",       sql.VarChar,  body.OrdenCompra.toUpperCase().trim()) 
                .input("PersonaReceptor",     sql.VarChar,  infoDom.PersonaReceptor.toUpperCase().trim()) 
                .input("CelularDeContacto",   sql.VarChar,  infoDom.CelularDeContacto.trim()) 
                .input("Agencia",             sql.VarChar,  infoDom.Agencia) 
                .input("CiudadDestino",       sql.VarChar,  infoDom.CiudadDestino.toUpperCase().trim()) 
                .input("DomicilioDeEntrega",  sql.VarChar,  infoDom.DomicilioDeEntrega.toUpperCase().trim()) 
                .input("NumeroDistribuidor",  sql.Int,      infoDom.NumeroDistribuidor == "" ? 0 : infoDom.NumeroDistribuidor)
                .input("Num_cliente",         sql.Int,      body.Num_cliente)  
                .input("Patio",               sql.VarChar,  infoDom.Patio)
                .execute( storedProcedures.spf_domicilioOrdenCompra_crear )
                
            } 


            pool.close();
            
            res.json({"isCreated":true})

    } catch (error) {
        res.status(500);
        res.send(error.message);  
        
    }
}

export const delete_tipos_orden_compra = async ( req,res ) => {
    const { agencia:{ Empresa, Sucursal }, OrdenCompra, Num_cliente } = req.body;

    try {
        const pool = await getConnection();
        await pool.request()
            .input("Empresa",      sql.Int,     Empresa)
            .input("Sucursal",     sql.Int,     Sucursal)
            .input("OrdenCompra",  sql.VarChar, OrdenCompra)
            .input("Num_cliente",  sql.Int,     Num_cliente)
            .execute( storedProcedures.spf_logisticaOrdenCompra_tiposVeh_eliminar );

            res.json({"isDeleted":true});    
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

    
}

export const delete_domicilios_orden_compra = async ( req, res ) => {
    const { agencia:{ Empresa, Sucursal }, OrdenCompra, Num_cliente } = req.body;
    try {
        const pool = await getConnection();
        await pool.request()
            .input("Empresa",        sql.Int,     Empresa)
            .input("Sucursal",       sql.Int,     Sucursal)
            .input("OrdenDeCompra",  sql.VarChar, OrdenCompra)
            .input("Num_cliente",    sql.Int,     Num_cliente)
            .execute( storedProcedures.spf_domicilioOrdenCompra_eliminar );

            res.json({"isDeleted":true});      
    } catch (error) {
        res.status(500);
        res.send(error.message);    
    }
}

export const update_orden_compra = async (req,res) => {
    const body = JSON.parse(req.body.body);
    const agencia = JSON.parse(req.body.agencia);
    let hasPDF = 'S';
    let bufferFicticio = '';
    // let cuery = querys.updateOrderWithoutPDF;    
    // cuery = querys.updateOrderWithPDF;

    if ( req.file === undefined ) {
        hasPDF = 'N'
        bufferFicticio = Buffer.from('buffer ficticio')
    }
    
    try {

        const pool = await getConnection();
            await pool.request()
            .input("Empresa", sql.Int, agencia.Empresa)
            .input("Sucursal", sql.Int, agencia.Sucursal)
            .input("Cliente", sql.VarChar, body.Cliente)
            .input("Ubicacion", sql.VarChar, body.Ubicacion)
            .input("OrdenCompra", sql.VarChar, body.OrdenCompra.toUpperCase())
            .input("Cantidad", sql.Int, body.Cantidad)
            .input("DocumentoPDF", sql.VarBinary, hasPDF === 'S' ? req.file.buffer : bufferFicticio)
            .input("hasPDF", sql.VarChar,  hasPDF)
            .input("Id", sql.Int, body.Id)
            .execute( storedProcedures.spf_ordenCompraBinaryFile_actualizar )

        res.json({"isUpdated":true})
    
    } catch (error) {
        res.status(500);
        res.send(error.message); 
    }
    
}

export const get_orden_compra = async (req,res) => {
    const { Empresa, Sucursal } = req.body;
    // const cuery = querys.getOrdenDeCompra;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa",sql.Int, Empresa)
            .input("Sucursal",sql.Int,Sucursal)
            .execute( storedProcedures.spf_ordenesDeCompra_leer );
            
            let finalResponse = [];
            for (const ordComp of result.recordset) {

                let tipoVehPorOrden = await pool.request()
                    .input("Empresa",      sql.Int,      Empresa)
                    .input("Sucursal",     sql.Int,      Sucursal)
                    .input("OrdenCompra",  sql.VarChar,  ordComp.OrdenCompra)
                    .input("Num_cliente",  sql.Int,      ordComp.Num_cliente)
                    .execute( storedProcedures.spf_logisticaOrdenCompra_tiposVeh_leer )
                
                let domiciliosPorOrden = await pool.request()
                    .input("Empresa",         sql.Int,        Empresa)
                    .input("Sucursal",        sql.Int,        Sucursal)
                    .input("OrdenDeCompra",   sql.VarChar,    ordComp.OrdenCompra)
                    .input("Num_cliente",     sql.Int,        ordComp.Num_cliente)
                    .execute( storedProcedures.spf_domicilioOrdenCompra_leer );
                

                let domicilios = []

                    if ( domiciliosPorOrden.recordset.length > 0 ) {
                        
                        for (const dom of domiciliosPorOrden.recordset) {

                            const agenciesByDom = await pool.request()
                                .input("Empresa",         sql.Int, Empresa)
                                .input("Sucursal",        sql.Int, Sucursal)
                                .input("CiudadDestino",   sql.VarChar, dom.CiudadDestino)
                                
                                .execute( storedProcedures.spf_agenciasPorCiudadDistFlot_leer );

                            let newObj = {
                                ...dom,
                                agenciasPorCiudad: agenciesByDom.recordset
                            }

                            domicilios.push( newObj );    
                                
                        }
                    }

                finalResponse.push({
                    ...ordComp,
                    TiposYCantidades     : tipoVehPorOrden.recordset,
                    InformacionDomicilio : domicilios,
                    // InformacionDomicilio : domiciliosPorOrden.recordset,
                    // ContactosDeCompra    : contactosDomicilio
                })    
            }
            
            res.json(finalResponse)

    } catch (error) {
        res.status(500);
        res.send(error.message);  
        console.log(error.message);
    }
}

export const send_pdf = async ( req, res ) => {
    const { Id, agencia } = req.body;
    const { Empresa, Sucursal } = agencia;
    // const cuery = querys.getDocumentPDFById

    try {
        let buffer;
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa",sql.Int, Empresa)
            .input("Sucursal",sql.Int,Sucursal)
            .input("Id",sql.Int, Id)
            // .query( cuery );
            .execute( storedProcedures.spf_ordenCompraPDFById_leer );

            pool.close();

        if ( result.recordset.length > 0 ) buffer = result.recordset[0].DocumentoPDF;
        res.set('Content-Type', 'application/pdf')

        res.send(buffer)

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

} 

export const send_pdf_status = async ( req, res ) => {
    const { VIN, agencia, PDF } = req.body;
    const { Empresa, Sucursal } = agencia;

    try {
        let buffer;
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa",   sql.Int,       Empresa)
            .input("Sucursal",  sql.Int,       Sucursal)
            .input("VIN",       sql.VarChar,   VIN)
            .input("PDF",       sql.VarChar,   PDF)
            .execute( storedProcedures.spf_logisticaVinsToStatusPDF_leer )
            
            pool.close();
        
            if ( result.recordset.length > 0 ) buffer = result.recordset[0].DocPDF;
            res.set('Content-Type', 'application/pdf')

            res.send(buffer)
            
    } catch (error) {
        res.status(500);
        res.send(error.message); 
    }
}

export const get_ordenes_de_compra = async ( req, res ) => {
    const { Agencia:{ Empresa, Sucursal }, NombreCliente, UbicacionCliente, Num_cliente } = req.body;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa",       sql.Int, Empresa)
            .input("Sucursal",      sql.Int, Sucursal)
            .input("Cliente",       sql.VarChar, NombreCliente)
            .input("Ubicacion",     sql.VarChar, UbicacionCliente)
            .input("Num_cliente",   sql.Int, Num_cliente)
            .execute( storedProcedures.spf_ordenesDeCompraByCliente_leer )
            
            let finalResponse = [];
            for (const ordComp of result.recordset) {
                let response = await pool.request()
                    .input("Empresa",      sql.Int,      Empresa)
                    .input("Sucursal",     sql.Int,      Sucursal)
                    .input("OrdenCompra",  sql.VarChar,  ordComp.OrdenCompra)
                    .input("Num_cliente",  sql.Int,      Num_cliente)
                    .execute( storedProcedures.spf_logisticaOrdenCompra_tiposVeh_leer )

                let domiciliosPorOrden = await pool.request()
                    .input("Empresa",        sql.Int,      Empresa)
                    .input("Sucursal",       sql.Int,      Sucursal)
                    .input("OrdenDeCompra",  sql.VarChar,  ordComp.OrdenCompra)
                    .input("Num_cliente",    sql.Int,      Num_cliente)
                    .execute( storedProcedures.spf_domicilioOrdenCompra_leer );

                finalResponse.push({
                    ...ordComp,
                    TiposYCantidades     : response.recordset,
                    InformacionDomicilio : domiciliosPorOrden.recordset
                })    
            }

            // res.json(result.recordset)
            res.json(finalResponse)
            // pool.close()

    } catch (error) {
        res.status(500);
        res.send(error.message);
        
    }
}

export const tiposveh_by_orden_cliente = async ( req, res ) => {
    const { OrdenCompra, Num_cliente } = req.body;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("OrdenCompra",  sql.VarChar,  OrdenCompra )
            .input("Num_cliente",  sql.Int,      Num_cliente )
            .input("Empresa",      sql.Int,      5 )
            .input("Sucursal",     sql.Int,      1 )
            .execute( storedProcedures.spf_logisticaOrdenCompra_tiposVeh_leer );
            
            res.json({ 
                TiposYCantidades : result.recordset 
            });

    } catch (error) {
        res.status(500);
        res.send(error.message);    
    }
}

export const get_vins_to_orden_compra = async ( req, res ) => {
    const { Agencia:{ Empresa, Sucursal }, NumeroCliente } = req.body;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa",       sql.Int, Empresa)
            .input("Sucursal",      sql.Int, Sucursal)
            .input("NumCliente",    sql.Int, NumeroCliente)
            .execute( storedProcedures.spf_logisticaVinsOrdenDeCompra2_leer )
            
            res.json(result.recordset)
            pool.close()
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const update_tipos_orden_compra = async ( req, res ) => {
    const { agencia:{ Empresa, Sucursal }, TiposYCantidades, NumeroCliente } = req.body;

    try {
        const pool = await getConnection();
        for (const vehiculo of TiposYCantidades) {
            await pool.request()
            .input("Empresa",           sql.Int,      Empresa)   
            .input("Sucursal",          sql.Int,      Sucursal)  
            .input("OrdenCompra",       sql.VarChar,  vehiculo.OrdenCompra) 
            .input("TipoVehiculo",      sql.VarChar,  vehiculo.TipoVehiculo)   
            .input("Seleccionados",     sql.Int,      vehiculo.Seleccionados)   
            .input("Num_cliente",       sql.Int,      NumeroCliente)   
            .execute( storedProcedures.spf_logisticaOrdenCompra_tiposVeh_actualizar )
        }

        res.json({"isUpdated":true})
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
          
    }

    
}

export const create_vins_with_orden_compra = async ( req, res ) => {
    const { agencia: { Empresa, Sucursal }, data } = req.body;
    let vinsToUpdateList = []

    try {
        const pool = await getConnection();

        const result = await pool.request()
            .input("Empresa",  sql.Int, Empresa)
            .input("Sucursal", sql.Int, Sucursal)
            .execute( storedProcedures.spf_logisticaVINSOrdenAsignado_leer )

        const SigOrdenAsignado = result.recordset[0].ordenAsignados;

        for (const obj of data) {

            const [ , mod, ] = obj.Inventario.replace('  ','-').split('-');

            if ( !obj.isOnBD  ) {
                await pool.request()
                .input("Empresa",                sql.Int,       Empresa)
                .input("Sucursal",               sql.Int,       Sucursal)
                .input("Cliente",                sql.Int,       obj.NumCliente)
                .input("VIN",                    sql.VarChar,   obj.Vin)
                .input("Inventario",             sql.VarChar,   obj.Inventario.split('-').pop())
                .input("Modelo",                 sql.VarChar,   mod)
                .input("Factura",                sql.VarChar,   obj.Factura)
                .input("NombreCliente",          sql.VarChar,   obj.NombreCliente)
                .input("Ubicacion",              sql.VarChar,   obj.Ubicacion)
                .input("Vehiculo",               sql.VarChar,   obj.Vehiculo)
                .input("OrdenDeCompra",          sql.VarChar,   obj.OrdenDeCompra)
                .input("CelularDeContacto",      sql.VarChar,   obj.CelularDeContacto)
                .input("PersonaReceptor",        sql.VarChar,   obj.PersonaReceptor)
                .input("Agencia",                sql.VarChar,   obj.Agencia)
                .input("CiudadDestino",          sql.VarChar,   obj.CiudadDestino)
                .input("DomicilioDeEntrega",     sql.VarChar,   obj.DomicilioDeEntrega)
                .input("NumeroDistribuidor",     sql.Int,       obj.NumeroDistribuidor)
                .input("ordenAsignados",         sql.Int,       SigOrdenAsignado)
                .input("Color",                  sql.VarChar,   obj.Color.trim())
                .input("FechaAsignado",          sql.Date,      obj.Asignado.substring( 0, 10 ))
                .input("FechaVinAsignado",       sql.Date,      obj.FechaVinAsignado)
                .execute( storedProcedures.spf_logisticaVinsOrdenDeCompra_crear )

            }

            if ( obj.isOnBD ) {
                vinsToUpdateList.push(obj)
            }
            
        }

        pool.close()
        res.json({
            "isCreated":true,
            "vinsToUpdateList": vinsToUpdateList
        })

    } catch (error) {
        res.status(500);
        res.send(error.message); 
        
    }
}

export const delete_vins_of_orden_compra = async ( req, res ) => {
    const { agencia:{ Empresa, Sucursal }, VINClientestoDelete } = req.body;

  try {
    const pool = await getConnection();
        for (const obj of VINClientestoDelete) {
            await pool.request()
            .input("Empresa",   sql.Int,     Empresa)
            .input("Sucursal",  sql.Int,     Sucursal)
            .input("VIN",       sql.VarChar, obj.Vin)
            .input("Cliente",   sql.Int,     obj.NumCliente)
            .execute( storedProcedures.spf_logisticaVinsOrdenDeCompra_eliminar )

        }

        res.json({"isDeleted": true})  
        
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }  
}

export const update_vins_with_status_recibo_factura = async ( req, res ) => {
    const { Empresa, Sucursal } = JSON.parse(req.body.agencia);
    const  body  = JSON.parse(req.body.body);
    const  PDF  = JSON.parse(req.body.PDF);
    const {
        NombreCliente,
        NumeroCliente,  
        VIN  
    } = body;

    const bufferFile = req.file?.buffer;

    try {
        const pool = await getConnection();
            await pool.request()
            .input("Empresa",       sql.Int,        Empresa)
            .input("Sucursal",      sql.Int,        Sucursal)
            .input("NombreCliente", sql.VarChar,    NombreCliente) 
            .input("Cliente",       sql.Int,        NumeroCliente)
            .input("VIN",           sql.VarChar,    VIN) 
            .input("typePDF",       sql.VarChar,    PDF)
            .input("filePDF",       sql.VarBinary,  bufferFile) 
            .execute( storedProcedures.spf_logisticaVinsEstatusPDF_actualizar )

            pool.close();
        res.json({"isUpdated": true})

        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

export const update_vins_with_status = async ( req, res ) => {
    const { Empresa, Sucursal } = JSON.parse(req.body.agencia);

    const { user } = JSON.parse(req.body.user);

    const body = JSON.parse(req.body.body);

    const { 
        FechaSolicitudGPS, 
        FechaAceptacionGPS, 
        EstatusGPS, 
        EstatusPrevia, 
        EstatusTyT,
        Patio, 
        FechaEntregaCliente,  
        FechaDeEnvioDocum,  
        FechaDeRecepcion,  
        Observaciones,  
        ObservacionesTyT,  
        ObservacionesVIN,  
        NombreCliente,
        NumeroCliente,  
        VIN,
        retiroDuplicadoLlave,
        
        FechaDetencionSolicit,
        FechaDetencionAut,
        FechaGPSSolicit,
        FechaGPSAut,
        FechaSegregacionAut,
        FechaAccesoSolicit,
        FechaAccesoAut,
        FechaPreviaSolicit,
        FechaPreviaAut,
        FechaLiberacionSolicit,
        FechaLiberacionAut,
        FechaCalidadSolicit,
        FechaCalidadAut,
        FechaPagoSolicit,
        FechaPagoAut,
        Pago,

        FechaInterplantaIngreso,
        FechaInterplantaSalida,
        FechaArmViajeIngreso,
        FechaArmViajeSalida,
        FechaAsigSinMadrinaIngreso,
        FechaAsigSinMadrinaSalida,
        FechaAsigEnMadrinaIngreso,
        FechaAsigEnMadrinaSalida,
        FechaTransitoIngreso,
        FechaTransitoSalida,

    } = body;

    let hasPDF = '';
    let bufferFicticio = '';
    const bufferFile = req.file?.buffer;

    if ( bufferFile === undefined ) {
         hasPDF = 'N'
         bufferFicticio = Buffer.from('buffer ficticio')
    }

    const ValidatedEstatusTyT = EstatusTyT.toString().split("|").pop() == 0 ? '1' : EstatusTyT.toString().split("|").pop();
    const ValidatedPatio      = Patio.toString().split("|").pop();

    try {
        const pool = await getConnection();
            await pool.request()
                .input("Empresa",               sql.Int,        Empresa)
                .input("Sucursal",              sql.Int,        Sucursal)
                .input("FechaSolicitudGPS",     sql.Date,       FechaSolicitudGPS === emptyString ? defaultDate : FechaSolicitudGPS.toString().substring( 0,10 ))
                .input("FechaAceptacionGPS",    sql.Date,       FechaAceptacionGPS === emptyString ? defaultDate : FechaAceptacionGPS.toString().substring( 0,10 ))
                .input("EstatusGPS",            sql.VarChar,    EstatusGPS)
                .input("EstatusPrevia",         sql.VarChar,    EstatusPrevia)
                // .input("EstatusTyT",            sql.Int,        EstatusTyT.toString().split("|").pop()) 
                .input("EstatusTyT",            sql.Int,        ValidatedEstatusTyT) 
                .input("Patio",                 sql.Int,        ValidatedPatio == 'PATIO' ? 1 : ValidatedPatio) 
                .input("FechaEntregaCliente",   sql.Date,       FechaEntregaCliente === emptyString ? defaultDate : FechaEntregaCliente.toString().substring( 0,10 )) 
                .input("FechaDeEnvioDocum",     sql.Date,       FechaDeEnvioDocum === emptyString ? defaultDate : FechaDeEnvioDocum.toString().substring( 0,10 )) 
                .input("FechaDeRecepcion",      sql.Date,       FechaDeRecepcion === emptyString ? defaultDate : FechaDeRecepcion.toString().substring( 0,10 )) 
                .input("Observaciones",         sql.VarChar,    Observaciones) 
                .input("ObservacionesTyT",      sql.VarChar,    ObservacionesTyT) 
                .input("ObservacionesVIN",      sql.VarChar,    ObservacionesVIN) 
                .input("NombreCliente",         sql.VarChar,    NombreCliente) 
                .input("Cliente",               sql.Int,        NumeroCliente) 
                .input("VIN",                   sql.VarChar,    VIN) 
                .input("CartaClientePDF",       sql.VarBinary,  hasPDF === '' ? bufferFile : bufferFicticio) 
                .input("hasPDF",                sql.VarChar,    hasPDF) 
                .input("retiroDuplicadoLlave",  sql.Int,        retiroDuplicadoLlave) 
                .input("Asignado",              sql.Int,        1) 
                .input("UsuarioModificacion",   sql.VarChar,    user) 
                //new properties
                .input("FechaDetencionSolicit",  sql.Date,      FechaDetencionSolicit === emptyString ? defaultDate : FechaDetencionSolicit.toString().substring( 0,10 )) 
                .input("FechaDetencionAut",      sql.Date,      FechaDetencionAut === emptyString ? defaultDate : FechaDetencionAut.toString().substring( 0,10 )) 
                .input("FechaGPSSolicit",        sql.Date,      FechaGPSSolicit === emptyString ? defaultDate : FechaGPSSolicit.toString().substring( 0,10 )) 
                .input("FechaGPSAut",            sql.Date,      FechaGPSAut === emptyString ? defaultDate : FechaGPSAut.toString().substring( 0,10 )) 
                .input("FechaSegregacionAut",    sql.Date,      FechaSegregacionAut === emptyString ? defaultDate : FechaSegregacionAut.toString().substring( 0,10 )) 
                .input("FechaAccesoSolicit",     sql.Date,      FechaAccesoSolicit === emptyString ? defaultDate : FechaAccesoSolicit.toString().substring( 0,10 )) 
                .input("FechaAccesoAut",         sql.Date,      FechaAccesoAut === emptyString ? defaultDate : FechaAccesoAut.toString().substring( 0,10 )) 
                .input("FechaPreviaSolicit",     sql.Date,      FechaPreviaSolicit === emptyString ? defaultDate : FechaPreviaSolicit.toString().substring( 0,10 )) 
                .input("FechaPreviaAut",         sql.Date,      FechaPreviaAut === emptyString ? defaultDate : FechaPreviaAut.toString().substring( 0,10 )) 
                .input("FechaLiberacionSolicit", sql.Date,      FechaLiberacionSolicit === emptyString ? defaultDate : FechaLiberacionSolicit.toString().substring( 0,10 )) 
                .input("FechaLiberacionAut",     sql.Date,      FechaLiberacionAut === emptyString ? defaultDate : FechaLiberacionAut.toString().substring( 0,10 )) 
                .input("FechaCalidadSolicit",    sql.Date,      FechaCalidadSolicit === emptyString ? defaultDate : FechaCalidadSolicit.toString().substring( 0,10 )) 
                .input("FechaCalidadAut",        sql.Date,      FechaCalidadAut === emptyString ? defaultDate : FechaCalidadAut.toString().substring( 0,10 )) 
                .input("FechaPagoSolicit",       sql.Date,      FechaPagoSolicit === emptyString ? defaultDate : FechaPagoSolicit.toString().substring( 0,10 )) 
                .input("FechaPagoAut",           sql.Date,      FechaPagoAut === emptyString ? defaultDate : FechaPagoAut.toString().substring( 0,10 )) 
                .input("Pago",                   sql.VarChar,   Pago) 
                //estatus tyt dates
                .input("FechaInterplantaIngreso",    sql.Date,  FechaInterplantaIngreso === emptyString ? defaultDate : FechaInterplantaIngreso.toString().substring( 0,10 )) 
                .input("FechaInterplantaSalida",     sql.Date,  FechaInterplantaSalida === emptyString ? defaultDate : FechaInterplantaSalida.toString().substring( 0,10 )) 
                .input("FechaArmViajeIngreso",       sql.Date,  FechaArmViajeIngreso === emptyString ? defaultDate : FechaArmViajeIngreso.toString().substring( 0,10 )) 
                .input("FechaArmViajeSalida",        sql.Date,  FechaArmViajeSalida === emptyString ? defaultDate : FechaArmViajeSalida.toString().substring( 0,10 )) 
                .input("FechaAsigSinMadrinaIngreso", sql.Date,  FechaAsigSinMadrinaIngreso === emptyString ? defaultDate : FechaAsigSinMadrinaIngreso.toString().substring( 0,10 )) 
                .input("FechaAsigSinMadrinaSalida",  sql.Date,  FechaAsigSinMadrinaSalida === emptyString ? defaultDate : FechaAsigSinMadrinaSalida.toString().substring( 0,10 )) 
                .input("FechaAsigEnMadrinaIngreso",  sql.Date,  FechaAsigEnMadrinaIngreso === emptyString ? defaultDate : FechaAsigEnMadrinaIngreso.toString().substring( 0,10 )) 
                .input("FechaAsigEnMadrinaSalida",   sql.Date,  FechaAsigEnMadrinaSalida === emptyString ? defaultDate : FechaAsigEnMadrinaSalida.toString().substring( 0,10 )) 
                .input("FechaTransitoIngreso",       sql.Date,  FechaTransitoIngreso === emptyString ? defaultDate : FechaTransitoIngreso.toString().substring( 0,10 )) 
                .input("FechaTransitoSalida",        sql.Date,  FechaTransitoSalida === emptyString ? defaultDate : FechaTransitoSalida.toString().substring( 0,10 )) 
                .execute( storedProcedures.spf_logisticaVinsEstatus_actualizar )

                pool.close();
        
        res.json({"isUpdated": true})

        
    } catch (error) {
        res.status(500);
        res.send(error.message);

        console.log(error.message);
       
    }

}

export const create_vins_status_bitacora = async ( req, res ) => {
    const { agencia:{ Empresa, Sucursal }, body } = req.body;
    const { 
        VIN,
        EstatusTyT,
        Observaciones,
        ObservacionesTyT,
        ObservacionesVIN,
        Vehiculo,
        OrdenDeCompra,
        NumeroCliente
    } = body;

    const ValidatedEstatusTyT = EstatusTyT.toString().split("|").shift() == 0 ? 'EN PATIO' : EstatusTyT.toString().split("|").shift();

    try {
        const pool = await getConnection();
            await pool.request()
            .input("Empresa",               sql.Int,        Empresa)
            .input("Sucursal",              sql.Int,        Sucursal)
            .input("VIN",                   sql.VarChar,    VIN)
            // .input("EstatusTyT",            sql.VarChar,    EstatusTyT.toString().split("|").shift()) //TODO: validar cuando el valor es 0.
            .input("EstatusTyT",            sql.VarChar,    ValidatedEstatusTyT) //TODO: validar cuando el valor es 0.
            .input("Observaciones",         sql.VarChar,    Observaciones)
            .input("ObservacionesTyT",      sql.VarChar,    ObservacionesTyT)
            .input("ObservacionesVIN",      sql.VarChar,    ObservacionesVIN)
            .input("Vehiculo",              sql.VarChar,    Vehiculo)
            .input("OrdenDeCompra",         sql.VarChar,    OrdenDeCompra)
            .input("Cliente",                sql.Int,        NumeroCliente)
            .execute( storedProcedures.spf_BitacoraStatusTyT_crear  )
            pool.close();

        res.json({"isCreated": true})

    } catch (error) {
        res.status(500);
        res.send(error.message);
       
    }

}

export const create_new_statustyt = async ( req, res ) => {
    const { agencia:{ Empresa, Sucursal }, newEstatusTyT } = req.body;

    try {
       let isCreated = true;
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa",          sql.Int,      Empresa)
            .input("Sucursal",         sql.Int,      Sucursal)
            .input("nombreEstatus",    sql.VarChar,  newEstatusTyT.toUpperCase().trim())
            .execute( storedProcedures.spf_EstatusTyT_leer )

            if ( result.recordset.length >   0 ) isCreated = false;

            if ( result.recordset.length === 0 ) { 
                await pool.request()
                .input("Empresa",          sql.Int,      Empresa)
                .input("Sucursal",         sql.Int,      Sucursal)
                .input("nombreEstatus",    sql.VarChar,  newEstatusTyT.toUpperCase().trim())
                .execute( storedProcedures.spf_newEstatusTyT_crear )
            }

        res.json({"isCreated": isCreated })
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const update_vins_with_orden_compra = async ( req, res ) => {
    const { agencia: { Empresa, Sucursal }, data } = req.body;

    try {
        const pool = await getConnection();
        for (const obj of data) {

            const [ , mod, ] = obj.Inventario.replace('  ','-').split('-');

            await pool.request()
                  .input("Empresa",                sql.Int,      Empresa)
                  .input("Sucursal",               sql.Int,      Sucursal)
                  .input("Cliente",                sql.Int,      obj.NumCliente)
                  .input("VIN",                    sql.VarChar,  obj.Vin)
                  .input("Inventario",             sql.VarChar,  obj.Inventario.split('-').pop())
                  .input("Modelo",                 sql.VarChar,  mod)
                  .input("Factura",                sql.VarChar,  obj.Factura)
                  .input("NombreCliente",          sql.VarChar,  obj.NombreCliente)
                  .input("Ubicacion",              sql.VarChar,  obj.Ubicacion)
                  .input("Vehiculo",               sql.VarChar,  obj.Vehiculo)
                  .input("OrdenDeCompra",          sql.VarChar,  obj.OrdenDeCompra)
                  .input("CelularDeContacto",      sql.VarChar,  obj.CelularDeContacto)
                  .input("PersonaReceptor",        sql.VarChar,  obj.PersonaReceptor)
                  .input("Agencia",                sql.VarChar,  obj.Agencia)
                  .input("CiudadDestino",          sql.VarChar,  obj.CiudadDestino)
                  .input("DomicilioDeEntrega",     sql.VarChar,  obj.DomicilioDeEntrega)
                  .input("NumeroDistribuidor",     sql.Int,      obj.NumeroDistribuidor)
                  .execute( storedProcedures.spf_logisticaVinsOrdenDeCompra_actualizar )
        }

        pool.close()
        res.json({"isUpdated":true})

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

export const exists_orden_compra = async ( req, res ) => {
    const { agencia: { Empresa, Sucursal }, Cliente, Ubicacion, OrdenCompra, Num_cliente } = req.body;
    let exist = false;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa",       sql.Int,      Empresa)   
            .input("Sucursal",      sql.Int,      Sucursal)  
            .input("Cliente",       sql.VarChar,  Cliente)
            .input("Ubicacion",     sql.VarChar,  Ubicacion)
            .input("OrdenCompra",   sql.VarChar,  OrdenCompra.toUpperCase())
            .input("Num_cliente",   sql.Int,      Num_cliente)
            .execute( storedProcedures.spf_existsOrdenCompra_leer );

            if ( result.rowsAffected[0] > 0 ) exist = true;

            res.json({"isRegistered" : exist})

    } catch (error) {
        res.status(500);
        res.send(error.message);  
    }

    
}

export const get_vins_to_estatus = async ( req, res ) => {
    const { Agencia: { Empresa, Sucursal }, Cliente, OrdenDeCompra } = req.body;

    try {
        const pool = await getConnection();
            const result = await pool.request()
            .input("Empresa",         sql.Int,          Empresa)
            .input("Sucursal",        sql.Int,          Sucursal)
            .input("Cliente",         sql.Int,          Cliente)
            .input("OrdenDeCompra",   sql.NVarChar,     OrdenDeCompra)
            .execute( storedProcedures.spf_logisticaVinsToStatus_leer )

            let dataList = [];
            
            for (let obj of result.recordset) {
                let nameDateGM = '';
                let nameDateTyT = '';

                obj = { ...JSON.parse( JSON.stringify(obj) ) };

                /* GM */
                if ( obj.EstatusTyT !== '0' && obj.FechaLiberacionAut.substring( 0,10 ) !== defaultDate ) nameDateGM = 'FechaLiberacionAut';

                if ( obj.EstatusTyT !== '0' && obj.FechaCalidadAut.substring( 0,10 ) !== defaultDate ) nameDateGM = 'FechaCalidadAut';

                if ( obj.EstatusTyT !== '0' && obj.FechaCalidadAut.substring( 0,10 ) === defaultDate && obj.FechaLiberacionAut.substring( 0,10 ) === defaultDate ) {
                    
                    const { objMod, FechaGM } = await getTotalGMDays( obj, pool );
                    
                    nameDateGM = FechaGM;

                    obj = objMod;

                }

                /* TYT */
                if ( obj.EstatusTyT !== '0' && obj.FechaTransitoSalida.substring( 0,10 ) === defaultDate ) {

                    const { objMod, FechaTyT } = await getTotalTyTDays( obj, pool, nameDateGM );

                    nameDateTyT = FechaTyT;

                    obj = objMod;

                }

                /* PREVIAENTREGADISTRIB */
                if ( obj.EstatusTyT !== '0' && obj.FechaEntregaCliente.substring( 0,10 ) !== defaultDate && obj.FechaTransitoSalida.substring( 0,10 ) === defaultDate ) {

                    const { objMod } = await getTotalPrevEntreg( obj, pool, nameDateTyT);

                    obj = objMod;

                }

                if ( obj.EstatusTyT !== '0' && obj.FechaEntregaCliente.substring( 0,10 ) === defaultDate ) {
                    obj = {
                        ...obj,
                        DiasPreviaEntrega: obj.DiasTyT
                    }
                }
                
                dataList = [ ...dataList, { ...obj }];
                
            }
            
            res.json( dataList );

    } catch (error) {
        res.status(500);
        res.send(error.message);
        
    }
}

export const get_statustyt_catalogo = async ( req, res ) => {
    const { agencia:{ Empresa, Sucursal } } = req.body;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa",       sql.Int, Empresa)
            .input("Sucursal",      sql.Int, Sucursal)
            .execute( storedProcedures.spf_EstatusTyTCatalogo_leer )
            res.json(result.recordset)

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

export const get_patio_ubicaciones = async ( req, res ) => {
    const { agencia:{ Empresa, Sucursal } } = req.body;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa",       sql.Int, Empresa)
            .input("Sucursal",      sql.Int, Sucursal)
            
            .execute( storedProcedures.spf_patiosUbicaciones_leer )
            res.json(result.recordset)

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

export const get_vins_to_resumen = async ( req, res ) => {
    const { Agencia: { Empresa, Sucursal }, Cliente, Estado, OrdenDeCompra, Vehiculo } = req.body;

    try {
        const pool = await getConnection();
            const result = await pool.request()
            .input("Empresa",           sql.Int,          Empresa)
            .input("Sucursal",          sql.Int,          Sucursal)
            .input("Cliente",           sql.Int,          Cliente)
            .input("Estado",            sql.VarChar,      Estado)
            .input("OrdenDeCompra",     sql.VarChar,      OrdenDeCompra)
            .input("Vehiculo",          sql.VarChar,      Vehiculo)
            .execute( storedProcedures.spf_logisticaVinsToResum_leer )
            pool.close()
            res.json(result.recordset)

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const get_vins_vehicles = async ( req, res ) => {
    const { Agencia: { Empresa, Sucursal }, OrdenDeCompra } = req.body;
    try {
        const pool = await getConnection();
            const result = await pool.request()
            .input("Empresa",           sql.Int,          Empresa)
            .input("Sucursal",          sql.Int,          Sucursal)
            .input("OrdenCompra",     sql.VarChar,      OrdenDeCompra)
            .execute( storedProcedures.spf_vehiculos_VINS_bitacora_leer )
            pool.close();
            res.json(result.recordset);
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const get_vins_vehicles_historial = async ( req, res ) => {
    
    const { Agencia: { Empresa, Sucursal } } = req.body;

    try {
        const pool = await getConnection();
            const result = await pool.request()
            .input("Empresa",        sql.Int,          Empresa)
            .input("Sucursal",       sql.Int,          Sucursal)
            
            .execute( storedProcedures.spf_historial_VINS_bitacora_leer2 )
            
            pool.close();
            res.json(result.recordset);
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

export const get_tipos_vehiculos_por_orden = async ( req, res ) => {
    const { Agencia: { Empresa, Sucursal }, OrdenDeCompra } = req.body;
    try {
        const pool = await getConnection();
            const result = await pool.request()
            .input("Empresa",        sql.Int,          Empresa)
            .input("Sucursal",       sql.Int,          Sucursal)
            .input("OrdenDeCompra",  sql.VarChar,      OrdenDeCompra)
            .execute( storedProcedures.spf_paquetesVehiculosPorOrden_leer )
            
            pool.close();
            res.json(result.recordset);
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const update_tipos_vehiculos = async ( req, res ) => {
    const { agencia:{ Empresa, Sucursal }, data, Num_cliente } = req.body;

    try {
        const pool = await getConnection();
        for (const veh of data) {
            await pool.request()
            .input("Empresa",           sql.Int,      Empresa)   
            .input("Sucursal",          sql.Int,      Sucursal)  
            .input("OrdenCompra",       sql.VarChar,  veh.OrdenCompra) 
            .input("TipoVehiculo",      sql.VarChar,  veh.TipoVehiculo) 
            .input("Asignados",         sql.Int,      veh.Asignados)   
            .input("CDO",               sql.Int,      veh.CDO)
            .input("Num_cliente",       sql.Int,      veh.Num_cliente)
            .execute( storedProcedures.spf_tiposVeh_AsigCDO_actualizar );
        }

        res.json({"isUpdated": true})

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

export const param_formato_facturacion = async ( req, res ) => {
    const { agencia:{ Empresa, Sucursal } } = req.body;

    try {
        const pool = await getConnection();
        const result = await pool.request()
        .input("Empresa",    sql.Int,  Empresa)   
        .input("Sucursal",   sql.Int,  Sucursal)
        .execute( storedProcedures.spf_paramsFlotillas_leer )
        
        // pool.close();
        res.json(result.recordset);

    } catch (error) {
        res.status(500);
        res.send(error.message);    
    }

}

export const updatePrintedVINS = async ( req, res ) => {
    const { OrdenDeCompra, Num_cliente, data } = req.body;
    const numCliente = Number(Num_cliente);

    try {
        const pool = await getConnection();
        
        for (const obj of data) {
            await pool.request()
            .input("OrdenDeCompra",   sql.VarChar,   OrdenDeCompra)
            .input("Num_cliente",     sql.Int,       numCliente)
            .input("VIN",             sql.VarChar,   obj.Vin)
            .execute( storedProcedures.spf_VINSFormatoFactura_actualizar )
        }

        // pool.close();
        res.json({"isUpdated": true});
        
    } catch (error) {
        res.status(500);
        res.send(error.message);    
        
    }
}

export const getDirectories = async ( req, res ) => {
    const { agencia:{ Empresa, Sucursal } } = req.body;

    try {
        const pool = await getConnection();
        const response = await pool.request()
            .input("Empresa", sql.Int, Empresa)
            .input("Sucursal", sql.Int, Sucursal)
            .execute( storedProcedures.spf_DirectoriosFlotillas_leer ) //TODO: create stored procedure.

            res.json(response.recordset);
        
    } catch (error) {
        res.status(500);
        res.send(error.message);      
    }

}

export const createDirectory = async ( req, res ) => {
    const { agencia, data } = req.body;

    const { Empresa, Sucursal } = agencia;

    const { 
        Destino,
        Distribuidor,
        Nombre,
        Puesto,
        Telefono,
        Contacto2,
        PuestoContacto2,
        Correo,
        Domicilio,
        Extension,
        NumeroDistribuidor,
        TelefonoMovil
    } = data;

    try {
        const pool = await getConnection();

        await pool.request()
            .input("Empresa",             sql.Int,      Empresa)
            .input("Sucursal",            sql.Int,      Sucursal)
            .input("Destino",             sql.VarChar,  Destino)
            .input("Distribuidor",        sql.VarChar,  Distribuidor)
            .input("Nombre",              sql.VarChar,  Nombre)
            .input("Puesto",              sql.VarChar,  Puesto)
            .input("Telefono",            sql.VarChar,  Telefono)
            .input("Contacto2",           sql.VarChar,  Contacto2)
            .input("PuestoContacto2",     sql.VarChar,  PuestoContacto2)
            .input("Correo",              sql.VarChar,  Correo)
            .input("Domicilio",           sql.VarChar,  Domicilio)
            .input("Extension",           sql.VarChar,  Extension)
            .input("NumeroDistribuidor",  sql.VarChar,  NumeroDistribuidor)
            .input("TelefonoMovil",       sql.VarChar,  TelefonoMovil)
            .execute( storedProcedures.spf_DirectoriosFlotillas_crear ) 


            res.json({"isCreated":true});

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

export const updateDirectory = async ( req, res ) => {
    const { agencia, data } = req.body;

    const { Empresa, Sucursal } = agencia;

    const { 
        Id,
        Destino,
        Distribuidor,
        Nombre,
        Puesto,
        Telefono,
        Contacto2,
        PuestoContacto2,
        Correo,
        Domicilio,
        Extension,
        NumeroDistribuidor,
        TelefonoMovil
    } = data;

    try {
        const pool = await getConnection();

        await pool.request()
            .input("Empresa",             sql.Int,      Empresa)
            .input("Sucursal",            sql.Int,      Sucursal)
            .input("Id",                  sql.Int,      Id)
            .input("Destino",             sql.VarChar,  Destino)
            .input("Distribuidor",        sql.VarChar,  Distribuidor)
            .input("Nombre",              sql.VarChar,  Nombre)
            .input("Puesto",              sql.VarChar,  Puesto)
            .input("Telefono",            sql.VarChar,  Telefono)
            .input("Contacto2",           sql.VarChar,  Contacto2)
            .input("PuestoContacto2",     sql.VarChar,  PuestoContacto2)
            .input("Correo",              sql.VarChar,  Correo)
            .input("Domicilio",           sql.VarChar,  Domicilio)
            .input("Extension",           sql.VarChar,  Extension)
            .input("NumeroDistribuidor",  sql.VarChar,  NumeroDistribuidor)
            .input("TelefonoMovil",       sql.VarChar,  TelefonoMovil)
            .execute( storedProcedures.spf_DirectoriosFlotillas_actualizar ) 


        res.json({"isUpdated": true});

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

export const getCityDestiny = async ( req, res ) => {

    try {
        const pool = await getConnection();
        const result = await pool.request()
        .input("Empresa", sql.Int, 5)
        .input("Sucursal", sql.Int, 1)
        .execute( storedProcedures.spf_DirectoriosDestinFlotillas_leer );
        
        res.json(result.recordset);

    } catch (error) {
        res.status(500);
        res.send(error.message); 
        
    }
}

export const getAsigCDO = async ( req, res ) => {

    try {
        const pool = await getConnection();
        const result = await pool.request()
        .execute( storedProcedures.spf_asignadosCDOFlotillas_leer );

        res.json(result.recordset);
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

export const getSinisters = async ( req, res ) => {
    const { agencia:{ Empresa, Sucursal } } = req.body;

    try {

        const pool = await getConnection();
        
        const { recordset } = await pool.request()
            .input("Empresa", sql.Int, Empresa)
            .input("Sucursal", sql.Int, Sucursal)
            .execute( storedProcedures.spf_siniestrosFlotillas_leer );

            let sinisters = [];

            const today = FechaDeHoy();

            for ( const obj of recordset ) {

                const { Estatus, FechaSiniestro, FechaFinSiniestro } = obj;

                let days = 0;

                if ( Estatus == 1 || Estatus == 2 ) {

                    const date = await pool.request()
                        .input("Fecha1", sql.Date, FechaSiniestro)
                        .input("Fecha2", sql.Date, today)
                        .execute( storedProcedures.spf_diferenciaDiasFechas_leer );

                    const { DateDiff } = date.recordset[0];

                    days = DateDiff;

                }
                
                if ( Estatus == 3 || Estatus == 4 ) {
                   
                    const date = await pool.request()
                        .input("Fecha1", sql.Date, FechaSiniestro)
                        .input("Fecha2", sql.Date, FechaFinSiniestro)
                        .execute( storedProcedures.spf_diferenciaDiasFechas_leer );

                    const { DateDiff } = date.recordset[0];

                    days = DateDiff;

                }

                sinisters = [ ...sinisters, { ...obj, DiasSiniestro: days } ]
                	

            }

        res.json( sinisters );
        
    } catch (error) {
        res.status(500);
        res.send(error.message);  
    }

}

export const createSinister = async ( req, res ) => {
    const { 
        agencia:{ Empresa, Sucursal },
        EstatusTyT, 
        FechaSiniestro, 
        CiudadDestino, 
        VIN, 
        OrdenDeCompra, 
        NumeroCliente
    } = req.body;

    const defaultEstatus = 1; //En Revisión. 

    try {

        const pool = await getConnection();
        
        await pool.request()
            .input("Empresa",        sql.Int,     Empresa)
            .input("Sucursal",       sql.Int,     Sucursal)
            .input("FechaSiniestro", sql.Date,    FechaSiniestro)
            .input("CiudadDestino",  sql.VarChar, CiudadDestino)
            .input("VIN",            sql.VarChar, VIN)
            .input("OrdenDeCompra",  sql.VarChar, OrdenDeCompra)
            .input("NumeroCliente",  sql.Int,     NumeroCliente)
            .input("Estatus",        sql.Int,     defaultEstatus)
            .execute( storedProcedures.spf_siniestrosFlotillas_crear )

            res.json({"isCreated":true});
        
    } catch (error) {
        res.status(500);
        res.send(error.message);  
    }

}

export const existVINSinister = async ( req, res ) => {
    
    const { VIN, OrdenDeCompra, Cliente } = req.body;

    try {

        let existVIN = false;

        const pool = await getConnection();
        const { recordset } = await pool.request()
            .input("VIN",           sql.VarChar,    VIN )
            .input("OrdenDeCompra", sql.VarChar,    OrdenDeCompra )
            .input("Cliente",       sql.Int,        Cliente )
            .execute( storedProcedures.spf_existeVINEnSiniestrosFlot_leer )

            if ( recordset.length > 0 ) existVIN = true;

            res.json({existVIN});
        
    } catch (error) {
        res.status(500);
        res.send(error.message);  
    }

}

export const updateVINSinister = async ( req, res ) => {
    const { VIN, OrdenDeCompra, NumeroCliente, FechaSiniestro } = req.body;

    const today = FechaDeHoy();

    const defaultEstatus = 1; //En Revisión.

    try {
        const pool = await getConnection();

            await pool.request()
            .input("FechaEstSiniestro", sql.Date,    today)
            .input("FechaSiniestro",    sql.Date,    FechaSiniestro)
            .input("VIN",               sql.VarChar, VIN)
            .input("OrdenDeCompra",     sql.VarChar, OrdenDeCompra)
            .input("Cliente",           sql.Int,     NumeroCliente)
            .input("Estatus",           sql.Int,     defaultEstatus)
            .execute( storedProcedures.spf_siniestrosFlotillasVIN_actualizar )

            res.json({"isUpdated":true});

    } catch (error) {
        res.status(500);
        res.send(error.message);   
    }

}

export const getSinistersEstatus = async ( req, res ) => {

    try {
        const pool = await getConnection();
        const { recordset } = await pool.request()
        .execute( storedProcedures.spf_siniestrosEstatusFlot_leer );

        res.json(recordset)
        
    } catch (error) {
        res.status(500);
        res.send(error.message);  
    }

}

export const updateEstatusVINSinister = async ( req, res ) => {
    const { data } = req.body;
    
        try {

            const pool = await getConnection();

                for (const obj of data) {

                    const { VIN, Contacto, Telefono, Correo, Comentario, ComentarioEstProc, Estatus, Cliente, OrdenDeCompra, FechaFinSiniestro } = obj;

                    await pool.request()
                    .input("VIN",               sql.VarChar,   VIN)
                    .input("Contacto",          sql.VarChar,   Contacto)
                    .input("Telefono",          sql.VarChar,   Telefono)
                    .input("Correo",            sql.VarChar,   Correo)
                    .input("Comentario",        sql.VarChar,   Comentario)
                    .input("ComentarioEstProc", sql.VarChar,   ComentarioEstProc)
                    .input("FechaFinSiniestro", sql.Date,      FechaFinSiniestro)
                    .input("Estatus",           sql.Int,       Estatus)
                    .input("Cliente",           sql.Int,       Cliente)
                    .input("OrdenDeCompra",     sql.VarChar,   OrdenDeCompra)
                    .execute( storedProcedures.spf_siniestrosFlotillas_actualizar )
                    
                }

                res.json({"isUpdated": true});
                
        } catch (error) {
            res.status(500);
            res.send(error.message);   
        }
    
}

export const pendingDocumentsSummary = async ( req, res ) => {
    const { PendienteEntrega } = req.body;   

    try {
        const pool = await getConnection();
        const { recordset } = await pool.request()
            .input("PendienteEntrega", sql.VarChar, PendienteEntrega)
            .execute( storedProcedures.spf_flotillasPendientesEntregas_leer );

        res.json( recordset );
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const all_summary_vins = async ( req, res ) => {
    const { pendienteEntrega } = req.body;
    const Empresa  = 5;
    const Sucursal = 1;

    try {

        const pool = await getConnection();
            
            const result = await pool.request()
                .input("Empresa",         sql.Int,         Empresa)
                .input("Sucursal",        sql.Int,         Sucursal)
                .input("resumen",         sql.VarChar,     pendienteEntrega)
                .execute( storedProcedures.spf_logisticaVinsToStatusClientesTodos_leer )
            
            let dataList = []; 

            for (let obj of result.recordset) {
                let nameDateGM = '';
                let nameDateTyT = '';

                obj = { ...JSON.parse( JSON.stringify(obj) ) };

                /* GM */
                if ( obj.EstatusTyT !== '0' && obj.FechaLiberacionAut.substring( 0,10 ) !== defaultDate ) nameDateGM = 'FechaLiberacionAut';

                if ( obj.EstatusTyT !== '0' && obj.FechaCalidadAut.substring( 0,10 ) !== defaultDate ) nameDateGM = 'FechaCalidadAut';

                if ( obj.EstatusTyT !== '0' && obj.FechaCalidadAut.substring( 0,10 ) === defaultDate && obj.FechaLiberacionAut.substring( 0,10 ) === defaultDate ) {
                    
                    const { objMod, FechaGM } = await getTotalGMDays( obj, pool );
                    
                    nameDateGM = FechaGM;

                    obj = objMod;

                }

                /* TYT */
                if ( obj.EstatusTyT !== '0' && obj.FechaTransitoSalida.substring( 0,10 ) === defaultDate ) {

                    const { objMod, FechaTyT } = await getTotalTyTDays( obj, pool, nameDateGM );

                    nameDateTyT = FechaTyT;

                    obj = objMod;

                }

                /* PREVIAENTREGADISTRIB */
                if ( obj.EstatusTyT !== '0' && obj.FechaEntregaCliente.substring( 0,10 ) !== defaultDate && obj.FechaTransitoSalida.substring( 0,10 ) === defaultDate ) {

                    const { objMod } = await getTotalPrevEntreg( obj, pool, nameDateTyT);

                    obj = objMod;

                }

                if ( obj.EstatusTyT !== '0' && obj.FechaEntregaCliente.substring( 0,10 ) === defaultDate ) {
                    obj = {
                        ...obj,
                        DiasPreviaEntrega: obj.DiasTyT
                    }
                }
                
                dataList = [ ...dataList, { ...obj }];
            

            }

        res.json(dataList);

    } catch (error) {
        res.status(500);
        res.send(error.message);          
        console.log(error);  
    }

    /* res.json({"msg":true}); */
}

export const cancel_vin_factura = async ( req, res ) => {
    
    const { Vin, NumCliente } = req.body;

    try {
        const pool = await getConnection();
            await pool.request()
                .input("VIN",     sql.VarChar, Vin)
                .input("Cliente", sql.Int,     NumCliente)
                .execute( storedProcedures.spf_AsignacionVinsCancelFolioFact_actualizar )
                
                res.json({"isCanceled": true});
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

const helperGMDays = async ( date1, date2, obj, pool, dateName ) => {
    const dateDiff = await getDifferenceBetweenDates( date1, date2, pool );
    
    obj = {
        ...obj,
        DiasGM: dateDiff + obj.DiasGenerales //sumar las secciones anterioers
    }

    return {
        objMod: obj,
        FechaGM: dateName
    }

}

const helperTyTDays = async ( date1, date2, obj, pool, dateName ) => {
    const dateDiff = await getDifferenceBetweenDates( date1, date2, pool );

    obj = {
        ...obj,
        DiasTyT: dateDiff + obj.DiasGM 
    }

    return {
        objMod: obj,
        FechaTyT: dateName
    }
}

const getTotalGMDays = async ( obj, pool ) => {

    if ( obj.FechaAccesoAut.substring( 0, 10 ) !== defaultDate) {

        return await helperGMDays( obj.FechaVinAsignado, obj.FechaAccesoAut, obj, pool, GMDates.FechaAccesoAut );

    }

    if ( obj.FechaGPSAut.substring( 0, 10 ) !== defaultDate) {

        return await helperGMDays( obj.FechaVinAsignado, obj.FechaGPSAut, obj, pool, GMDates.FechaGPSAut );

    }
    
    if ( obj.FechaPreviaAut.substring( 0, 10 ) !== defaultDate ) {

        return await helperGMDays( obj.FechaVinAsignado, obj.FechaPreviaAut, obj, pool, GMDates.FechaPreviaAut );
        
    }

    if ( obj.FechaSegregacionAut.substring( 0, 10 ) !== defaultDate ) {

        return await helperGMDays( obj.FechaVinAsignado, obj.FechaSegregacionAut, obj, pool, GMDates.FechaSegregacionAut );

    }

    if ( obj.FechaDetencionAut.substring( 0, 10 ) !== defaultDate ) {

        return await helperGMDays( obj.FechaVinAsignado, obj.FechaDetencionAut, obj, pool, GMDates.FechaDetencionAut );
        
    }

    return {
        objMod: obj,
        FechaGM: ''
    }

}

const getDifferenceBetweenDates = async ( date1, date2, pool ) => {

    const acquireDate = await pool.request()
        .input("Fecha1", sql.Date, date1.substring( 0, 10 ))
        .input("Fecha2", sql.Date, date2.substring( 0, 10 ))
        .execute( storedProcedures.spf_diferenciaDiasFechas_leer );

    const { recordset } = acquireDate;
    const [ resp ] = recordset;
    const { DateDiff } = resp;
    
    return DateDiff;

}

const getTotalTyTDays = async ( obj, pool, nameDateGM ) => {
    
    let initialDate = '';

    if ( obj.FechaAsigEnMadrinaSalida.substring( 0,10 ) !== defaultDate ) {

        initialDate = nameDateGM === '' ? obj.FechaAsigEnMadrinaSalida : obj[nameDateGM]; 

        return await helperTyTDays( initialDate, obj.FechaAsigEnMadrinaSalida, obj, pool, TyTDates.FechaAsigEnMadrinaSalida );

    }

    if ( obj.FechaAsigSinMadrinaSalida.substring( 0,10 ) !== defaultDate ) {

        initialDate = nameDateGM === '' ? obj.FechaAsigSinMadrinaSalida : obj[nameDateGM]; 

        return await helperTyTDays( initialDate, obj.FechaAsigSinMadrinaSalida, obj, pool, TyTDates.FechaAsigSinMadrinaSalida );

    }

    if ( obj.FechaArmViajeSalida.substring( 0,10 ) !== defaultDate ) {

        initialDate = nameDateGM === '' ? obj.FechaArmViajeSalida : obj[nameDateGM]; 

        return await helperTyTDays( initialDate, obj.FechaArmViajeSalida, obj, pool, TyTDates.FechaArmViajeSalida );

    }

    if ( obj.FechaInterplantaSalida.substring( 0,10 ) !== defaultDate ) {
        
        initialDate = nameDateGM === '' ? obj.FechaInterplantaSalida : obj[nameDateGM]; 

        return await helperTyTDays( initialDate, obj.FechaInterplantaSalida, obj, pool, TyTDates.FechaInterplantaSalida );

    } 

    obj = {
        ...obj,
        DiasTyT: obj.DiasGM
    }

    return {
        objMod: obj,
        FechaTyT: ''
    }

}

const getTotalPrevEntreg = async ( obj, pool, nameDateTyT ) => {
    let initialDate = nameDateTyT === '' ? obj.FechaEntregaCliente : obj[nameDateTyT];

    return await helperPrevEntregDays( initialDate, obj.FechaEntregaCliente, obj, pool );

}

const helperPrevEntregDays = async ( date1, date2, obj, pool ) => {
    const dateDiff = await getDifferenceBetweenDates( date1, date2, pool );

    obj = {
        ...obj,
        DiasPreviaEntrega: dateDiff + obj.DiasTyT
    }

    return {
        objMod: obj
    }
}

/* Servicio para actualizar los VINS que no tienen la propiedad modelo (se llama directamente de un cliente REST.) */
export const update_modelo_vins = async ( req, res ) => {
    const Empresa  = 5;
    const Sucursal = 1;

    try {
        const pool = await getConnection();
        /* Obtener los VINS de AsignacionVins_OrdenDeCompra */
        const VINSOrdenCompraList = await pool.request()
          .input("Empresa",     sql.Int,   Empresa)   
          .input("Sucursal",    sql.Int,   Sucursal) 
          .execute( storedProcedures.spf_VINSOrdenDeCompra_leer )

          for (const obj of VINSOrdenCompraList.recordset) {
            let modelo = ''
            /* Buscar el campo inventario en la tabla VehiculosDMSFlot */
            const searchFieldOnInventory = await pool.request()
            .input("VIN", sql.VarChar, obj.VIN)
            .execute( storedProcedures.spf_inventarioVehiculosDMSFlot_leer )
             if ( searchFieldOnInventory.recordset.length > 0 ) modelo = searchFieldOnInventory.recordset[0].inventario 

             if ( searchFieldOnInventory.recordset.length == 0 ) {
                /* Buscar el campo inventario en la tabla VentasFlotillas */
                const searchFieldOnInvoiced = await pool.request()
                    .input("VIN", sql.VarChar, obj.VIN)
                    .execute( storedProcedures.spf_inventarioVentasFlotillas_leer )
                    if ( searchFieldOnInvoiced.recordset.length > 0 ) modelo = searchFieldOnInvoiced.recordset[0].Inventario.replace('  ','-') 
             }   

             /* Actualizar el VIN con su respectivo modelo */
             let [ , mod, ] = modelo.split('-')
             await pool.request()
                .input("Empresa",   sql.Int,   Empresa)   
                .input("Sucursal",  sql.Int,   Sucursal) 
                .input("VIN",       sql.VarChar, obj.VIN)
                .input("Modelo",    sql.VarChar, mod)
                .execute( storedProcedures.spf_modeloOrdenDeCompra_actualizar )

          }

          res.json({ "msg":true })
        
    } catch (error) {
        res.status(500);
        res.send(error.message);    
    }
    
}

/* Servicio para actualizar el Numero cliente en la tabla Bitácora */
export const set_client_number_bitacora = async ( req, res ) => {
    const Empresa  = 5;
    const Sucursal = 1;

    try {
        const pool = await getConnection();
        /* Obtener los VINS de AsignacionVins_OrdenDeCompra */
        const response = await pool.request()
          .input("Empresa",     sql.Int,   Empresa)   
          .input("Sucursal",    sql.Int,   Sucursal) 
          .execute( storedProcedures.spf_VINSOrdenDeCompra2_leer );

          for (const obj of response.recordset) { //spf_setNumeroClienteBitacora_actualizar
              await pool.request()
                .input("VIN",      sql.VarChar,  obj.VIN )   
                .input("Cliente",  sql.Int,      obj.Cliente )
                .input("Empresa",  sql.Int,      Empresa)   
                .input("Sucursal", sql.Int,      Sucursal) 
                .execute( storedProcedures.spf_setNumeroClienteBitacora_actualizar );   
          }

          res.json({"done":true})
        
    } catch (error) {
        res.status(500);
        res.send(error.message);        
    }
}

/* Servicio para actualizar la fecha Asignado (inventario) en la tabla historial facturados  */
export const updateDateAsignadoHistorial = async ( req, res ) => {

    //tabla AsignacionVins         //spf_fechaAsignadoAsignacionVins_actualizar
    //tabla historialFacturados    //spf_fechaAsignadoFacturadosFlot_actualizar
    const Empresa = 5;
    const Sucursal =1;

    try {
        const pool = await getConnection();
            const { recordset } = await pool.request()
            .input("Empresa", sql.Int, Empresa)
            .input("Sucursal", sql.Int, Sucursal)
            .execute( storedProcedures.spf_registrosVentasFlotillasDMS_leer );
            
            for (const obj of recordset) {

                await pool.request()
                    .input("Vin",      sql.VarChar, obj.Vin)
                    .input("Asignado", sql.Date,  obj.Asignado)
                    .execute( storedProcedures.spf_fechaAsignadoFacturadosFlot_actualizar )

                
            }
        
        res.json({"msg": true});

    } catch (error) {
        
    }

    
}

/* Servicio para actualizar la fecha Asignado (inventario) en la tabla AsignacionVINS  */
export const updateDateAsignadoAsigVINS = async ( req, res ) => { //Tabla facturados

    //tabla AsignacionVins         //spf_fechaAsignadoAsignacionVins_actualizar
    //tabla historialFacturados    //spf_fechaAsignadoFacturadosFlot_actualizar
    const Empresa = 5;
    const Sucursal =1;

    try {
        const pool = await getConnection();
            const { recordset } = await pool.request()
            .input("Empresa", sql.Int, Empresa)
            .input("Sucursal", sql.Int, Sucursal)
            .execute( storedProcedures.spf_registrosVentasFlotillasDMS_leer );
            
            for (const obj of recordset) {

                /* await pool.request()
                    .input("VIN",           sql.VarChar, obj.Vin)
                    .input("FechaAsignado", sql.Date,  obj.Asignado)
                    .execute( storedProcedures.spf_fechaAsignadoAsignacionVins_actualizar ) */

            }
        
        res.json({"AsignacionVins": true});

    } catch (error) {
        
    }

    
}

export const updateDateAsignadoAsigVINS2 = async ( req, res ) => { //Tabla inventario

    try {
        const pool = await getConnection();
            const { recordset } = await pool.request()
            .execute( storedProcedures.spf_registrosVehiculosDMSFlot_leer );
            
            for (const obj of recordset) {

                await pool.request()
                    .input("VIN",           sql.VarChar, obj.serie)
                    .input("FechaAsignado", sql.Date,  revertDate( obj.Asignado ))
                    .execute( storedProcedures.spf_fechaAsignadoAsignacionVins_actualizar )
                
            }
        
        res.json({"AsignacionVins": true});

    } catch (error) {
        
    }

    
}
