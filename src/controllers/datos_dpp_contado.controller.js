import { getConnection, querys, sql, storedProcedures } from "../database";
import { datesAreEquality } from "./helpers/helpers";

export const getVinsCliente = async ( req, res ) => {
    const { Agencia, NumCliente } = req.body;
    const { Empresa, Sucursal } = Agencia;
    const storeProcedure = `spf_logisticavins_leer`

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa", sql.Int, Empresa)
            .input("Sucursal", sql.Int, Sucursal)
            .input("NumCliente", sql.Int, NumCliente)
            .execute(storeProcedure)

            pool.close();
            
            res.json(result.recordset)
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

export const createPermisoDesvio = async ( req, res ) => {
    const { agencia, data, limiteCreditoCliente } = req.body;
    const { Empresa, Sucursal } = agencia;
    const defaultDate = "1900-01-01"
    const emptyString = ""
    let vinsToUpdateList = []
    let isPermisoDPP  = false;
    let isFolioDPPOnBD  = false;
    let isFolioDesvioOnBD  = false;

    try {
        const pool = await getConnection();

        for (const obj of data) {

            /* registros que no están aún en base de datos: se registran */
            if ( !obj.isOnBD ) {

                if ( obj.PermisoDesvio  === 'DPP') isPermisoDPP = true;

                await pool.request()
                  .input("Empresa",                      sql.Int,       Empresa)
                  .input("Sucursal",                     sql.Int,       Sucursal)
                  .input("Cliente",                      sql.Int,       obj.NumeroCliente)
                  .input("FolioDesvio",                  sql.VarChar,   `${obj.FolioDesvio}`.toUpperCase().trim())
                  .input("VIN",                          sql.VarChar,   obj.VIN)
                  .input("FolioDPP",                     sql.VarChar,   obj.PermisoDesvio === "Contado" ? emptyString : `${obj.FolioDPP}`.toUpperCase().trim())
                  .input("FechaVencimiento",             sql.Date,      obj.FechaVencimiento === emptyString ? defaultDate : obj.FechaVencimiento)
                  .input("FechaVencimientoDPP1",         sql.Date,      obj.PermisoDesvio === "Contado" ? defaultDate : obj.FechaVencimientoDPP1 === emptyString ? defaultDate : obj.FechaVencimientoDPP1)
                  .input("FechaSolicitudDPP",            sql.Date,      obj.PermisoDesvio === "Contado" ? defaultDate : obj.FechaSolicitudDPP === emptyString ? defaultDate : obj.FechaSolicitudDPP)
                  .input("FechaDeEntregaDPP",            sql.Date,      obj.PermisoDesvio === "Contado" ? defaultDate : obj.FechaDeEntregaDPP === emptyString ? defaultDate : obj.FechaDeEntregaDPP)
                  .input("Inventario",                   sql.VarChar,   obj.Inventario.split('-').pop())
                  .input("Factura",                      sql.VarChar,   obj.Factura)
                  .input("NombreCliente",                sql.VarChar,   obj.Cliente)
                  .input("Ubicacion",                    sql.VarChar,   obj.UbicacionCliente)
                  .input("Observaciones",                sql.VarChar,   obj.Observaciones)
                  /* Agregamos nuevos inputs */
                  .input("FechaSalida",                  sql.Date,     obj.FechaSalida  === emptyString ? defaultDate : obj.FechaSalida)
                  .input("FechaLlegada",                 sql.Date,     obj.FechaLlegada === emptyString ? defaultDate : obj.FechaLlegada)
                  .input("FechaEntrega",                 sql.Date,     obj.FechaEntrega === emptyString ? defaultDate : obj.FechaEntrega)
                  .input("PermisoDesvio",                sql.VarChar,  obj.PermisoDesvio)

                  .execute( storedProcedures.spf_logisticaVINS_crear )
            }

            /* se guardan los VINS que ya se encuentran en BD a la lista vinsToUpdateList */
            if ( obj.isOnBD ) {
                vinsToUpdateList.push(obj)
            }
            
        } 

        /* si no se encuentran registros en la lista de VINS que serán actualizados: */
        /* if ( vinsToUpdateList.length === 0 ) {

            // si el bloque es permiso DPP
            if ( isPermisoDPP ) {

                for (const obj of data) {
                   const result =  await pool.request()
                  .input("Empresa",                      sql.Int,       Empresa)
                  .input("Sucursal",                     sql.Int,       Sucursal)
                  .input("FolioDPP",                     sql.VarChar,   `${obj.FolioDPP}`.toUpperCase().trim())
                  .input("FolioDesvio",                  sql.VarChar,   `${obj.FolioDesvio}`.toUpperCase().trim())
                  .execute( storedProcedures.spf_existsFolioDPPInPermisoDesvio_leer )
                  if ( result.recordset.length > 0 ) isFolioDPPOnBD = true;

                }

                // si no se encontró el FolioDPP en BD
                if ( !isFolioDPPOnBD ) {
                    const parametersObj = {data, pool, agencia, defaultDate}
                    await createEarlierPermisoDesvio( parametersObj )
                
                }
            
            }

            // si el bloque es permiso Contado
            if ( !isPermisoDPP ) {
                
               for (const obj of data) {
                    const result =  await pool.request()
                    .input("Empresa",            sql.Int,       Empresa)
                    .input("Sucursal",           sql.Int,       Sucursal) 
                    .input("FolioDesvio",        sql.VarChar,  `${obj.FolioDesvio}`.toUpperCase().trim())
                    .execute( storedProcedures.spf_existsFolioDesvioInPermisoDesvio_leer )
                    if ( result.recordset.length > 0 ) isFolioDesvioOnBD = true;

                    if ( !isFolioDesvioOnBD ) {
                        const parametersObj = {data, pool, agencia, defaultDate}
                        await createEarlierPermisoDesvio( parametersObj )
                    }
               }

            }

        } */


        /* actualizamos el nuevo límite de crédito del cliente. */
        if ( isPermisoDPP ) {
            await pool.request()
            .input("Empresa",       sql.Int,   Empresa)
            .input("Sucursal",      sql.Int,   Sucursal)
            .input("LimiteCredito", sql.Float, limiteCreditoCliente)
            .input("Num_cliente",   sql.Float, data[0].NumeroCliente)
            .execute( storedProcedures.spf_creditoClienteFlotillas_actualizar )
        }

        pool.close();

        res.json({
            "isCreated":true,
            "vinsToUpdateList": vinsToUpdateList
        })
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

const updateEarlierPermisoDesvio = async ( parametersObj ) => {
    /* const { data, pool, agencia } = parametersObj;
    const { Empresa, Sucursal } = agencia;
    const FechaVencimientoDPP1 = 'FechaVencimientoDPP1'
    const FechaVencimiento = 'FechaVencimiento'
    const defaultDate = "1900-01-01" 
    const emptyString = ""
    const DPP = 'DPP'
    const Contado = 'Contado'
    const tipPerm = data[0].PermisoDesvio
    const key = tipPerm === Contado ? FechaVencimiento : FechaVencimientoDPP1;

    const folioDesvioSelected = tipPerm === Contado ? `${data[0].FolioDesvio}`.toUpperCase().trim() : `${data[0].oldFolioDesvio}`.toUpperCase().trim()
    const result = await pool.request()
    .input("Empresa",     sql.Int, Empresa)
    .input("Sucursal",    sql.Int, Sucursal)
    .input("FolioDesvio", sql.VarChar, folioDesvioSelected)
    .input("FolioDPP",    sql.VarChar, `${data[0].FolioDPP}`.toUpperCase().trim())
    .execute( tipPerm === Contado ? storedProcedures.spf_earliestDateContado_leer : storedProcedures.spf_earliestDateDPP_leer );

    const earlierDate = result.recordset[0].earliestDate

    const permisoToUpdate = data.find( obj => new Date(obj[key]) >= earlierDate);
    
    await pool.request()
        .input("Empresa",                   sql.Int,      Empresa)
        .input("Sucursal",                  sql.Int,      Sucursal)
        .input("FolioDesvio",               sql.VarChar,  `${permisoToUpdate.FolioDesvio}`.toUpperCase().trim())
        .input("OldFolioDesvio",            sql.VarChar,  `${permisoToUpdate.oldFolioDesvio}`.toUpperCase().trim())
        .input("FechaSalida",               sql.Date,     permisoToUpdate.FechaSalida === emptyString ? defaultDate : permisoToUpdate.FechaSalida)
        .input("FechaLlegada",              sql.Date,     permisoToUpdate.FechaLlegada === emptyString ? defaultDate : permisoToUpdate.FechaLlegada)
        .input("FechaEntrega",              sql.Date,     permisoToUpdate.FechaEntrega === emptyString ? defaultDate : permisoToUpdate.FechaEntrega)
        .input("FolioDPP",                  sql.VarChar,  `${permisoToUpdate.FolioDPP}`.toUpperCase().trim())
        .input("FechaVencimiento",          sql.Date,     permisoToUpdate.FechaVencimiento === emptyString ? defaultDate : permisoToUpdate.FechaVencimiento)
        .input("FechaVencimientoDPP1",      sql.Date,     tipPerm === Contado ? defaultDate : permisoToUpdate.FechaVencimientoDPP1 === emptyString ? defaultDate : permisoToUpdate.FechaVencimientoDPP1 )
        .input("FechaSolicitudDPP",         sql.Date,     tipPerm === Contado ? defaultDate : permisoToUpdate.FechaSolicitudDPP === emptyString ? defaultDate : permisoToUpdate.FechaSolicitudDPP )
        .execute( tipPerm === Contado ? storedProcedures.spf_permisoDesvioContado_actualizar : storedProcedures.spf_permisoDesvioDPP_actualizar ) */

}

const createEarlierPermisoDesvio = async ( parametersObj ) => {
    /* const { data, pool, agencia, defaultDate} = parametersObj;
    const { Empresa, Sucursal } = agencia;
    const FechaVencimientoDPP1 = 'FechaVencimientoDPP1'
    const FechaVencimiento = 'FechaVencimiento'
    const DPP = 'DPP'
    const Contado = 'Contado'
    const emptyString = ""
    const tipPerm = data[0].PermisoDesvio

    const key = tipPerm === DPP ? FechaVencimientoDPP1 : FechaVencimiento;

    const result = await pool.request()
    .input("Empresa",  sql.Int, Empresa)
    .input("Sucursal", sql.Int, Sucursal)
    .input("FolioDesvio", sql.VarChar, `${data[0].FolioDesvio}`.toUpperCase().trim())
    .input("FolioDPP", sql.VarChar, `${data[0].FolioDPP}`.toUpperCase().trim())
    .execute( tipPerm === Contado ?  storedProcedures.spf_earliestDateContado_leer : storedProcedures.spf_earliestDateDPP_leer );

    const earlierDate = result.recordset[0].earliestDate

    let permisoToRegister = data.find( obj => new Date(obj[key]) >= earlierDate);

    if ( permisoToRegister === undefined )  permisoToRegister =  data.find( obj => obj[key] === emptyString); //considerar cambiar esta línea.
   
        await pool.request()
            .input("Empresa",                   sql.Int,      Empresa)
            .input("Sucursal",                  sql.Int,      Sucursal)
            .input("PermisoDesvio",             sql.VarChar,  permisoToRegister.PermisoDesvio)
            .input("FolioDesvio",               sql.VarChar,  `${permisoToRegister.FolioDesvio}`.toUpperCase().trim())
            .input("FechaSalida",               sql.Date,     permisoToRegister.FechaSalida === emptyString ? defaultDate : permisoToRegister.FechaSalida)
            .input("FechaLlegada",              sql.Date,     permisoToRegister.FechaLlegada === emptyString ? defaultDate : permisoToRegister.FechaLlegada)
            .input("FechaEntrega",              sql.Date,     permisoToRegister.FechaEntrega === emptyString ? defaultDate : permisoToRegister.FechaEntrega)
            .input("FolioDPP",                  sql.VarChar,  `${permisoToRegister.FolioDPP}`.toUpperCase().trim())
            .input("FechaVencimiento",          sql.Date,     permisoToRegister.FechaVencimiento === emptyString ? defaultDate : permisoToRegister.FechaVencimiento)
            .input("FechaVencimientoFase2",     sql.Date,     defaultDate)
            .input("FechaSolicitudFase2",       sql.Date,     defaultDate)
            .input("Cliente",                   sql.Int,      permisoToRegister.NumeroCliente)
            .input("FechaVencimientoDPP1",      sql.Date,     permisoToRegister.PermisoDesvio === "Contado" ? defaultDate : permisoToRegister.FechaVencimientoDPP1 === emptyString ? defaultDate : permisoToRegister.FechaVencimientoDPP1)
            .input("FechaSolicitudDPP",         sql.Date,     permisoToRegister.PermisoDesvio === "Contado" ? defaultDate : permisoToRegister.FechaSolicitudDPP === emptyString ? defaultDate : permisoToRegister.FechaSolicitudDPP)
            .execute( storedProcedures.spf_permisoDesvio_crear ) */

}

export const updatePermisoDesvio = async ( req, res ) => {
    const { agencia, data } = req.body;
    const defaultDate = "1900-01-01" 
    const emptyString = ""
    const tipPerm = data[0].PermisoDesvio
    const DPP = 'DPP'
    const Contado = 'Contado'

    try {
        const pool = await getConnection();

        for (const obj of data) {

            await pool.request()
                  .input("Empresa",                sql.Int,       agencia.Empresa)
                  .input("Sucursal",               sql.Int,       agencia.Sucursal)
                  .input("FechaVencimiento",       sql.Date,      obj.FechaVencimiento === emptyString ? defaultDate : obj.FechaVencimiento)
                  .input("FolioDesvio",            sql.VarChar,   `${obj.FolioDesvio}`.toUpperCase())
                  .input("VIN",                    sql.VarChar,   obj.VIN)
                  .input("FolioDPP",               sql.VarChar,   `${obj.FolioDPP}`.toUpperCase())
                  .input("FechaVencimientoDPP1",   sql.Date,      tipPerm === Contado ?  defaultDate : obj.FechaVencimientoDPP1 === emptyString ? defaultDate : obj.FechaVencimientoDPP1)
                  .input("FechaDeEntregaDPP",      sql.Date,      tipPerm === Contado ? defaultDate : obj.FechaDeEntregaDPP === emptyString ? defaultDate : obj.FechaDeEntregaDPP)
                  .input("FechaSolicitudDPP",      sql.Date,      tipPerm === Contado ?  defaultDate : obj.FechaSolicitudDPP === emptyString ? defaultDate : obj.FechaSolicitudDPP)
                  .input("Observaciones",          sql.VarChar,   obj.Observaciones)
                  /* Agregamos nuevos inputs */
                  .input("FechaSalida",            sql.Date,      obj.FechaSalida  === emptyString ? defaultDate : obj.FechaSalida)
                  .input("FechaLlegada",           sql.Date,      obj.FechaLlegada === emptyString ? defaultDate : obj.FechaLlegada)
                  .input("FechaEntrega",           sql.Date,      obj.FechaEntrega === emptyString ? defaultDate : obj.FechaEntrega)
                  .input("PermisoDesvio",          sql.VarChar,   obj.PermisoDesvio)
                  .input("Id",                     sql.Int,       obj.Id)
                  .execute( tipPerm === Contado ?  storedProcedures.spf_LogisticaVINContado_actualizar : storedProcedures.spf_LogisticaVINDPP_actualizar )
        }

        /* Método para actualizar la tabla permiso desvio (será comentado, ya no se utilizará) */
        /* const parametersObj = {data, pool, agencia}
        await updateEarlierPermisoDesvio( parametersObj ) */

        pool.close();

        res.json({"isUpdated":true})

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const getVinsClientToCancel = async ( req, res ) => {
    const { Agencia, NumCliente, PermisoDesvio, folioDesvio, folioDPP } = req.body;
    const { Empresa, Sucursal } = Agencia;
    /* let cuery = querys.getVinsToExtensionPermiso;

    if ( PermisoDesvio === 'DPP' ) {
        cuery = querys.getVinsToDPPS;
    } */

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa",       sql.Int, Empresa)
            .input("Sucursal",      sql.Int, Sucursal)
            .input("Cliente",       sql.Int, NumCliente)
            .input("PermisoDesvio", sql.VarChar, PermisoDesvio)
            .input("FolioDesvio",   sql.VarChar, `${folioDesvio}`.toUpperCase())
            .input("FolioDPP",      sql.VarChar, folioDPP)
            .execute( storedProcedures.spf_logisticaVinsToExtPermOrDPPS_leer )

            pool.close();

            res.json(result.recordset)

        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const cancelFolioDesvio = async ( req, res ) => { 
    const { Agencia, data } = req.body;
    const { Empresa, Sucursal } = Agencia;

   try {
        const pool = await getConnection();

        for (const obj of data) {
            await pool.request()
            .input("Empresa",          sql.Int,      Empresa)
            .input("Sucursal",         sql.Int,      Sucursal)
            .input("FolioDesvio",      sql.VarChar, `${obj.FolioDesvio}`.toUpperCase())
            .input("VIN",              sql.VarChar,  obj.VIN)
            .input("Id",               sql.Int,      obj.Id)
            .execute(storedProcedures.spf_cancelarFoliosDesvioLogisticaVins_actualizar)

        }

        /* Siguientes métodos fueron comentados: se encargaban de cancelar el registro en la tabla permiso desvio. */
        /* const result =  await pool.request()
        .input("Empresa", sql.Int, Empresa)
        .input("Sucursal", sql.Int, Sucursal)
        .input("FolioDesvio", sql.VarChar, `${data[0].FolioDesvio}`.toUpperCase())
        .input("FolioDPP", sql.VarChar, data[0].FolioDPP)
        .execute( storedProcedures.spf_logisticaVinsExistsVinNoCancel_leer )


        if ( result.rowsAffected[0] === 0 ) {
             await pool.request()
             .input("Empresa",       sql.Int, Empresa)
             .input("Sucursal",      sql.Int, Sucursal)
             .input("FolioDesvio",   sql.VarChar, `${data[0].FolioDesvio}`.toUpperCase())
             .input("FolioDPP",      sql.VarChar, data[0].FolioDPP)
             .input("PermisoDesvio", sql.VarChar, data[0].PermisoDesvio) 
             .execute(storedProcedures.spf_cancelarFoliosDesvioPermisoDesvio_actualizar)
        } */

        pool.close();

        res.json({"isCanceled":true})
    
   } catch (error) {
        res.status(500);
        res.send(error.message);
   }
}

export const getFoliosDesvioByCliente = async ( req, res ) => {
    const { Agencia, NumCliente, permisoDesvio, pestana } = req.body;
    const { Empresa, Sucursal } = Agencia;
    const DPP2_Extensiones = "DPP2_Extensiones"
    const Cancelaciones = "Cancelaciones"
    const Resumen = "Resumen"
    const Ambos = "Ambos"
    let cuery = "";
    if ( pestana === DPP2_Extensiones) cuery = storedProcedures.spf_foliosDesDPPToSelect_leer //querys.getFoliosDesvioByCliente;
    if ( pestana === Cancelaciones) cuery = storedProcedures.spf_foliosDesDPPToSelect_leer //querys.getFoliosDesvioByClienteCancel;
    if ( pestana === Resumen ) {
        cuery = storedProcedures.spf_foliosDesDPPToSelect_leer //querys.getFoliosDesvioByClienteResumen;
        if ( permisoDesvio === Ambos ) cuery = storedProcedures.spf_foliosDesDPPTodosToSelect_leer //querys.getFoliosDesvioDPPYContByCliente;
    }

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa", sql.Int, Empresa)
            .input("Sucursal", sql.Int, Sucursal)
            .input("Cliente", sql.Int, NumCliente)
            .input("PermisoDesvio", sql.VarChar, permisoDesvio)
            // .query( cuery )
            .execute( cuery )

            pool.close();

            res.json(result.recordset)

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const getVinsClientToResumen = async ( req, res ) => {
    const { Agencia:{ Empresa, Sucursal }, NumCliente, PermisoDesvio, folioDesvio, FolioDPP } = req.body;
    let cuery = '';
    const DPP = 'DPP'
    const Ambos = 'Ambos'
    const Todos = 'Todos'
    const Contado = 'Contado'

    /* if ( PermisoDesvio === Ambos ) {
        cuery = querys.DPPYContadoFolioDesvioUnico
        if ( folioDesvio === Todos) cuery = querys.DPPYContadoFolioDesvioTodos
    }

    if ( PermisoDesvio !== Ambos ) {
        cuery = querys.ContExtOrDPPF1F2FolioDesvioUnico;
        if ( folioDesvio === Todos) cuery = querys.ContExtOrDPPF1F2FolioDesvioTodos
    } */

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa",       sql.Int,      Empresa)
            .input("Sucursal",      sql.Int,      Sucursal)
            .input("Cliente",       sql.Int,      NumCliente)
            .input("PermisoDesvio", sql.VarChar,  PermisoDesvio)
            // .input("FolioDesvio",   sql.VarChar, `${folioDesvio}`.toUpperCase())
            .input("FolioDesvio",   sql.VarChar, folioDesvio)
            .input("FolioDPP",      sql.VarChar, FolioDPP)
            // .query( cuery )
            .execute( storedProcedures.spf_logisticaVinsToResumenByClient_leer )
            
            pool.close();

            res.json(result.recordset)
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const getVinsClientToResumenPrint = async ( req, res ) => {
    const { Agencia:{ Empresa, Sucursal }, NumCliente, PermisoDesvio, folioDesvio, FolioDPP } = req.body;
    // let procecedure = storedProcedures.spf_resumAllByCliente_leer;
    let permisos = PermisoDesvio;
    let folio = folioDesvio;
    const Ambos = 'Ambos'
    const Todos = 'Todos'

    /* Cando PermisoDesvio o folioDesvio es asignado como '', obtiene todos sus registros, sino, sólo alguno es específico */
    if ( PermisoDesvio === Ambos ) {
        permisos = '';
        if ( folioDesvio === Todos) folio = '' 
    }

    if ( PermisoDesvio !== Ambos ) {
        if ( folioDesvio === Todos) folio = '' 
    }

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa",       sql.Int,        Empresa)
            .input("Sucursal",      sql.Int,        Sucursal)
            .input("Cliente",       sql.Int,        NumCliente)
            .input("Permisos",      sql.VarChar,    permisos) 
            .input("FolioDesvio",   sql.VarChar,    `${folio}`.toUpperCase()) 
            .input("FolioDPP",      sql.VarChar,    FolioDPP) 
            .execute( storedProcedures.spf_resumAllByCliente_leer )

            pool.close();

            res.json(result.recordset)
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

export const getvinsclientetoDPP2orExt = async ( req, res ) => {
    const { Agencia, NumCliente, permisoDesvio, folioDesvio, folioDPP } = req.body;
    const { Empresa, Sucursal } = Agencia;
    // let cuery = querys.getVinsToExtensionPermiso;

    /* if ( req.body.permisoDesvio === 'DPP' ) {
        cuery = querys.getVinsToDPPS;
    } */

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa",       sql.Int,     Empresa)
            .input("Sucursal",      sql.Int,     Sucursal)
            .input("Cliente",       sql.Int,     NumCliente)
            .input("PermisoDesvio", sql.VarChar, permisoDesvio)
            .input("FolioDesvio",   sql.VarChar, `${folioDesvio}`.toUpperCase())
            .input("FolioDPP",      sql.VarChar, folioDPP)
            .execute( storedProcedures.spf_datDPPVinsToExtPermOrDPPS_leer )

            pool.close();  

            res.json(result.recordset)
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const createDPPFase2 = async ( req, res ) => {
    const { data , agencia } = req.body;
    const { Empresa , Sucursal } = agencia;
    let datesSolicitudesAreEquality = false;
    let datesVencimientoAreEquality = false;
    let errorMessage = true;
    // let cuery = querys.addDPPFase2LogisticaVINS;

    try {

        const pool = await getConnection();

        for (const obj of data) {

            const res = await pool.request()
                .input("Empresa",   sql.Int,      Empresa)
                .input("Sucursal",  sql.Int,      Sucursal)
                .input("VIN",       sql.VarChar,  obj.VIN)
                .execute( storedProcedures.spf_hasVINExtensionesExtra_leer )
                
                const registro = res.recordset[0];
                let CantExtensiones = registro.CantExtensiones;

                datesSolicitudesAreEquality = datesAreEquality( new Date(obj.FechaSolicitudFase2), registro.FechaSolicitudFase2  );
                datesVencimientoAreEquality = datesAreEquality( new Date(obj.FechaVencimientoFase2), registro.FechaVencimientoFase2  );
               
               if ( ! datesSolicitudesAreEquality || ! datesVencimientoAreEquality ) {
                CantExtensiones ++;
                errorMessage = false;
               }

            await pool.request()
            .input("Empresa",                  sql.Int,      Empresa)
            .input("Sucursal",                 sql.Int,      Sucursal)
            .input("FolioDPP",                 sql.VarChar,  `${obj.FolioDPP}`.toUpperCase())
            .input("OldFolioDPP",              sql.VarChar,  `${obj.OldFolioDPP}`.toUpperCase())
            .input("FechaSolicitudFase2",      sql.Date,     obj.FechaSolicitudFase2)
            .input("FechaVencimientoFase2",    sql.Date,     obj.FechaVencimientoFase2)
            .input("FolioDesvio",              sql.VarChar,  `${obj.FolioDesvio}`.toUpperCase())
            .input("VIN",                      sql.VarChar,  obj.VIN)
            .input("Id",                       sql.Int,      obj.Id)
            .input("CantExtensiones",          sql.Int,      CantExtensiones)
            /* Se registran los VINS con DPP2  */
            .execute( storedProcedures.spf_datDPPVinDPPFase2_actualizar );
            
        }




        /* Las siguientes consultas a BD son comentadas, se utilizaban para actualizar las fechas recientes en tabla permiso desvio. */
        /* const result =  await pool.request()
            .input("Empresa",       sql.Int,      Empresa)
            .input("Sucursal",      sql.Int,      Sucursal)
            .input("FolioDesvio",   sql.VarChar,  `${data[0].FolioDesvio}`.toUpperCase())
            .input("OldFolioDPP",   sql.VarChar,  `${data[0].OldFolioDPP}`.toUpperCase())
            // Consulta para obtener registros del Folio (VINS sin Fechas DPP2 asignadas)
            .execute( storedProcedures.spf_datDPPexistsVinsWithoutFolioDPP2_leer );

            if ( result.rowsAffected[0] === 0 ) {
                
                const resultDate = await pool.request()
                    .input("Empresa",     sql.Int, Empresa)
                    .input("Sucursal",    sql.Int, Sucursal)
                    .input("FolioDesvio", sql.VarChar, `${data[0].FolioDesvio}`.toUpperCase())
                    .input("FolioDPP",    sql.VarChar, `${data[0].FolioDPP}`.toUpperCase())
                    // Consulta para obtener la Fecha DPP2 más reciente 
                    .execute( storedProcedures.spf_earliestDateDPPF2_leer );

                const earlierDate = resultDate.recordset[0].earliestDate;

                const earliestRegister = await pool.request()
                    .input("Empresa",  sql.Int,      Empresa)
                    .input("Sucursal",  sql.Int,      Sucursal)
                    .input("FolioDesvio", sql.VarChar, `${data[0].FolioDesvio}`.toUpperCase())
                    .input("FolioDPP",    sql.VarChar, `${data[0].FolioDPP}`.toUpperCase())
                    .input("FechaVencimientoFase2", sql.Date, earlierDate)
                    // Consulta el registro completo con la Fecha DPP2 más reciente obtenida en la query anterior.
                    .execute( storedProcedures.spf_registroEarliestDateDPPF2_leer );

                await pool.request()
                .input("Empresa",                  sql.Int,      Empresa)
                .input("Sucursal",                 sql.Int,      Sucursal)
                .input("FolioDPP",                 sql.VarChar,  `${earliestRegister.recordset[0].FolioDPP}`.toUpperCase())
                .input("OldFolioDPP",              sql.VarChar,  `${data[0].OldFolioDPP}`.toUpperCase())
                .input("FechaSolicitudFase2",      sql.Date,     earliestRegister.recordset[0].FechaSolicitudFase2)
                .input("FechaVencimientoFase2",    sql.Date,     earliestRegister.recordset[0].FechaVencimientoFase2)
                .input("FolioDesvio",              sql.VarChar,  `${earliestRegister.recordset[0].FolioDesvio}`.toUpperCase())
                // Actualiza las fechas DPP2 en la tabla general (Permiso_Desvio)
                .execute( storedProcedures.spf_datDPPVinDPPFase2PermDesvio_actualizar );
                
            } */

        pool.close();

        res.json({ "isCreated": true, errorMessage})
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

export const createExtensionPermiso = async ( req, res ) => {
    const body    = JSON.parse( req.body.body );
    const agencia = JSON.parse( req.body.agencia ); 
    const { Empresa, Sucursal } = agencia;
    let hasPDF = '';
    let bufferFicticio = '';
    const buffer = req.file;
    // let cuery = querys.addExtPermiso

    if ( buffer === undefined ) {
        // cuery = querys.addExtPermisoPDFNull;
        hasPDF = 'N'
        bufferFicticio = Buffer.from('buffer ficticio')
    }

    try {
        const pool = await getConnection();
            for (const obj of body) {
                await pool.request()
                .input("Empresa",              sql.Int,        Empresa)
                .input("Sucursal",             sql.Int,        Sucursal)
                .input("VIN",                  sql.VarChar,    obj.VIN)
                .input("FolioDesvio",          sql.VarChar,    `${obj.FolioDesvio}`.toUpperCase())
                .input("FechaSolicitudExtP",   sql.VarChar,    obj.FechaSolicitudExtP)
                .input("FechaVencimientoExtP", sql.VarChar,    obj.FechaVencimientoExtP)
                .input("DocumentoAdjunto",     sql.VarBinary,  hasPDF === '' ? buffer.buffer : bufferFicticio)
                .input("hasPDF",               sql.VarChar,    hasPDF) 
                // .query( cuery )
                .execute( storedProcedures.spf_datDPPExtPermPDF_crear );
            }

            pool.close()

            res.json({"isCreated": true})

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const getFechasExtensionesByVIN = async( req, res ) => {
    const { agencia, VIN, FolioDesvio } = req.body;
    const { Empresa, Sucursal } = agencia;
    // let cuery = querys.getExtensionsDateByVIN;


    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa",      sql.Int,      Empresa)
            .input("Sucursal",     sql.Int,      Sucursal)
            .input("VIN",          sql.VarChar,  VIN)
            .input("FolioDesvio",  sql.VarChar,  `${FolioDesvio}`.toUpperCase())
            // .query( cuery )
            .execute( storedProcedures.spf_extensionDatesByVin_leer )

            pool.close();

            res.json(result.recordset);
        
    } catch ( error ) {
        res.status(500);
        res.send(error.message);
    }
}

export const downloadPDF = async( req, res ) => {
    const { Id, agencia } = req.body;
    const { Empresa, Sucursal } = agencia;
    // const cuery = querys.getPDFExtensionPermById;

    try {
        let buffer;
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa",sql.Int, Empresa)
            .input("Sucursal",sql.Int,Sucursal)
            .input("Id",sql.Int, Id)
            // .query( cuery );
            .execute( storedProcedures.spf_PDFExtensionPermById_leer );

        if ( result.recordset.length > 0 ) buffer = result.recordset[0].DocumentoAdjunto;

        
       
        res.set('Content-Type', 'application/pdf')
        res.send(buffer)

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const datesPermisoDesvioByFolio = async( req, res ) => {
    const { Agencia:{ Empresa, Sucursal }, FolioDesvio, Cliente } = req.body;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa",      sql.Int,      Empresa)
            .input("Sucursal",     sql.Int,      Sucursal)
            .input("FolioDesvio",  sql.VarChar,  `${FolioDesvio}`.toUpperCase())
            .input("Cliente",      sql.Int,      Cliente)
            .execute( storedProcedures.spf_datesPermisoDesvioByFolio_leer )
            
            pool.close();
            
            res.json(result.recordset);
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const datesPermisoDesvioByFolioDPP = async( req, res ) => {
    const { Agencia:{ Empresa, Sucursal }, FolioDPP, Cliente } = req.body;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa",      sql.Int,      Empresa)
            .input("Sucursal",     sql.Int,      Sucursal)
            .input("FolioDPP",     sql.VarChar,  `${FolioDPP}`.toUpperCase())
            .input("Cliente",      sql.Int,      Cliente)
            .execute( storedProcedures.spf_datesPermisoDesvioByFolioDPP_leer )
            
            pool.close();
            
            res.json(result.recordset);
        
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
            .input("Empresa",       sql.Int,     Empresa)
            .input("Sucursal",      sql.Int,     Sucursal)
            .input("Cliente",       sql.VarChar, NombreCliente)
            .input("Ubicacion",     sql.VarChar, UbicacionCliente)
            .input("Num_cliente",   sql.Int,     Num_cliente)
            .execute( storedProcedures.spf_ordenesDeCompraByCliente_leer )

            pool.close()

            res.json(result.recordset)
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const get_limite_credito = async ( req, res ) => {
    const { Agencia: { Empresa, Sucursal }, numeroCliente } = req.body;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa", sql.Int, Empresa)
            .input("Sucursal", sql.Int, Sucursal)
            .input("Num_cliente", sql.Int, numeroCliente)
            .execute( storedProcedures.spf_limiteCreditoByCliente_leer );
            
            pool.close();
            
            res.json(result.recordset)

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

export const fechaDePago = async ( req, res ) => {
    const { dias, fechaDeEntrega } = req.body;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("fechaDeEntrega", sql.Date, fechaDeEntrega)
            .input("dias", sql.Int, dias)
            .execute( storedProcedures.spf_datDPPFechaDePago_leer );

            const { fechaDePago } = result.recordset[0];
            
            pool.close();

            res.json(fechaDePago);

    } catch (error) {
        res.status(500);
        res.send(error.message); 
    }
}

export const datesByVIN = async ( req, res ) => {
    const { VIN, Cliente } = req.body;
    
    try {
        const pool = await getConnection();
        const result = await pool.request()
        .input("VIN",         sql.VarChar, VIN)
        .input("Cliente",     sql.Int,     Cliente)
        .input("Empresa",     sql.Int,     5)
        .input("Sucursal",    sql.Int,     1)
        .execute( storedProcedures.spf_datDPPFechasVIN_leer );

        pool.close();

        res.json(result.recordset);

    } catch (error) {
        res.status(500);
        res.send(error.message); 
    }
}

/* Servicio para actualizar VINS, campos: PermisoDesvio,Fechasalida,FechaLlegada,FechaEntrega: tabla Logistica_VINS.
   Los valores son tomados de la tabla permisoDesvio que dejará de utilizarse.
   (se llama directamente de un cliente REST.) */

export const update_nuevos_campos = async ( req, res ) => {
    const Empresa  = 5;
    const Sucursal = 1;

    try {
        const pool = await getConnection();
        /* obtener registros de tabla permiso desvio */
        const permisosDesvio = await pool.request()
            .input("Empresa",     sql.Int,   Empresa)   
            .input("Sucursal",    sql.Int,   Sucursal) 
            .execute( storedProcedures.spf_datDPPPermisosDesvio_leer );

        for (const perm of permisosDesvio.recordset) {
            /* actualizar los campos en tabla logisticaVins. */
            await pool.request()
            .input("Empresa",          sql.Int,       Empresa)   
            .input("Sucursal",         sql.Int,       Sucursal) 
            .input("FolioDesvio",      sql.VarChar,   perm.FolioDesvio) 
            .input("FolioDPP",         sql.VarChar,   perm.FolioDPP) 
            .input("PermisoDesvio",    sql.VarChar,   perm.PermisoDesvio) 
            .input("FechaSalida",      sql.Date,      perm.FechaSalida) 
            .input("FechaLlegada",     sql.Date,      perm.FechaLlegada) 
            .input("FechaEntrega",     sql.Date,      perm.FechaEntrega) 
            .execute( storedProcedures.spf_datDPPLogisticaVINS_actualizar );
        }

        pool.close();

        res.json({ "isUpdated" : true })
        
    } catch (error) {
        res.status(500);
        res.send(error.message);  
    }
}