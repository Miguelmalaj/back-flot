export const querys = {
    getClientes: `SELECT Id, RFC, Razon_social, Nombre_corto, Num_cliente, Ubicacion FROM [Indicadores].[dbo].[Clientes_flotillas] 
    WHERE Empresa=@Empresa AND Sucursal=@Sucursal`,
    
    login: `SELECT * FROM [Indicadores].[dbo].[usuarios] 
    WHERE nombre_usuario = @Nombre AND Empresa = @Empresa AND Sucursal = @Sucursal`,
    
    loginDMS: `SELECT Usuario, Nombre, Clave FROM [Indicadores].[dbo].[UsuariosDMS] 
    WHERE Usuario = @Nombre AND Empresa = @Empresa AND Sucursal = @Sucursal`,

    createClientes: `INSERT INTO [Indicadores].[dbo].[Clientes_flotillas] (
        Empresa,
        Sucursal,
        RFC,
        Razon_social,
        Nombre_corto,
        Num_cliente,
        Ubicacion
        ) VALUES (
        @Empresa,            
        @Sucursal,
        @RFC,
        @Razon_social,
        @Nombre_corto,
        @Num_cliente,
        @Ubicacion            
        )`,

    updateClientes: `UPDATE [Indicadores].[dbo].[Clientes_flotillas]
        SET 
        RFC = @RFC,
        Razon_social = @Razon_social,        
        Nombre_corto = @Nombre_corto,
        Num_cliente = @Num_cliente,
        Ubicacion = @Ubicacion
        WHERE
        Id = @Id
        `,

    /* getFoliosLotes: `SELECT Folio_lote = isnull( MAX( Folio_lote ) + 1 ,0 + 1 ) 
    FROM [Indicadores].[dbo].[Asignacion_lotes] 
    WHERE Empresa = @Empresa AND Sucursal = @Sucursal`, */

    getNombresLotes: `SELECT DISTINCT Nombre_lote, Referencia 
    FROM [Indicadores].[dbo].[Asignacion_lotes] 
    WHERE Empresa = @Empresa AND Sucursal = @Sucursal`,

    /* createNewLote: `INSERT INTO [Indicadores].[dbo].[Asignacion_lotes] (
        Empresa,
        Sucursal,
        Folio_lote,
        Fecha_elaboracion,
        Nombre_cliente,
        Nombre_lote,
        VIN,
        Numero_factura,
        Precio_factura,
        Orden_compra,
        Ubicacion_cliente,
        Marca,
        Unidad,
        NumCliente

        ) VALUES (
        @Empresa,                    
        @Sucursal,        
        @Folio_lote,        
        @Fecha_elaboracion,        
        @Nombre_cliente,        
        @Nombre_lote,        
        @VIN,        
        @Numero_factura,            
        @Precio_factura,
        @Orden_compra,
        @Ubicacion_cliente,
        @Marca,
        @Unidad,
        @NumCliente
            
        )`, */

   /*  getNombresLotesCliente: `SELECT DISTINCT Nombre_lote, Folio_lote, Fecha_elaboracion, NumCliente 
    FROM [Indicadores].[dbo].[Asignacion_lotes] 
    WHERE 
    Empresa = @Empresa 
    AND Sucursal = @Sucursal 
    AND Nombre_cliente = @Nombre_cliente
    AND Referencia = @Referencia
    AND Ubicacion_cliente = @Ubicacion_cliente
    AND numCliente = @numCliente
    ORDER BY Folio_lote DESC`, */
    
    /* getNombresLotesClienteFolioCompra: `SELECT DISTINCT Nombre_lote, Folio_lote, Fecha_elaboracion, NumCliente 
    FROM [Indicadores].[dbo].[Asignacion_lotes] 
    WHERE 
    Empresa = @Empresa 
    AND Sucursal = @Sucursal 
    AND Nombre_cliente = @Nombre_cliente
    AND Referencia != @Referencia
    AND (Folio_compra_contrato = @Folio_compra_contrato OR Monto_plan_piso = @Monto_plan_piso)
    AND Ubicacion_cliente = @Ubicacion_cliente
    AND numCliente = @numCliente
    ORDER BY Folio_lote DESC`, */
    
    getNombresLotesClienteResumen: `SELECT DISTINCT Nombre_lote, Folio_lote, Fecha_elaboracion, NumCliente 
    FROM [Indicadores].[dbo].[Asignacion_lotes] 
    WHERE 
    Empresa = @Empresa 
    AND Sucursal = @Sucursal 
    AND Nombre_cliente = @Nombre_cliente
    AND Referencia != @Referencia
    AND Folio_compra_contrato != @Folio_compra_contrato
    AND Ubicacion_cliente = @Ubicacion_cliente
    AND numCliente = @numCliente
    ORDER BY Folio_lote DESC`,

    /* getLoteCliente:`SELECT
    Folio_lote, 
    Nombre_cliente, Nombre_lote, VIN, 
    Numero_factura, Precio_factura, Orden_compra, 
    Monto_total, Ubicacion_cliente, Marca, Unidad, NumCliente
    FROM [Indicadores].[dbo].[Asignacion_lotes] 
    WHERE 
    Folio_lote = @Folio_lote 
    AND Empresa = @Empresa 
    AND Sucursal = @Sucursal
    AND NumCliente = @NumCliente`, */
    
    /* getLoteClienteReferencia:`SELECT
    Folio_lote, 
    Nombre_cliente, Nombre_lote, VIN, 
    Numero_factura, Precio_factura, Orden_compra, 
    Referencia, Ubicacion_cliente, Marca, Unidad, NumCliente
    FROM [Indicadores].[dbo].[Asignacion_lotes] 
    WHERE 
    Folio_lote = @Folio_lote 
    AND Empresa = @Empresa 
    AND Sucursal = @Sucursal
    AND NumCliente = @NumCliente`, */

    /* getLoteClienteFolioCompra:`SELECT
    Folio_lote, Fecha_elaboracion,
    Nombre_cliente, Nombre_lote, VIN, 
    Numero_factura, Precio_factura, Orden_compra, 
    Referencia, Folio_compra_contrato, Fecha_compra_contrato,
    Monto_plan_piso, Monto_deposito_cuenta_cheques,
    Tasa_porcentaje_enganche, Monto_total,
    Ubicacion_cliente, Marca, Unidad, NumCliente,
    Inversion_inicial
    FROM [Indicadores].[dbo].[Asignacion_lotes] 
    WHERE 
    Folio_lote = @Folio_lote 
    AND Empresa = @Empresa 
    AND Sucursal = @Sucursal
    AND NumCliente = @NumCliente`, */
    
    getLoteClienteResumen:`SELECT
    Folio_lote, Fecha_elaboracion,
    Nombre_cliente, Nombre_lote, VIN, 
    Numero_factura, Precio_factura, Orden_compra, 
    Referencia, Folio_compra_contrato, Fecha_compra_contrato,
    Monto_plan_piso, Monto_deposito_cuenta_cheques,
    Tasa_porcentaje_enganche, Monto_total,
    Ubicacion_cliente, Marca, Unidad, NumCliente,
    Inversion_inicial
    FROM [Indicadores].[dbo].[Asignacion_lotes] 
    WHERE 
    Folio_lote = @Folio_lote 
    AND Empresa = @Empresa 
    AND Sucursal = @Sucursal
    AND NumCliente = @NumCliente`,

    /* getVINSRegistered: `SELECT VIN FROM [Indicadores].[dbo].[Asignacion_lotes] 
    WHERE 
    Nombre_cliente = @Nombre_cliente 
    AND Ubicacion_cliente = @Ubicacion_cliente
    AND Empresa = @Empresa 
    AND Sucursal = @Sucursal`, */

    /* addVINLote: `INSERT INTO [Indicadores].[dbo].[Asignacion_lotes] (
        Empresa,
        Sucursal,
        Folio_lote,
        Fecha_elaboracion,
        Nombre_cliente,
        Nombre_lote,
        VIN,
        Numero_factura,
        Precio_factura,
        Orden_compra,
        Ubicacion_cliente,
        Marca,
        Unidad,
        NumCliente

        ) VALUES (
        @Empresa,                    
        @Sucursal,        
        @Folio_lote,        
        @Fecha_elaboracion,        
        @Nombre_cliente,        
        @Nombre_lote,        
        @VIN,        
        @Numero_factura,            
        @Precio_factura,
        @Orden_compra,
        @Ubicacion_cliente,
        @Marca,
        @Unidad,
        @NumCliente
            
        )`, */

    existVINInLote: `SELECT valor= CASE WHEN EXISTS (
        SELECT VIN
        FROM [Indicadores].[dbo].[Asignacion_lotes]
        WHERE VIN = @VIN AND Empresa=@Empresa and Sucursal=@Sucursal
        )
        THEN CAST(1 AS BIT)
        ELSE CAST(0 AS BIT) END`,

    getVinsClienteLoteYDisponibles:`SELECT  
    -- Descripcion, Cliente, Factura, Venta, Vin, NumCliente 
     Vehiculo, NombreCliente, Factura, 
     Venta=( select Venta FROM [Indicadores].[dbo].[VentasFlotillas] as f1 WHERE v1.Empresa=f1.Empresa AND v1.Sucursal=f1.Sucursal AND v1.Vin=f1.VIN), 
     VIN, Cliente, OrdenDeCompra as Orden_compra 
     FROM [Indicadores].[dbo].[AsignacionVins_OrdenDeCompra] as v1 
     where Empresa = @Empresa and Sucursal = @Sucursal and Cliente = @NumCliente and
         
     (
         (select count(VIN) FROM [Indicadores].[dbo].[Asignacion_lotes] as v2 
         where v1.Empresa=v2.Empresa and v1.Sucursal=v2.Sucursal and v1.VIN = v2.VIN) = 0 
         or
         (select count(VIN) FROM [Indicadores].[dbo].[Asignacion_lotes] as v3 
         where v1.Empresa=v3.Empresa and v1.Sucursal=v3.Sucursal and v1.VIN = v3.VIN and v3.Folio_lote = @Folio_lote ) > 0
     )`,
    /* getVinsClienteLoteYDisponibles:`SELECT  
        Descripcion, Cliente, Factura, Venta, Vin, NumCliente 
        FROM [Indicadores].[dbo].[VentasFlotillas] as v1 
        where Empresa = @Empresa and Sucursal = @Sucursal and NumCliente = @NumCliente and
            
        (
            (select count(VIN) FROM [Indicadores].[dbo].[Asignacion_lotes] as v2 
            where v1.Empresa=v2.Empresa and v1.Sucursal=v2.Sucursal and v1.Vin = v2.VIN) = 0 
            or
            (select count(VIN) FROM [Indicadores].[dbo].[Asignacion_lotes] as v3 
            where v1.Empresa=v3.Empresa and v1.Sucursal=v3.Sucursal and v1.VIN = v3.VIN and v3.Folio_lote = @Folio_lote ) > 0
        )`, */
    
    /* getVinsClienteDisponibles: `SELECT  
        --Descripcion, Factura, Venta, Vin, NumCliente 
        Vehiculo, NombreCliente, Factura, 
        Venta=( select Venta FROM [Indicadores].[dbo].[VentasFlotillas] as f1 WHERE v1.Empresa=f1.Empresa AND v1.Sucursal=f1.Sucursal AND v1.Vin=f1.VIN), 
        VIN, Cliente, OrdenDeCompra as Orden_compra 
        FROM [Indicadores].[dbo].[AsignacionVins_OrdenDeCompra] as v1 
        where Empresa = @Empresa 
        and Sucursal = @Sucursal
        and Cliente = @NumCliente
        and (select count(VIN) FROM [Indicadores].[dbo].[Asignacion_lotes] as v2 
            where v1.Empresa=v2.Empresa and v1.Sucursal=v2.Sucursal and v1.VIN = v2.VIN) = 0 
        
    `, */

    /* deleteLote: `DELETE FROM [Indicadores].[dbo].[Asignacion_lotes] 
        WHERE 
        Empresa=@Empresa 
        AND Sucursal=@Sucursal
        AND Folio_lote=@Folio_lote`, */

    // getRegistrosTablaVentasFlotillasDMS: `SELECT * FROM [Indicadores].[dbo].[VentasFlotillasDMS] where Empresa=@Empresa AND Sucursal=@Sucursal`,

    /* isVINInTable: `SELECT valor= CASE WHEN EXISTS (
        SELECT VIN
        FROM [Indicadores].[dbo].[VentasFlotillas]
        WHERE Vin = @Vin AND Empresa=@Empresa and Sucursal=@Sucursal
        )
        THEN CAST(1 AS BIT)
        ELSE CAST(0 AS BIT) END`, */
        
    /* insertVINtoTable: `INSERT INTO [Indicadores].[dbo].[VentasFlotillas] (
        Empresa,
        Sucursal,
        FechaVenta,
        Inventario,
        Descripcion,
        Vin,
        Factura,
        Vendedor,
        NumCliente,
        Cliente,
        Venta,
        Costo

        ) VALUES (
        @Empresa,                    
        @Sucursal,        
        @FechaVenta,        
        @Inventario,        
        @Descripcion,        
        @Vin,        
        @Factura,        
        @Vendedor,            
        @NumCliente,
        @Cliente,
        @Venta,
        @Costo
            
        )`, */

    /* updateReferenciaLoteCliente:`UPDATE [Indicadores].[dbo].[Asignacion_lotes]
        SET
        Referencia=@Referencia
        WHERE Empresa=@Empresa AND
              Sucursal=@Sucursal AND
              Folio_lote=@Folio_lote AND
              VIN=@VIN`, */
    
    /* updateFolioDeCompraLoteCliente:`UPDATE [Indicadores].[dbo].[Asignacion_lotes]
        SET
        Folio_compra_contrato=@Folio_compra_contrato,
        Fecha_compra_contrato=@Fecha_compra_contrato,
        Monto_plan_piso=@Monto_plan_piso,
        Monto_deposito_cuenta_cheques=@Monto_deposito_cuenta_cheques,
        Tasa_porcentaje_enganche=@Tasa_porcentaje_enganche,
        Monto_total=@Monto_total,
        Inversion_inicial=@Inversion_inicial

        WHERE Empresa=@Empresa AND
              Sucursal=@Sucursal AND
              Folio_lote=@Folio_lote AND
              VIN=@VIN`, */

    addTipoVehiculo:`INSERT INTO [Indicadores].[dbo].[Tipo_Vehiculos] (
        Empresa,
        Sucursal,
        NombreTipo,
        PaqueteTipo,
        Descripcion

        ) VALUES (
        @Empresa,                    
        @Sucursal,        
        @NombreTipo,        
        @PaqueteTipo,        
        @Descripcion

        )`,
    
    getTipoVehiculos:`SELECT DISTINCT Descripcion FROM [Indicadores].[dbo].[Tipo_Vehiculos]`,

    insertBinaryFile:`INSERT INTO [Indicadores].[dbo].[Logistica_ordenCompra] (
        Empresa,
        Sucursal,
        Cliente,
        Ubicacion,
        OrdenCompra,
        Cantidad,
        TipoVehiculo,
        Existencia,
        DocumentoPDF

        ) VALUES (
        @Empresa,                    
        @Sucursal,
        @Cliente,        
        @Ubicacion,
        @OrdenCompra,        
        @Cantidad,        
        @TipoVehiculo,
        @Existencia,
        @DocumentoPDF

        )`,

    insertBinaryFilePDFnull:`INSERT INTO [Indicadores].[dbo].[Logistica_ordenCompra] (
        Empresa,
        Sucursal,
        Cliente,
        Ubicacion,
        OrdenCompra,
        Cantidad,
        TipoVehiculo,
        Existencia

        ) VALUES (
        @Empresa,                    
        @Sucursal,
        @Cliente,        
        @Ubicacion,
        @OrdenCompra,        
        @Cantidad,        
        @TipoVehiculo,
        @Existencia

        )`,

    getOrdenDeCompra:`SELECT 
        Id,
        Empresa,
        Sucursal,
        Cliente,
        Ubicacion,
        OrdenCompra,
        Cantidad,
        TipoVehiculo,
        Existencia,
        DocumentoPDF= ( CASE WHEN pri.DocumentoPDF <> '' THEN '1' ELSE '' END ) 
    FROM [Indicadores].[dbo].[Logistica_ordenCompra] as pri
    WHERE 
        
        Empresa = @Empresa 
        AND Sucursal = @Sucursal ORDER BY Id DESC`,

    getDocumentPDFById: `SELECT DocumentoPDF FROM [Indicadores].[dbo].[Logistica_ordenCompra] 
        WHERE 
        Empresa = @Empresa 
        AND Sucursal = @Sucursal 
        AND Id=@Id`,

    updateOrderWithoutPDF:`UPDATE [Indicadores].[dbo].[Logistica_ordenCompra]
    SET 
    Cliente = @Cliente,
    Ubicacion = @Ubicacion,
    OrdenCompra = @OrdenCompra,
    Cantidad = @Cantidad,
    TipoVehiculo = @TipoVehiculo,
    Existencia = @Existencia
    WHERE
    Id = @Id`,

    updateOrderWithPDF:`UPDATE [Indicadores].[dbo].[Logistica_ordenCompra]
    SET 
    Cliente = @Cliente,
    Ubicacion = @Ubicacion,
    OrdenCompra = @OrdenCompra,
    Cantidad = @Cantidad,
    TipoVehiculo = @TipoVehiculo,
    Existencia = @Existencia,
    DocumentoPDF = @DocumentoPDF
    WHERE
    Id = @Id`,

    getVINSCliente_PermisoDesvio:`SELECT Inventario, Vin FROM [Indicadores].[dbo].[VentasFlotillasDMS]
	WHERE NumCliente=@NumCliente`,

    existVINInLogisticaVINS: `SELECT valor= CASE WHEN EXISTS (
        SELECT VIN
        FROM [Indicadores].[dbo].[Logistica_VINS]
        WHERE 
            VIN = @VIN AND 
            FolioDesvio=@FolioDesvio AND 
            Cancelado='N' AND 
            Empresa=@Empresa AND 
            Sucursal=@Sucursal
        )
        THEN CAST(1 AS BIT)
        ELSE CAST(0 AS BIT) END`,
    /* existVINInLogisticaVINS: `SELECT valor= CASE WHEN EXISTS (
        SELECT VIN
        FROM [Indicadores].[dbo].[Logistica_VINS]
        WHERE 
            VIN = @VIN AND 
            FolioDesvio=@FolioDesvio AND 
            Empresa=@Empresa AND 
            Sucursal=@Sucursal
        )
        THEN CAST(1 AS BIT)
        ELSE CAST(0 AS BIT) END`, */

    existsFolioDesvio_PermisoDesvio:`SELECT valor= CASE WHEN EXISTS (
        SELECT FolioDesvio
        FROM [Indicadores].[dbo].[Permiso_desvio]
        WHERE 
        PermisoDesvio = @PermisoDesvio AND 
        FolioDesvio=@FolioDesvio AND 
        Empresa=@Empresa AND 
        Sucursal=@Sucursal
        )
        THEN CAST(1 AS BIT)
        ELSE CAST(0 AS BIT) END`,

    createVIN_LogisticaVINS:`INSERT INTO [Indicadores].[dbo].[Logistica_VINS] (
        Empresa,
        Sucursal,
        Cliente,
        VIN,
        FolioDesvio,
        FechaVencimientoDPP1,
        FolioDPP,
        FechaVencimiento

        ) VALUES (
        @Empresa,                    
        @Sucursal,
        @Cliente,        
        @VIN,
        @FolioDesvio,
        @FechaVencimientoDPP1,        
        @FolioDPP,
        @FechaVencimiento        

        )`,

    updateVIN_LogisticaVINS:`UPDATE [Indicadores].[dbo].[Logistica_VINS]
    SET 
    Cliente = @Cliente,
    VIN = @VIN,
    FolioDesvio = @FolioDesvio
    WHERE
    Empresa=@Empresa AND 
    Sucursal=@Sucursal AND 
    FolioDesvio=@FolioDesvio AND
    Cancelado='N'
    `,

    createPermisoDesvio:`INSERT INTO [Indicadores].[dbo].[Permiso_desvio] (
        Empresa,
        Sucursal,
        PermisoDesvio,
        FolioDesvio,
        FechaSalida,
        FechaLlegada,
        FechaEntrega,
        FolioDPP,
        FechaVencimiento,
        FechaVencimientoFase2,
        FechaSolicitudFase2,
        Cliente,
        FechaVencimientoDPP1


        ) VALUES (
        @Empresa,                    
        @Sucursal,
        @PermisoDesvio,        
        @FolioDesvio,
        @FechaSalida,        
        @FechaLlegada,        
        @FechaEntrega,
        @FolioDPP,
        @FechaVencimiento,
        @FechaVencimientoFase2,
        @FechaSolicitudFase2,
        @Cliente,
        @FechaVencimientoDPP1


        )`,

    getFoliosDesvioByCliente:`SELECT DISTINCT 
    FolioDesvio, FolioDPP, PermisoDesvio, Cliente 
    FROM [Indicadores].[dbo].[Logistica_VINS]
    WHERE 
    Empresa = @Empresa AND
    Sucursal = @Sucursal AND 
    Cliente = @Cliente AND 
    PermisoDesvio=@PermisoDesvio AND 
    Cancelado = 'N'
    `,
   /*  getFoliosDesvioByCliente:`SELECT 
	    p.FolioDesvio,
        p.FolioDPP,
	    p.PermisoDesvio,
	    p.Cliente
        FROM  Permiso_desvio as p
        WHERE p.Empresa = @Empresa AND
          p.Sucursal = @Sucursal AND 
          p.Cliente = @Cliente AND 
          p.PermisoDesvio=@PermisoDesvio AND 
          p.Cancelado = 'N' 
          `,
 */

    getFoliosDesvioByClienteResumen:`SELECT DISTINCT 
    FolioDesvio, FolioDPP, PermisoDesvio, Cliente 
    FROM [Indicadores].[dbo].[Logistica_VINS]
    WHERE 
    Empresa = @Empresa AND
    Sucursal = @Sucursal AND 
    Cliente = @Cliente AND 
    PermisoDesvio=@PermisoDesvio AND 
    Cancelado = 'N'
          `,
    /* getFoliosDesvioByClienteResumen:`SELECT 
	    p.FolioDesvio,
        p.FolioDPP,
	    p.PermisoDesvio,
	    p.Cliente
        FROM  Permiso_desvio as p
        WHERE p.Empresa = @Empresa AND
          p.Sucursal = @Sucursal AND 
          p.Cliente = @Cliente AND 
          p.PermisoDesvio=@PermisoDesvio AND 
          p.Cancelado = 'N'
          `, */

    getFoliosDesvioDPPYContByCliente:`SELECT DISTINCT 
    FolioDesvio, FolioDPP, PermisoDesvio, Cliente
    FROM [Indicadores].[dbo].[Logistica_VINS]
    WHERE 
      Empresa = @Empresa AND
      Sucursal = @Sucursal AND 
      Cliente = @Cliente AND 
      Cancelado = 'N' 
      `,

    getFoliosDesvioByClienteCancel:`SELECT DISTINCT 
    FolioDesvio, FolioDPP, PermisoDesvio, Cliente 
    FROM [Indicadores].[dbo].[Logistica_VINS]
    WHERE 
    Empresa = @Empresa AND
    Sucursal = @Sucursal AND 
    Cliente = @Cliente AND 
    PermisoDesvio=@PermisoDesvio AND 
    Cancelado = 'N'
    `,
    /* getFoliosDesvioByClienteCancel:`SELECT 
	    p.FolioDesvio,
        p.FolioDPP,
	    p.PermisoDesvio,
	    p.Cliente
        FROM  Permiso_desvio as p
        WHERE p.Empresa = @Empresa AND
          p.Sucursal = @Sucursal AND 
          p.Cliente = @Cliente AND 
          p.PermisoDesvio=@PermisoDesvio AND 
          p.Cancelado = 'N'
          `, */

    //query para DPPS.
    getVinsToDPPS:`SELECT 
	l.VIN,
	l.FolioDesvio,
	p.PermisoDesvio,
	l.FechaVencimiento,
	l.FolioDPP, 
	l.FechaSolicitudFase2,
	l.FechaVencimientoFase2,
	
	l.FechaVencimientoDPP1
    
    FROM Logistica_VINS as l 
    LEFT JOIN Permiso_desvio as p
    ON p.Empresa=l.Empresa AND p.Sucursal=l.Sucursal AND p.FolioDesvio = l.FolioDesvio AND p.Cancelado = 'N'
    WHERE 
    l.Empresa       = @Empresa AND 
    l.Sucursal      = @Sucursal AND 
    l.Cliente       = @Cliente AND
    l.Cancelado     = 'N' AND
    l.FolioDesvio   = @FolioDesvio`,

    //query para Extensión permiso o contado.
    getVinsToExtensionPermiso:`SELECT 
	l.VIN,
	l.FolioDesvio,
	p.PermisoDesvio,
	l.FechaVencimiento
    FROM Logistica_VINS as l 
    LEFT JOIN Permiso_desvio as p
    ON p.Empresa=l.Empresa AND p.Sucursal=l.Sucursal AND p.FolioDesvio = l.FolioDesvio AND p.Cancelado = 'N'
    
    WHERE 
    l.Empresa       = @Empresa AND 
    l.Sucursal      = @Sucursal AND 
    l.Cliente       = @Cliente AND 
    p.PermisoDesvio = @PermisoDesvio AND 
    l.FolioDesvio   = @FolioDesvio AND
    l.Cancelado     = 'N'  
    `,

    addDPPFase2LogisticaVINS:`UPDATE [Indicadores].[dbo].[Logistica_VINS]
    SET 
    FechaVencimientoFase2 = @FechaVencimientoFase2,
    FechaSolicitudFase2 = @FechaSolicitudFase2,
    FolioDPP = @FolioDPP
    WHERE
    Empresa=@Empresa AND 
    Sucursal=@Sucursal AND 
    VIN=@VIN AND
    FolioDesvio=@FolioDesvio AND
    Cancelado='N'`,

    addDPPFase2PermisoDesvio:`UPDATE [Indicadores].[dbo].[Permiso_desvio]
    SET 
    FechaVencimientoFase2 = @FechaVencimientoFase2,
    FechaSolicitudFase2 = @FechaSolicitudFase2,
    FolioDPP = @FolioDPP
    WHERE
    Empresa=@Empresa AND 
    Sucursal=@Sucursal AND 
    FolioDesvio=@FolioDesvio AND
    Cancelado='N'`,

    addExtPermisoPDFNull:`INSERT INTO [Indicadores].[dbo].[Extension_permiso] (
        Empresa,
        Sucursal,
        VIN,
        FolioDesvio,
        FechaSolicitudExtP,
        FechaVencimientoExtP

        ) VALUES (
        @Empresa,
        @Sucursal,
        @VIN,
        @FolioDesvio,
        @FechaSolicitudExtP,
        @FechaVencimientoExtP                    
        )`,
    addExtPermiso:`INSERT INTO [Indicadores].[dbo].[Extension_permiso] (
        Empresa,
        Sucursal,
        VIN,
        FolioDesvio,
        FechaSolicitudExtP,
        FechaVencimientoExtP,
        DocumentoAdjunto

        ) VALUES (
        @Empresa,
        @Sucursal,
        @VIN,
        @FolioDesvio,
        @FechaSolicitudExtP,
        @FechaVencimientoExtP,
        @DocumentoAdjunto                    
        )`,

        getExtensionsDateByVIN: `SELECT 
        Id, 
        FechaSolicitudExtP, 
        FechaVencimientoExtP,
        DocumentoAdjunto= ( CASE WHEN DocumentoAdjunto <> '' THEN '1' ELSE '' END )  
        FROM [Indicadores].[dbo].[Extension_permiso]
        WHERE 
        Empresa=@Empresa AND 
        Sucursal=@Sucursal AND 
        VIN=@VIN AND 
        FolioDesvio=@FolioDesvio
        `,

        getPDFExtensionPermById: `SELECT DocumentoAdjunto FROM [Indicadores].[dbo].[Extension_permiso] 
        WHERE 
        Empresa = @Empresa 
        AND Sucursal = @Sucursal 
        AND Id=@Id`,

        existsVINWithOutCancel:`SELECT * FROM [Indicadores].[dbo].[Logistica_VINS] 
        WHERE  
        Empresa=@Empresa AND 
        Sucursal=@Sucursal AND 
        FolioDesvio=@FolioDesvio AND 
        Cancelado='N'`,

        existsVINSWithOutFolioDPP2:`
        SELECT * FROM [Indicadores].[dbo].[Logistica_VINS] 
        WHERE  
        Empresa=@Empresa AND 
        Sucursal=@Sucursal AND 
        FolioDesvio=@FolioDesvio AND 
        
        FechaSolicitudFase2 IS NULL AND 
        FechaVencimientoFase2 IS NULL AND 
        Cancelado='N'
        `,

        UpdateTablaPermisoDesvioByFolio_DPP:`UPDATE [Indicadores].[dbo].[Permiso_desvio]
        SET 
        FechaSalida = @FechaSalida,
        FechaLlegada = @FechaLlegada,
        FechaEntrega = @FechaEntrega,
        FechaVencimiento = @FechaVencimiento,
        FolioDPP = @FolioDPP
        
        WHERE
        Empresa=@Empresa AND 
        Sucursal=@Sucursal AND 
        FolioDesvio=@FolioDesvio AND
        Cancelado='N'`,

        UpdateTablaPermisoDesvioByFolio_Contado:`UPDATE [Indicadores].[dbo].[Permiso_desvio]
        SET 
        FechaSalida = @FechaSalida,
        FechaLlegada = @FechaLlegada,
        FechaEntrega = @FechaEntrega,
        FechaVencimiento = @FechaVencimiento
        
        WHERE
        Empresa=@Empresa AND 
        Sucursal=@Sucursal AND 
        FolioDesvio=@FolioDesvio AND
        Cancelado='N'`,

        DPPYContadoFolioDesvioTodos:`SELECT
        l.VIN,
        l.FolioDesvio,
        
        l.FechaVencimientoDPP1,
        p.PermisoDesvio,
        l.FechaVencimiento,
        l.FolioDPP,
        l.FechaSolicitudFase2,
        l.FechaVencimientoFase2,
        numExtensiones=( SELECT COUNT(FolioDesvio) FROM [Indicadores].[dbo].[Extension_permiso] as e WHERE l.Empresa = e.Empresa AND l.Sucursal = e.Sucursal AND l.FolioDesvio = e.FolioDesvio )
        FROM Logistica_VINS as l 
        LEFT JOIN Permiso_desvio as p
        ON p.Empresa=l.Empresa AND p.Sucursal=l.Sucursal AND p.FolioDesvio = l.FolioDesvio AND p.Cancelado = 'N'
        
        WHERE 
        l.Empresa       = @Empresa  AND 
        l.Sucursal      = @Sucursal AND 
        l.Cliente       = @Cliente  AND 
        p.PermisoDesvio in ('DPP', 'Contado') AND 
        l.Cancelado     = 'N'`,

        DPPYContadoFolioDesvioUnico:`SELECT
        l.VIN,
        l.FolioDesvio,
        
        l.FechaVencimientoDPP1,
        p.PermisoDesvio,
        l.FechaVencimiento,
        l.FolioDPP,
        l.FechaSolicitudFase2,
        l.FechaVencimientoFase2,
        numExtensiones=( SELECT COUNT(FolioDesvio) FROM [Indicadores].[dbo].[Extension_permiso] as e WHERE l.Empresa = e.Empresa AND l.Sucursal = e.Sucursal AND l.FolioDesvio = e.FolioDesvio )
        FROM Logistica_VINS as l 
        LEFT JOIN Permiso_desvio as p
        ON p.Empresa=l.Empresa AND p.Sucursal=l.Sucursal AND p.FolioDesvio = l.FolioDesvio AND p.Cancelado = 'N'
        
        WHERE 
        l.Empresa       = @Empresa  AND 
        l.Sucursal      = @Sucursal AND 
        l.Cliente       = @Cliente  AND 
        p.PermisoDesvio in ('DPP', 'Contado') AND 
        l.FolioDesvio   = @FolioDesvio AND
        l.Cancelado     = 'N'`,

        ContExtOrDPPF1F2FolioDesvioTodos:`SELECT
        l.VIN,
        l.FolioDesvio,
        
        l.FechaVencimientoDPP1,
        p.PermisoDesvio,
        l.FechaVencimiento,
        l.FolioDPP,
        l.FechaSolicitudFase2,
        l.FechaVencimientoFase2,
        numExtensiones=( SELECT COUNT(FolioDesvio) FROM [Indicadores].[dbo].[Extension_permiso] as e WHERE l.Empresa = e.Empresa AND l.Sucursal = e.Sucursal AND l.FolioDesvio = e.FolioDesvio )
        FROM Logistica_VINS as l 
        LEFT JOIN Permiso_desvio as p
        ON p.Empresa=l.Empresa AND p.Sucursal=l.Sucursal AND p.FolioDesvio = l.FolioDesvio AND p.Cancelado = 'N'
        
        WHERE 
        l.Empresa       = @Empresa       AND 
        l.Sucursal      = @Sucursal      AND 
        l.Cliente       = @Cliente       AND 
        p.PermisoDesvio = @PermisoDesvio AND 
        l.Cancelado     = 'N'`,
        
        ContExtOrDPPF1F2FolioDesvioUnico:`SELECT
        l.VIN,
        l.FolioDesvio,
        
        l.FechaVencimientoDPP1,
        p.PermisoDesvio,
        l.FechaVencimiento,
        l.FolioDPP,
        l.FechaSolicitudFase2,
        l.FechaVencimientoFase2,
        numExtensiones=( SELECT COUNT(FolioDesvio) FROM [Indicadores].[dbo].[Extension_permiso] as e WHERE l.Empresa = e.Empresa AND l.Sucursal = e.Sucursal AND l.FolioDesvio = e.FolioDesvio )
        FROM Logistica_VINS as l 
        LEFT JOIN Permiso_desvio as p
        ON p.Empresa=l.Empresa AND p.Sucursal=l.Sucursal AND p.FolioDesvio = l.FolioDesvio AND p.Cancelado = 'N'
        
        WHERE 
        l.Empresa       = @Empresa AND 
        l.Sucursal      = @Sucursal AND 
        l.Cliente       = @Cliente AND 
        p.PermisoDesvio = @PermisoDesvio AND 
        l.FolioDesvio   = @FolioDesvio AND
        l.Cancelado     = 'N'`,

        spf_logisticaVinsToStatus_leer:`
        SELECT 
        VIN,
        Vehiculo,
        OrdenDeCompra,
        FechaSolicitudGPS,
        FechaAceptacionGPS,
        EstatusGPS,
        EstatusPrevia,
        EstatusTyT = isnull((SELECT nombreEstatus FROM [Indicadores].[dbo].[EstatusTyT] as s WHERE s.clave =  f.EstatusTyT ),0),
        FechaEntregaCliente,
        FechaDeEnvioDocum,
        FechaDeRecepcion,
        Observaciones,
        DocumentoPDF= ( CASE WHEN f.CartaClientePDF <> '' THEN '1' ELSE '' END ) 

        FROM [Indicadores].[dbo].[AsignacionVins_OrdenDeCompra] as f
        WHERE Empresa=@Empresa AND Sucursal=@Sucursal AND Cliente=@Cliente AND ( (EstatusTyT <> 5) OR (( CASE WHEN f.CartaClientePDF <> '' THEN '1' ELSE '' END ) <> '1') )
            AND OrdenDeCompra=@OrdenDeCompra
        `

}