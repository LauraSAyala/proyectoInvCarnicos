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
app.delete('/clientes/:id', (req, res) => {
    const idCliente = req.params.id;
    pool.query('DELETE FROM cliente WHERE idCliente = $1', [idCliente], (error, result) => {
        if (error) {
            console.error('Error al eliminar cliente', error);
            res.status(500).json({ error: 'Error al eliminar cliente' });
        } else if (result.rowCount === 0) {
            res.status(404).json({ error: 'Cliente no encontrado' });
        } else {
            res.status(200).json({ message: 'Cliente eliminado correctamente' });
        }
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
