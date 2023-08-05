import { getConnection, querys, sql, storedProcedures } from "../database";

export const login = async ( req, res ) => {
    const { Nombre, Empresa, Sucursal } = req.body;

    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input("Nombre", sql.VarChar, Nombre)
            .input("Empresa", sql.Int, Empresa)
            .input("Sucursal", sql.Int, Sucursal)
            // .query(querys.login);
            .execute( storedProcedures.spf_login_leer );
            const objData = createDataUser(result.recordset)
            res.json(objData)
        
    } catch (error) {
        res.status(500);
        res.send(error.message);  
    }
}

export const loginDMSUsers = async ( req, res ) => {
    const { Nombre, Clave, Empresa, Sucursal } = req.body;

    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input("Nombre", sql.VarChar, Nombre)
            .input("Empresa", sql.Int, Empresa)
            .input("Sucursal", sql.Int, Sucursal)
            // .query(querys.loginDMS)
            .execute( storedProcedures.spf_loginDMS_leer )
            const objData = createDataUserDMS(result.recordset, Clave)
            res.json(objData)

    } catch (error) {
        res.status(500);
        res.send(error.message);    
    }
}

const createDataUserDMS = (data, clave) => {
    let obj = { isUserFound: false }
    if ( data.length > 0 ) {
        if ( clave.toUpperCase().trim() === data[0].Clave.toUpperCase().trim() ) {
            obj = {
                Nombre      : data[0].Nombre,
                Usuario     : data[0].Usuario,
                isUserFound : true
            }
        }
    }

    return obj;
}

const createDataUser = (data) => {
    let obj = { isUserFound: false }
    if ( data.length > 0 ) {
        obj = {
            Nombre_usuario     : data[0].nombre_usuario,
            Responsable        : data[0].responsable,
            isUserFound        : true,
            Empresa            : data[0].Empresa,
            Sucursal           : data[0].Sucursal,
            Asig_Contratos     : data[0].Asig_Contratos,
            Clientes_Flotillas : data[0].Clientes_Flotillas,
            OrdenDeCompra_F    : data[0].OrdenDeCompra_F,
            DatosDPP           : data[0].DatosDPP
        }
    }
    return obj;
}