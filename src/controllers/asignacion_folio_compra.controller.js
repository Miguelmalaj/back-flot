import { getConnection, querys, sql, storedProcedures } from "../database";
import { FechaDeHoy, removerComas } from "./helpers/helpers";

export const getNombresLotesCliente =  async( req, res ) => {
    const { agencia, Nombre_corto, Ubicacion, numCliente } = req.body;
    const { Empresa, Sucursal } = agencia;
    const Referencia = '';
    const Folio_compra_contrato = '';
    const Monto_plan_piso = 0;
    // const cuery = querys.getNombresLotesClienteFolioCompra;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa",        sql.Int,            Empresa)
            .input("Sucursal",       sql.Int,            Sucursal)
            .input("Nombre_cliente", sql.VarChar,        Nombre_corto)
            .input("Referencia",     sql.VarChar,        Referencia)
            .input("Folio_compra_contrato", sql.VarChar, Folio_compra_contrato)
            .input("Monto_plan_piso",       sql.Float,   Monto_plan_piso)
            .input("Ubicacion_cliente",     sql.VarChar, Ubicacion)
            .input("numCliente",            sql.Int,     numCliente)
            // .query( cuery )
            .execute( storedProcedures.spf_nombresLotesClienteFolioCompra_leer )

            res.json(result.recordset)
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const getLoteCliente =  async( req, res ) => {
    const { agencia, Folio_lote, NumCliente } = req.body;
    const { Empresa, Sucursal } = agencia;
    // const cuery = querys.getLoteClienteFolioCompra;
    
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa", sql.Int, Empresa)
            .input("Sucursal", sql.Int, Sucursal)
            .input("Folio_lote", sql.Int, Folio_lote)
            .input("NumCliente", sql.Int, NumCliente)
            // .query(cuery)
            .execute( storedProcedures.spf_loteClienteFolioCompra_leer )
            let newResult = result.recordset;
            
            if ( newResult.length > 0 ) {
                newResult = calcularMontoEInversion(result.recordset);
            }

            res.json(newResult)
        
    } catch (error) {
        res.status(500);
        res.send(error.message);  
    }
    
}

const calcularMontoEInversion = ( list ) => {
    const modifyList = list.map((row) => {
        let newrow = {
            ...row,
            Monto_total             : new Intl.NumberFormat('es-MX').format( row.Monto_total ),
            Inversion_inicial       : new Intl.NumberFormat('es-MX').format( row.Inversion_inicial ),
            Fecha_compra_contrato   : (row.Fecha_compra_contrato.toString().substring(0, 15)) === "Sun Dec 31 1899" ? FechaDeHoy() : row.Fecha_compra_contrato
        }
        return newrow;

    })
    return modifyList;
}

export const updateLoteCliente =  async( req, res ) => {
    const { agencia, lote } = req.body;
    const { Empresa, Sucursal } = agencia;
    // const cuery = querys.updateFolioDeCompraLoteCliente;

    try {
        const pool = await getConnection();
        for (const registro of lote) {
            await pool.request()
            .input("Empresa",                       sql.Int,     Empresa)
            .input("Sucursal",                      sql.Int,     Sucursal)
            .input("Folio_lote",                    sql.Int,     registro.Folio_lote)
            .input("VIN",                           sql.VarChar, registro.VIN)
            .input("Folio_compra_contrato",         sql.VarChar, registro.Folio_compra_contrato)
            .input("Fecha_compra_contrato",         sql.Date,    registro.Fecha_compra_contrato)
            .input("Monto_plan_piso",               sql.Float,   removerComas(registro.Monto_plan_piso))
            .input("Monto_deposito_cuenta_cheques", sql.Float,   removerComas(registro.Monto_deposito_cuenta_cheques))
            .input("Tasa_porcentaje_enganche",      sql.Float,   registro.Tasa_porcentaje_enganche)
            .input("Monto_total",                   sql.Float,   removerComas(registro.Monto_total))
            .input("Inversion_inicial",             sql.Float,   removerComas(registro.Inversion_inicial))
            // .query(cuery)
            .execute( storedProcedures.spf_updateFolioDeCompraLoteCliente_actualizar )
        }

        res.json({"isUpdated": true})

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}