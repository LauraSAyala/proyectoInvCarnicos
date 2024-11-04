const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    user: 'postgres',         // Cambia esto por tu usuario de PostgreSQL
    host: 'localhost',        // Cambia si tu base de datos está en otro host
    database: 'BDproductosCarnicos',  // Cambia por el nombre de tu base de datos
    password: 'Isaias41:10',  // Cambia por tu contraseña
    port: 5432,
});

// Verificar conexión a la base de datos
pool.connect((err) => {
    if (err) {
        return console.error('Error al conectar a la base de datos', err.stack);
    }
    console.log('Conectado a la base de datos PostgreSQL');
});

//CLIENTE
// Ruta para obtener todos los clientes
app.get('/clientes', async (req, res) => {
    try {
        const result = await pool.query('SELECT idCliente, nombreCliente FROM cliente');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener los clientes', err.stack);
        res.status(500).send('Error al obtener los clientes');
    }
});

// Ruta para insertar un nuevo cliente
app.post('/clientes', async (req, res) => {
    const { nombreCliente } = req.body;
    try {
        const result = await pool.query('INSERT INTO cliente (nombreCliente) VALUES ($1) RETURNING *', [nombreCliente]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al insertar cliente', err.stack);
        res.status(500).send('Error al insertar cliente');
    }
});

// Ruta para actualizar un cliente
app.put('/clientes/:id', async (req, res) => {
    const idCliente = req.params.id;
    const { nombreCliente } = req.body;

    try {
        const result = await pool.query(
            'UPDATE cliente SET nombreCliente = $1 WHERE idCliente = $2 RETURNING *',
            [nombreCliente, idCliente]
        );

        if (result.rows.length === 0) {
            return res.status(404).send('Cliente no encontrado');
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al actualizar el cliente', err.stack);
        res.status(500).send('Error al actualizar el cliente');
    }
});

// Ruta para eliminar un cliente
app.delete('/clientes/:id', async (req, res) => {
    const idCliente = req.params.id;
    try {
        const result = await pool.query('DELETE FROM cliente WHERE idCliente = $1', [idCliente]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.status(200).json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar cliente', error);
        res.status(500).json({ error: 'Error en el servidor al eliminar cliente' });
    }
});


//PROVEEDORES 

// Ruta para obtener todos los proveedores
app.get('/proveedores', async (req, res) => {
    try {
        const result = await pool.query('SELECT idProveedor, nombreProveedor FROM proveedor');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener proveedores', err.stack);
        res.status(500).send('Error al obtener proveedores');
    }
});

// Ruta para crear un nuevo proveedor
app.post('/proveedores', async (req, res) => {
    const { nombreProveedor } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO proveedor (nombreProveedor) VALUES ($1) RETURNING *',
            [nombreProveedor]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al crear proveedor', err.stack);
        res.status(500).send('Error al crear proveedor');
    }
});

// Ruta para actualizar un proveedor
app.put('/proveedores/:id', async (req, res) => {
    const idProveedor = req.params.id;
    const { nombreProveedor } = req.body;
    try {
        const result = await pool.query(
            'UPDATE proveedor SET nombreProveedor = $1 WHERE idProveedor = $2 RETURNING *',
            [nombreProveedor, idProveedor]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Proveedor no encontrado');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al actualizar proveedor', err.stack);
        res.status(500).send('Error al actualizar proveedor');
    }
});

// Ruta para eliminar un proveedor
app.delete('/proveedores/:id', async (req, res) => {
    const idProveedor = req.params.id;
    try {
        const result = await pool.query('DELETE FROM proveedor WHERE idProveedor = $1', [idProveedor]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        res.status(200).json({ message: 'Proveedor eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar proveedor', err.stack);
        res.status(500).json({ error: 'Error al eliminar proveedor' });
    }
});

//COMPRA


// Ruta para obtener todas las compras
app.get('/compras', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                c.idcompra, 
                c.fechacompra, 
                p.nombreproveedor, 
                c.totalcompra
            FROM 
                compra c
            JOIN 
                proveedor p ON c.idproveedor = p.idproveedor
            LEFT JOIN 
                detalle_compra dc ON c.idcompra = dc.idcompra
            GROUP BY 
                c.idcompra, p.nombreproveedor
            ORDER BY 
                c.fechacompra DESC;
        `);

        const comprasFormateadas = result.rows.map(compra => ({
            idcompra: compra.idcompra,
            fechacompra: compra.fechacompra ? compra.fechacompra.toISOString().split('T')[0] : null,
            nombreproveedor: compra.nombreproveedor,
            totalcompra: compra.totalcompra // Muestra el total calculado
        }));

        res.status(200).json(comprasFormateadas);
    } catch (err) {
        console.error('Error al obtener las compras', err.stack);
        res.status(500).send('Error al obtener las compras');
    }
});


// Ruta para obtener los detalles de una compra específica
app.get('/detallesCompra', async (req, res) => {
    const { idCompra } = req.query;
    try {
        const detallesQuery = `
            SELECT dc.iddetallecompra, dc.codigores, r.peso, s.nsex AS sexo, dc.precio, dc.totaldetalle
            FROM detalle_compra dc
            LEFT JOIN res r ON dc.codigores = r.codigores
            LEFT JOIN sexo s ON r.sexo = s.idsexo
            WHERE dc.idcompra = $1;
        `;
        const detalles = await pool.query(detallesQuery, [idCompra]);
        res.json(detalles.rows);
    } catch (error) {
        console.error('Error al obtener detalles de compra:', error);
        res.status(500).send('Error al obtener detalles de compra');
    }
});

// Ruta para insertar una nueva compra sin el totalcompra
app.post('/compras', async (req, res) => {
    const { idProveedor, fechaCompra } = req.body;

    try {
        // Inserta la compra sin el totalcompra
        const result = await pool.query(
            'INSERT INTO compra (idproveedor, fechacompra, totalcompra) VALUES ($1, $2, 0) RETURNING idcompra',
            [idProveedor, fechaCompra]
        );

        // Devuelve el ID de la compra creada para agregar detalles después
        res.status(201).json({ idcompra: result.rows[0].idcompra });
    } catch (err) {
        console.error('Error al insertar compra', err.stack);
        res.status(500).send('Error al insertar compra');
    }
});


// Ruta para insertar detalles de compra y actualizar totalcompra
app.post('/detallesCompra', async (req, res) => {
    const { codigoRes, precioKilo, idCompra } = req.body;

    try {
        // Obtener el peso de la res o crearla si no existe
        const pesoQuery = 'SELECT peso FROM res WHERE codigores = $1;';
        let pesoResult = await pool.query(pesoQuery, [codigoRes]);

        if (pesoResult.rows.length === 0) {
            const { sexo, peso } = req.body;
            await pool.query('INSERT INTO res (codigores, sexo, peso) VALUES ($1, $2, $3)', [codigoRes, sexo, peso]);
            pesoResult = await pool.query(pesoQuery, [codigoRes]);
        }

        const peso = pesoResult.rows[0].peso;
        const totalDetalle = peso * precioKilo;

        // Insertar el detalle de compra
        await pool.query(
            'INSERT INTO detalle_compra (idcompra, codigores, precio, totaldetalle) VALUES ($1, $2, $3, $4)',
            [idCompra, codigoRes, precioKilo, totalDetalle]
        );

        // Actualizar el total de la compra sumando todos los totales de detalles de esa compra
        await pool.query(
            'UPDATE compra SET totalcompra = (SELECT COALESCE(SUM(totaldetalle), 0) FROM detalle_compra WHERE idcompra = $1) WHERE idcompra = $1',
            [idCompra]
        );

        res.status(201).send('Detalle de compra agregado correctamente y total actualizado');
    } catch (error) {
        console.error('Error al agregar detalle de compra:', error);
        res.status(500).send('Error al agregar detalle de compra');
    }
});








// Ruta para obtener todas las reses
app.get('/reses', async (req, res) => {
    try {
        const reses = await pool.query('SELECT codigores, nombre FROM res'); // Cambia 'nombre' según la columna que contenga el nombre de la res
        res.json(reses.rows);
    } catch (error) {
        console.error('Error al obtener reses:', error);
        res.status(500).send('Error al obtener reses');
    }
});

// Ruta para eliminar una compra y todos sus detalles
app.delete('/compras/:idCompra', async (req, res) => {
    const { idCompra } = req.params;
    try {
        await pool.query('BEGIN'); // Iniciar transacción
        // Eliminar detalles de la compra
        await pool.query('DELETE FROM detalle_compra WHERE idcompra = $1', [idCompra]);
        // Eliminar la compra
        await pool.query('DELETE FROM compra WHERE idcompra = $1', [idCompra]);
        await pool.query('COMMIT'); // Confirmar transacción
        res.send('Compra eliminada correctamente');
    } catch (error) {
        await pool.query('ROLLBACK'); // Revertir transacción en caso de error
        console.error('Error al eliminar compra:', error);
        res.status(500).send('Error al eliminar compra');
    }
});

// Ruta para obtener todos los sexos
app.get('/sexos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sexo');
        res.status(200).json(result.rows); // Asegúrate de que estás enviando un JSON válido
    } catch (err) {
        console.error('Error al obtener sexos', err.stack);
        res.status(500).json({ error: 'Error al obtener sexos' }); // Respuesta en JSON
    }
});

// Endpoint para verificar si un código de res existe
app.get('/res/:codigoRes', async (req, res) => {
    const { codigoRes } = req.params;

    try {
        const query = 'SELECT * FROM res WHERE codigores = $1;';
        const result = await pool.query(query, [codigoRes]);

        if (result.rows.length > 0) {
            return res.status(200).send('Código de res encontrado');
        } else {
            return res.status(404).send('Código de res no encontrado');
        }
    } catch (error) {
        console.error('Error al verificar código de res:', error);
        res.status(500).send('Error al verificar código de res');
    }
});

app.post('/res', async (req, res) => {
    const { codigores, sexo, peso } = req.body;
    console.log('Datos recibidos:', req.body); // Agrega esta línea para depurar

    // Verifica si codigores es nulo o vacío
    if (!codigores) {
        return res.status(400).send('El código de res es requerido');
    }

    try {
        const insertQuery = `
            INSERT INTO res (codigores, sexo, peso)
            VALUES ($1, $2, $3);
        `;

        await pool.query(insertQuery, [codigores, sexo, peso]);
        res.status(201).send('Res creada correctamente');
    } catch (error) {
        console.error('Error al crear res:', error);
        res.status(500).send('Error al crear res');
    }
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
