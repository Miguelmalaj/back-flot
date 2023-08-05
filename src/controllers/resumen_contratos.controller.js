import { getConnection, querys, sql, storedProcedures } from "../database";

export const getNombresLotesCliente = async( req, res ) => {
    const { agencia, Nombre_corto, Ubicacion, numCliente } = req.body;
    const { Empresa, Sucursal } = agencia;
    const Referencia = '';
    const Folio_compra_contrato = '';
    // const cuery = querys.getNombresLotesClienteResumen; 

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa", sql.Int, Empresa)
            .input("Sucursal", sql.Int, Sucursal)
            .input("Nombre_cliente", sql.VarChar, Nombre_corto)
            .input("Referencia", sql.VarChar, Referencia)
            .input("Folio_compra_contrato", sql.VarChar, Folio_compra_contrato)
            .input("Ubicacion_cliente", sql.VarChar, Ubicacion)
            .input("numCliente", sql.Int, numCliente)
            // .query( cuery )
            .execute( storedProcedures.spf_nomLotesByClienteResumen_leer )

            res.json(result.recordset)
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }


}

export const getLoteCliente = async( req, res) => {
    const { agencia, Folio_lote, NumCliente } = req.body;
    const { Empresa, Sucursal } = agencia;
    // const cuery = querys.getLoteClienteResumen;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Empresa", sql.Int, Empresa)
            .input("Sucursal", sql.Int, Sucursal)
            .input("Folio_lote", sql.Int, Folio_lote)
            .input("NumCliente", sql.Int, NumCliente)
            // .query(cuery)
            .execute( storedProcedures.spf_loteClienteResumen_leer )
            res.json(result.recordset)
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}