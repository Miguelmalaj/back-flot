import { getConnection, querys, sql, storedProcedures } from "../database";
import { removerComas } from "./helpers/helpers";


export const getClientes = async ( req, res ) => {
    const { Empresa, Sucursal } = req.body;
    
    try {
      const pool = await getConnection()
      const result = await pool.request()
        .input("Empresa",      sql.Int,     Empresa)
        .input("Sucursal",     sql.Int,     Sucursal)
        .execute( storedProcedures.spf_clientesFlotillas_leer )

        res.json(result.recordset)

    } catch (error) {
        res.status(500);
        res.send(error.message); 
    }

}

export const getClientesCatalog = async ( req, res ) => {
    const { agencia: { Empresa, Sucursal }, orderByRazon } = req.body;
    
    try {
      const pool = await getConnection()
      const result = await pool.request()
        .input("Empresa",       sql.Int,       Empresa)
        .input("Sucursal",      sql.Int,       Sucursal)
        .input("orderByRazon",  sql.VarChar,   orderByRazon)
        .execute( storedProcedures.spf_clientesFlotillas_leer )

        res.json(result.recordset)

    } catch (error) {
        res.status(500);
        res.send(error.message); 
    }

}

export const getClientesOrderedByPurchaseOrder = async ( req, res ) => {
    const { Empresa, Sucursal } = req.body;
    try {
        const pool = await getConnection()
        const result = await pool.request()
          .input("Empresa", sql.Int, Empresa)
          .input("Sucursal", sql.Int, Sucursal)
          // .query(cuery)
          .execute( storedProcedures.spf_clientesFlotillasOrdered_leer )
          res.json(result.recordset)
  
      } catch (error) {
          res.status(500);
          res.send(error.message); 
      }
}

export const updateClientes = async ( req, res ) => {
    const { cliente } = req.body;
    const { RFC, Razon_social, Nombre_corto, Num_cliente, Ubicacion, Id, LimiteCredito, FanCliente } = cliente;
    // const cuery = querys.updateClientes;

    try {
        const pool = await getConnection();
        await pool.request()
        .input("RFC",            sql.VarChar,   RFC)
        .input("Razon_social",   sql.VarChar,   Razon_social)
        .input("Nombre_corto",   sql.VarChar,   Nombre_corto)
        .input("Num_cliente",    sql.Int,       Num_cliente)
        .input("Ubicacion",      sql.VarChar,   Ubicacion)
        .input("LimiteCredito",  sql.Float,     removerComas(LimiteCredito))
        .input("Id",             sql.Int,       Id)
        .input("FanCliente",     sql.VarChar,   FanCliente)
        // .query(cuery)
        .execute( storedProcedures.spf_clientesFlotillas_actualizar )
        res.json({isUpdated: true})

    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

export const createClientes = async ( req, res ) => {
    const { cliente, agencia } = req.body;
    const { Empresa, Sucursal } = agencia;
    const { RFC, Razon_social, Nombre_corto, Num_cliente, Ubicacion, LimiteCredito, FanCliente } = cliente;
    // const cuery = querys.createClientes;

    try {
        const pool = await getConnection();
        await pool.request()
        .input("Empresa",       sql.Int,      Empresa)
        .input("Sucursal",      sql.Int,      Sucursal)
        .input("RFC",           sql.VarChar,  RFC)
        .input("Razon_social",  sql.VarChar,  Razon_social)
        .input("Nombre_corto",  sql.VarChar,  Nombre_corto)
        .input("Num_cliente",   sql.Int,      Num_cliente)
        .input("Ubicacion",     sql.VarChar,  Ubicacion)
        .input("LimiteCredito", sql.Float,    removerComas(LimiteCredito))
        .input("FanCliente",    sql.VarChar,  FanCliente)
        // .query( cuery )
        .execute( storedProcedures.spf_clientesFlotillas_crear );
        res.json({ isCreated: true })

    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

export const contactsTypes = async ( req, res ) => {
    // res.json({'mgs': 'contactsTypes'});
    //spf_TiposContactosCompraFlotillas_leer

    try {
        const pool = await getConnection()
        const result = await pool.request()
            .execute( storedProcedures.spf_TiposContactosCompraFlotillas_leer );

            res.json(result.recordset)        
        
    } catch (error) {
        res.status(500);
        res.send(error.message);     
    }
}

export const purchaseContacts = async ( req, res ) => {
    const { agencia : { Empresa, Sucursal }, clientNumber } = req.body;

    try {
        const pool = await getConnection()
        const result = await pool.request()
            .input("Empresa",       sql.Int,     Empresa)
            .input("Sucursal",      sql.Int,     Sucursal)
            .input("NumeroCliente", sql.Int,     clientNumber)
            .execute( storedProcedures.spf_contactosCompraFlotillas_leer );

            res.json(result.recordset)
        
    } catch (error) {
        res.status(500);
        res.send(error.message);    
    }

}

export const deleteContacts = async ( req, res ) => {
    const { agencia:{ Empresa, Sucursal }, numeroCliente } = req.body;

    try {
        const pool = await getConnection();
            await pool.request()
                .input("Empresa",        sql.Int,   Empresa)
                .input("Sucursal",       sql.Int,   Sucursal)    
                .input("numeroCliente",  sql.Int,   numeroCliente)
                .execute( storedProcedures.spf_contactosEntregaClientesFlot_eliminar )    
       

        res.json({ "isDeleted" : true }); 
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

}

export const createContacts = async ( req, res ) => {
    const { agencia:{ Empresa, Sucursal }, contactos } = req.body;

    try {

        const pool = await getConnection();

        for (const contact of contactos) {
            await pool.request()
                .input("Empresa",             sql.Int,       Empresa)
                .input("Sucursal",            sql.Int,       Sucursal)    
                .input("TipoContacto",        sql.Int,       contact.TipoContacto)
                .input("Num_cliente",         sql.Int,       contact.Num_cliente)
                .input("NombreContacto",      sql.VarChar,   contact.NombreContacto)
                .input("CorreoContacto",      sql.VarChar,   contact.CorreoContacto)
                .input("TelefonoContacto",    sql.VarChar,   contact.TelefonoContacto.substring(0,14))
                .execute( storedProcedures.spf_contactosEntregaClientesFlot_crear )    
            
        }
       

        res.json({ "isCreated" : true }); 

    } catch (error) {
        res.status(500);
        res.send(error.message);    
    }

}