import { getConnection, querys, sql, storedProcedures } from "../database";
import { FechaDeHoy } from "./helpers/helpers";

export const getNombresLotesCliente = async ( req, res ) => {
    const { agencia, Nombre_corto, Ubicacion, numCliente, Estado } = req.body;
    const { Empresa, Sucursal } = agencia;
    // const cuery = querys.getNombresLotesCliente;
    const Referencia = Estado;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa", sql.Int, Empresa)
            .input("Sucursal", sql.Int, Sucursal)
            .input("Nombre_cliente", sql.VarChar, Nombre_corto)
            .input("Referencia", sql.VarChar, Referencia)
            .input("Ubicacion_cliente", sql.VarChar, Ubicacion)
            .input("numCliente", sql.Int, numCliente)
            // .query( cuery )
            .execute( storedProcedures.spf_asigLotesNombresLotesCliente_leer );

            res.json(result.recordset)
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

export const getLoteCliente = async ( req, res ) => {
    const { agencia, Folio_lote, NumCliente } = req.body;
    const { Empresa, Sucursal } = agencia;
    // const cuery = querys.getLoteClienteReferencia;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa", sql.Int, Empresa)
            .input("Sucursal", sql.Int, Sucursal)
            .input("Folio_lote", sql.Int, Folio_lote)
            .input("NumCliente", sql.Int, NumCliente)
            // .query(cuery)
            .execute( storedProcedures.spf_asigRefLoteClienteReferencia_leer )

            res.json(result.recordset)
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const updateLoteCliente = async ( req, res ) => {
    const { agencia, lote } = req.body;
    const { Empresa, Sucursal } = agencia;
    // const cuery = querys.updateReferenciaLoteCliente;

    try {
        const pool = await getConnection();
        for (const registro of lote) {
            await pool.request()
            .input("Empresa", sql.Int, Empresa)
            .input("Sucursal", sql.Int, Sucursal)
            .input("Folio_lote", sql.Int, registro.Folio_lote)
            .input("VIN", sql.VarChar, registro.VIN)
            .input("Referencia", sql.VarChar, registro.Referencia)
            // .query(cuery)    
            .execute( storedProcedures.spf_asigRefReferenciaLoteCliente_actualizar )    
        }
        

        res.json({"isUpdated": true})
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}