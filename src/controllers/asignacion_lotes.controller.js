import axios from "axios";
import { getConnection, querys, sql, storedProcedures } from "../database";
import { FechaDeHoy, removerComas } from "./helpers/helpers";
import { endPointInvVehiculosFlot, endPointVentasflotillas } from "./helpers/constantes";

export const createLote = async ( req, res ) => {
    const { agencia, lote, Folio_lote } = req.body;
    const fecha = FechaDeHoy();

    // console.log( 'TAMAÑO DEL LOTE', Buffer.from(JSON.stringify(lote)).length );

    try {
       
        await createLoteAsync(lote, agencia, fecha, Folio_lote);
        res.json({"isLoteCreated": true})

    } catch (error) {
        res.status(500);
        res.send(error.message);  
        console.log(error);
    }

}

export const updateLote = async ( req, res ) => {
    const { agencia, lote, Folio_lote } = req.body;
    const fecha = FechaDeHoy();

    try {
        await updateLoteAsync( lote, agencia, fecha, Folio_lote )
        res.json({"isUpdated": true})

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const updateLoteAsync = async ( lote, agencia, fecha, Folio_lote ) => {
    const { Empresa, Sucursal } = agencia;
    // const cuery = querys.addVINLote;
    const pool = await getConnection();

    for (const registroLote of lote) {

        await pool.request()
            .input("Empresa",                       sql.Int,     Empresa)
            .input("Sucursal",                      sql.Int,     Sucursal)
            .input("Folio_lote",                    sql.Int,     Folio_lote)
            .input("Fecha_elaboracion",             sql.VarChar, fecha)
            .input("Nombre_cliente",                sql.VarChar, registroLote.Nombre_cliente)
            .input("Nombre_lote",                   sql.VarChar, registroLote.Nombre_lote)
            .input("VIN",                           sql.VarChar, registroLote.VIN)
            .input("Numero_factura",                sql.VarChar, registroLote.Numero_factura)
            .input("Tasa_porcentaje_enganche",      sql.Float,   registroLote.Tasa_porcentaje_enganche)
            .input("Monto_total",                   sql.Float,   removerComas(registroLote.Monto_total))
            .input("Inversion_inicial",             sql.Float,   removerComas(registroLote.Inversion_inicial))
            .input("Precio_factura",                sql.Float,   removerComas(registroLote.Precio_factura))
            .input("Orden_compra",                  sql.VarChar, registroLote.Orden_compra)
            .input("Ubicacion_cliente",             sql.VarChar, registroLote.Ubicacion_cliente)
            .input("Marca",                         sql.VarChar, registroLote.Marca)
            .input("Unidad",                        sql.VarChar, registroLote.Unidad)
            .input("NumCliente",                    sql.Int,     registroLote.NumCliente)
            .input("Fecha_firma_contrato",          sql.Date,    registroLote.Fecha_firma_contrato)
            .input("Referencia",                    sql.VarChar, registroLote.Referencia)
            .input("Folio_compra_contrato",         sql.VarChar, registroLote.Folio_compra_contrato)
            .input("Fecha_compra_contrato",         sql.Date,    registroLote.Fecha_compra_contrato)
            .input("Monto_plan_piso",               sql.Float,   registroLote.Monto_plan_piso)
            .input("Monto_deposito_cuenta_cheques", sql.Float,   registroLote.Monto_deposito_cuenta_cheques)

            // .query( cuery )
            .execute( storedProcedures.spf_asigLotesNewLote_crear )
        
    }

    pool.close();

}

const checkNombreLoteExist = async (nombreLote , agencia) => {
    let existName = false;
    const { Empresa, Sucursal } = agencia;
    const cuery = querys.getNombresLotes;
    const pool = await getConnection();
    const result = await pool.request()
        .input("Empresa", sql.Int, Empresa)
        .input("Sucursal", sql.Int, Sucursal)
        .query(cuery)

        if( result.recordset.length > 0 ) {
            for (const registro of result.recordset) {
                if ( (registro.Nombre_lote === nombreLote) && (registro.Referencia === '') ) existName = true;
            }
        }

    pool.close();        

    return existName;
}

const createLoteAsync = async(lote, agencia, fecha, Folio_lote) => {
    const { Empresa, Sucursal } = agencia;
    // const cuery = querys.createNewLote
    const pool = await getConnection();

    for (const registroLote of lote) {
        await pool.request()
            .input("Empresa",                   sql.Int,     Empresa)
            .input("Sucursal",                  sql.Int,     Sucursal)
            .input("Folio_lote",                sql.Int,     Folio_lote)
            .input("Fecha_elaboracion",         sql.VarChar, fecha)
            .input("Nombre_cliente",            sql.VarChar, registroLote.cliente)
            .input("Nombre_lote",               sql.VarChar, registroLote.nombreLote)
            .input("VIN",                       sql.VarChar, registroLote.VIN)
            .input("Numero_factura",            sql.VarChar, registroLote.Factura)

            .input("Tasa_porcentaje_enganche",  sql.Float,   registroLote.Tasa_porcentaje_enganche)
            .input("Monto_total",               sql.Float,   removerComas(registroLote.Monto_total))
            .input("Inversion_inicial",         sql.Float,   removerComas(registroLote.Inversion_inicial))
            .input("Precio_factura",            sql.Float,   removerComas(registroLote.Venta))

            .input("Orden_compra",              sql.VarChar, registroLote.Orden_compra )
            .input("Ubicacion_cliente",         sql.VarChar, registroLote.Ubicacion)
            .input("Marca",                     sql.VarChar, registroLote.Marca)
            .input("Unidad",                    sql.VarChar, registroLote.Vehiculo)
            .input("NumCliente",                sql.Int,     registroLote.Cliente)
            .input("Fecha_firma_contrato",      sql.Date,    registroLote.Fecha_firma_contrato)
            // .query( cuery )
            .execute( storedProcedures.spf_asigLotesNewLote_crear )
    }

    pool.close();
}

export const getFoliosLotes = async ( req, res ) => {
    const { Empresa, Sucursal } = req.body;
    // const cuery = querys.getFoliosLotes;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa", sql.Int, Empresa)
            .input("Sucursal", sql.Int, Sucursal)
            // .query(cuery)
            .execute( storedProcedures.spf_asigLotesNextFolioLote_leer )
            
            const Folio_lote = result.recordset[0].Folio_lote;

            pool.close();

            res.json({"Folio_lote": Folio_lote}) 

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const getVINSRegistered = async ( req, res ) => {
    const { agencia, cliente, ubicacion } = req.body;
    const { Empresa, Sucursal } = agencia;
    // const cuery = querys.getVINSRegistered;
    
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa", sql.Int, Empresa)
            .input("Sucursal", sql.Int, Sucursal)
            .input("Nombre_cliente", sql.VarChar, cliente)
            .input("Ubicacion_cliente", sql.VarChar, ubicacion)
            // .query( cuery )
            .execute( storedProcedures.spf_asigLotesVinsRegisteredByCliente_leer );

            pool.close();

            res.json(result.recordset)
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const getNombresLotesCliente = async ( req, res ) => {
    const { agencia, Nombre_corto, Ubicacion, numCliente } = req.body;
    const { Empresa, Sucursal } = agencia;
    // const cuery = querys.getNombresLotesCliente;
    const Referencia = 'ASIGBLOQUE';

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa",            sql.Int,     Empresa)
            .input("Sucursal",           sql.Int,     Sucursal)
            .input("Nombre_cliente",     sql.VarChar, Nombre_corto)
            .input("Referencia",         sql.VarChar, Referencia)
            .input("Ubicacion_cliente",  sql.VarChar, Ubicacion)
            .input("numCliente",         sql.Int,     numCliente)
            // .query( cuery )
            .execute( storedProcedures.spf_asigLotesNombresLotesCliente_leer )

            pool.close();

            res.json(result.recordset)

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

export const getLoteCliente = async ( req, res ) => {
    const { agencia, Folio_lote, NumCliente } = req.body;
    const { Empresa, Sucursal } = agencia;

    // const cuery = querys.getLoteCliente;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa",     sql.Int,   Empresa)
            .input("Sucursal",    sql.Int,   Sucursal)
            .input("Folio_lote",  sql.Int,   Folio_lote)
            .input("NumCliente",  sql.Int,   NumCliente)
            // .query(cuery)
            .execute( storedProcedures.spf_asigLotesLoteCliente_leer )

            pool.close();

            res.json(result.recordset)
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const getvinscliente = async ( req, res ) => {
    const { Agencia, Nombre_cliente, Folio_lote, NumCliente } = req.body;
    const { Empresa, Sucursal } = Agencia;
    // const cuery = querys.getVinsClienteLoteYDisponibles;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa", sql.Int, Empresa)
            .input("Sucursal", sql.Int, Sucursal)
            // .input("Nombre_cliente", sql.VarChar, Nombre_cliente)
            .input("Folio_lote", sql.Int, Folio_lote)
            .input("NumCliente", sql.Int, NumCliente)
            // .query( cuery )
            .execute( storedProcedures.spf_asigLotesVinsClienteLoteYDisponibles_leer );

            pool.close();

            res.json(result.recordset)
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

export const getVinsDisponiblesCliente = async ( req, res ) => {
    const { Agencia, Nombre_cliente, NumCliente } = req.body;
    const { Empresa, Sucursal } = Agencia;
    // const cuery = querys.getVinsClienteDisponibles;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa", sql.Int, Empresa)
            .input("Sucursal", sql.Int, Sucursal)
            .input("NumCliente", sql.Int, NumCliente)
            // .query( cuery )
            .execute( storedProcedures.spf_asigLotesVinsDisponibles_leer )

            pool.close();

            res.json(result.recordset)

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

export const deleteLote = async ( req, res ) => {
    const { agencia, Folio_lote, data } = req.body;
    const { Empresa, Sucursal } = agencia;
    // let cuery = querys.deleteLote;

    try {
        const pool = await getConnection();

        /* request to get folio lote before deleting */
        const folioLoteData = await pool.request()
            .input("Empresa",    sql.Int, Empresa)
            .input("Sucursal",   sql.Int, Sucursal)
            .input("Folio_lote", sql.Int, Folio_lote)
            .execute( storedProcedures.spf_loteAsignacionContratos_leer )
            
            let mergeNewAndOldLote = data.map((newObj) => {
                let finalObj = { 
                    ...newObj,
                    Ubicacion_cliente             : newObj.Ubicacion,
                    Nombre_lote                   : newObj.nombreLote,
                    Numero_factura                : newObj.Factura,
                    Unidad                        : newObj.Vehiculo,
                    NumCliente                    : newObj.Cliente,
                    Nombre_cliente                : newObj.cliente,
                    Precio_factura                : newObj.Venta,
                    Referencia                    : '',
                    Folio_compra_contrato         : '',
                    Fecha_compra_contrato         : '1900-01-01',
                    Monto_plan_piso               : 0,
                    Monto_deposito_cuenta_cheques : 0
                }
                let VINFound = folioLoteData.recordset.find(oldObj =>  newObj.VIN === oldObj.VIN )
                if ( VINFound !== undefined ) finalObj = { ...VINFound }
                
                return finalObj;
            })

        /* request to delete folio lote */
        await pool.request()
            .input("Empresa", sql.Int, Empresa)
            .input("Sucursal", sql.Int, Sucursal)
            .input("Folio_lote", sql.Int, Folio_lote)
            .execute( storedProcedures.spf_asigLotesDeleteLote_eliminar )

        pool.close();

        res.json({
            "isDeleted": true,
            "data": mergeNewAndOldLote
        })

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

export const updateRegistrosOracle = async ( req, res ) => {
    const { agencia } = req.body;
    const { Empresa, Sucursal } = agencia;
    let VINSWithFacturaList = [];
    // const cuery = querys.getRegistrosTablaVentasFlotillasDMS;

    try {
        const refreshTable = await refreshVentasFlotillasDMSTable()       /* Actualiza los VINS Facturados del Mes */
        const refreshTable2 = await refreshInventarioVehiculosFlotillas() /* Actualiza los VINS Inventario */
        const promise = refreshTable['data'];
        const promise2 = refreshTable2['data'];

         if ( promise === "Terminado" && promise2 === "Terminado") {
            const pool = await getConnection();
            const result = await pool.request()
            .input("Empresa", sql.Int, Empresa)
            .input("Sucursal", sql.Int, Sucursal)
            .execute( storedProcedures.spf_registrosVentasFlotillasDMS_leer ); /* Pide Vins facturados del mes. */

            await registrarResultados(result.recordset, pool, Empresa, Sucursal); /* inserta VINS que no existen aún en tabla historialFacturados */

            //TODO:
            /* 
                1.- Solicitar todos los VINS de la tabla Facturados del Mes. (ya los tnemos en result.recordset)
                4.- crear un for of.
                2.- actualizar/sobrescribir el campo folio factura en tablas: ASignacionVins, AsignacionLotes, LogisticaVins, HistorialFacturados.
                3.- crear procedimientos almacenados para cada tabla,
            */
            
            await deleteVINSFromHistorial( pool, Empresa, Sucursal ); /* Elimina VINS que han sido eliminados de un cliente; o cancelada su facturación */


            for (const obj of result.recordset) {

                /* Actualizar tabla ASignacionVins */
                await pool.request()
                  .input("Vin",      sql.VarChar, obj.Vin)
                  .input("Factura",  sql.VarChar, obj.Factura)
                  .execute( storedProcedures.spf_AsignacionVinsFolioFactura_actualizar )    
                
                  /* Actualizar tabla Asignacion Lotes */
                await pool.request()
                  .input("Vin",      sql.VarChar, obj.Vin)
                  .input("Factura",  sql.VarChar, obj.Factura)
                  .execute( storedProcedures.spf_AsignacionLotesFolioFactura_actualizar )    
                  
                  /* Actualizar tabla LogisticaVins - DatosDPP. */
                await pool.request()
                  .input("Vin",      sql.VarChar, obj.Vin)
                  .input("Factura",  sql.VarChar, obj.Factura)
                  .execute( storedProcedures.spf_LogisticaVINSFolioFactura_actualizar )   
                  
                  /* Actualizar tabla Historial */
                await pool.request()
                  .input("Vin",         sql.VarChar,     obj.Vin)
                  .input("Factura",     sql.VarChar,     obj.Factura)
                  .input("FechaVenta",  sql.Date,        obj.FechaVenta)
                  .input("Venta",       sql.Float,       obj.Venta)
                  .input("Costo",       sql.Float,       obj.Costo)
                  .input("Paquete",     sql.VarChar,     obj.Paquete)
                  .input("Color",       sql.VarChar,     obj.Color)
                  .input("NumCliente",  sql.Int,         obj.NumCliente)
                  .execute( storedProcedures.spf_VentasFlotillasFolioFactura_actualizar )   
                

            }

            pool.close();
            
            res.json({'isUpdated':true});

        } else {
            
            res.json({'isUpdated':false});

        }
        
    } catch (error) {
        res.status(500);
        res.send(error.message);  
    }
}

export const nameAlreadyExists = async ( req, res ) => {
    const { NumCliente, NomLote } = req.body;

    try {
        let exist = false;
        const pool = await getConnection();
        const response = await pool.request()
            .input("Nombre_lote", sql.VarChar, NomLote)
            .input("NumCliente",  sql.Int,     NumCliente)
            .execute( storedProcedures.spf_existeNombreLote_leer );

        if ( response.rowsAffected[0] > 0 ) exist = true;
        
        pool.close();

        res.json({ "message" : exist })        

    } catch (error) {
        res.status(500);
        res.send(error.message);    
    }

}

export const changeNameBloq = async( req, res ) => {
    const { 
        NombreCliente, 
        Ubicacion, 
        numCliente, 
        NombreLote,
        anteriorNombreLote
      } = req.body;

      try {
        const pool = await getConnection();
        await pool.request()
        .input("numCliente",         sql.Int, numCliente)
        .input("NombreLote",         sql.VarChar, NombreLote)
        .input("anteriorNombreLote", sql.VarChar, anteriorNombreLote)
        .execute( storedProcedures.spf_AsigLotesNombreBloque_actualizar );
        
        pool.close();

        res.json({"wasChanged" : true })

      } catch (error) {
        res.status(500);
        res.send(error.message);  
      }

}


const refreshVentasFlotillasDMSTable = async() => {
    try {
        return await axios.get(endPointVentasflotillas);
    } catch (error) {
        console.error(error)
    }
}

const refreshInventarioVehiculosFlotillas = async() => {
    try {
        return await axios.get(endPointInvVehiculosFlot);
    } catch (error) {
        console.error(error)
    }
}

const registrarResultados = async (lista, pool, Empresa, Sucursal) => {
    // const cuery1 = querys.isVINInTable;
    // const cuery2 = querys.insertVINtoTable;

    for (const obj of lista) {
        let existeVin = await pool.request()
            .input("Empresa", sql.Int, Empresa)
            .input("Sucursal", sql.Int, Sucursal)
            .input("Vin", sql.VarChar, obj.Vin)
            // .query( cuery1 )
            .execute( storedProcedures.spf_existsVinOnVentasFlotillas_leer )

            if ( !existeVin.recordset[0].valor ) {

                await pool.request()
                    .input("Empresa",     sql.Int,     Empresa)
                    .input("Sucursal",    sql.Int,     Sucursal)
                    .input("FechaVenta",  sql.Date,    obj.FechaVenta)
                    .input("Inventario",  sql.VarChar, obj.Inventario)
                    .input("Descripcion", sql.VarChar, obj.Descripcion)
                    .input("Vin",         sql.VarChar, obj.Vin)
                    .input("Factura",     sql.VarChar, obj.Factura) //Propiedad Factura VentasMEs
                    .input("Vendedor",    sql.VarChar, obj.Vendedor)
                    .input("NumCliente",  sql.Int,     obj.NumCliente)
                    .input("Cliente",     sql.VarChar, obj.Cliente)
                    .input("Venta",       sql.Float,   obj.Venta)
                    .input("Costo",       sql.Float,   obj.Costo)
                    .input("Paquete",     sql.VarChar, obj.Paquete)
                    .input("Color",       sql.VarChar, obj.Color)
                    .input("Asignado",    sql.Date,    obj.Asignado)
                    // .query( cuery2 )
                    .execute( storedProcedures.spf_insertVinOnVentasFlotillas_crear )


            }
           
    }
    

}

const deleteVINSFromHistorial = async ( pool, Empresa, Sucursal ) => {
    
    try {

        const inventario = await pool.request().execute( storedProcedures.spf_VehiculosDMSFlot_leer );
        
        for (const obj of inventario.recordset) {

            const existVINHistFact = await pool.request()
                .input( "VIN", sql.VarChar, obj.serie )
                .execute( storedProcedures.spf_existVINOnHistorialFacturados_leer );

                
                if ( existVINHistFact.rowsAffected[0] > 0 ) {
                    
                    const existVinAsigTable = await pool.request()
                        .input( "VIN", sql.VarChar, obj.serie )
                        .execute( storedProcedures.spf_existVINOnAsignacionVins_leer ) 
                    
                    if ( existVinAsigTable.rowsAffected[0] === 0 ) {
                        
                        await pool.request() .input( "VIN", sql.VarChar, obj.serie ) .execute( storedProcedures.spf_VINOnHistorialFacturados_eliminar )

                    }

                }
            
        }

        
    } catch (error) {
        res.status(500);
        res.send(error.message);  
    }

}
