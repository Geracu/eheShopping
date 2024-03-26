const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path')
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Nicole@01',
    database: 'eheshoppingdb'
});

connection.connect(error => {
    if (error) {
        console.error('Error al conectar con la base de datos:', error);
        return;
    }
    console.log('Conexión establecida con la base de datos.');
});

let ventana;

function createWindow() {
    ventana = new BrowserWindow({
        width: 500,
        height: 800,
        resizable: true,
        webPreferences: {
            preload: path.join(app.getAppPath(), 'preload.js')
        }

    });
    ventana.loadFile('pantallaIniciarSesion.html')
    ipcMain.on('idEmpleado', (event, idEmpleado) => {
        global.idEmpleado = idEmpleado;
    });

    ventana.webContents.on('did-finish-load', () => {
        ventana.webContents.send('idEmpleado', global.idEmpleado);
    });
}


ipcMain.on('verificarLogin', (event, args) => {
    const { idEmpleado, contrasena } = args;

    console.log(`Intentando iniciar sesión para el empleado: ${idEmpleado}`);

    const query = 'SELECT * FROM empleados WHERE idEmpleado = ?';

    connection.query(query, [idEmpleado], (error, results) => {
        if (error) {
            console.error('Error en la consulta:', error.message);
            event.reply('respuestaLogin', { error: true, message: 'Error al consultar la base de datos' });
            return;
        }

        if (results.length > 0) {
            const user = results[0];
            bcrypt.compare(contrasena, user.contrasena, (err, isMatch) => {
                if (err) {
                    console.error('Error al verificar la contraseña:', err.message);
                    event.reply('respuestaLogin', { error: true, message: 'Error al verificar la contraseña' });
                    return;
                }

                if (isMatch) {
                    console.log('Login exitoso para el empleado:', idEmpleado);

                    console.log('User ID stored in localStorage:', user.idEmpleado);

                    if (ventana) {

                        ventana.webContents.send('idEmpleado', user.idEmpleado);
                    }

                    event.reply('respuestaLogin', { error: false, message: 'Login exitoso', usuario: user });
                } else {
                    event.reply('respuestaLogin', { error: true, message: 'ID de empleado o contraseña incorrectos' });
                }
            });
        } else {
            console.log('No se encontró el empleado.');
            event.reply('respuestaLogin', { error: true, message: 'ID de empleado o contraseña incorrectos' });
        }
    });
});

ipcMain.on('idEmpleado', (event, idEmpleado) => {
    global.idEmpleado = idEmpleado;
})


app.whenReady().then(createWindow)

ipcMain.on('solicitarProductos', (event) => {
    const query = 'SELECT * FROM productos';

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al consultar la base de datos:', error);
            event.reply('enviarProductos', []);
            return;
        }
        event.reply('enviarProductos', results);
    });
});

ipcMain.on('solicitarPedidosPendientes', (event, arg) => {
    if (!arg || !arg.idDelProducto) {
        console.error('The argument "idDelProducto" is missing.');
        event.reply('enviarPedidosPendientes', { idDelProducto: null, results: [] });
        return;
    }

    const query = 'SELECT cantidad from pedidos WHERE idDelProducto = ?';
    connection.query(query, [arg.idDelProducto], (error, results) => {
        if (error) {
            console.error('Error al consultar la base de datos:', error);
            event.reply('enviarPedidosPendientes', { idDelProducto: arg.idDelProducto, results: [] });
            return;
        }
        event.reply('enviarPedidosPendientes', { idDelProducto: arg.idDelProducto, results: results });
    });
});


ipcMain.on('sendOrder', (event, productData) => {
    const { id, name, supplier, stock, employeeId } = productData;
    const checkQuery = `SELECT * FROM pedidos WHERE idDelProducto = ? AND proveedor = ?`;
    connection.query(checkQuery, [id, supplier], (checkError, checkResults) => {
        if (checkError) {
            console.error('Error al verificar el producto:', checkError);
            event.reply('orderResponse', { success: false, message: 'Error al verificar el producto' });
            return;
        }

        if (checkResults.length > 0) {
            console.log('El producto ya existe en los pedidos');
            event.reply('orderResponse', { success: false, message: 'El producto ya existe en los pedidos' });
            return;
        }

        const insertQuery = `INSERT INTO pedidos (idDelProducto, nombreDelProducto, proveedor, cantidad, idEmpleado) VALUES (?, ?, ?, ?, ?)`;
        console.log("Executing SQL:", insertQuery, id, name, supplier, stock, employeeId);

        connection.query(insertQuery, [id, name, supplier, stock, employeeId], (insertError, insertResults) => {
            if (insertError) {
                console.error('Error al actualizar el producto:', insertError);
                event.reply('orderResponse', { success: false, message: 'Error al actualizar el producto' });
            } else {
                console.log('Producto actualizado con éxito');
                event.reply('orderResponse', { success: true, message: 'Producto actualizado con éxito' });
            }
        });
    });
});



ipcMain.on('updateProduct', (event, product) => {
    const query = `UPDATE productos SET nombreDelProducto = ?, proveedor = ?, descripcion = ?, categoria = ?, existencia = ? WHERE idDelProducto = ?`;
    console.log("Executing SQL:", query, [product.name, product.supplier, product.description, product.category, product.stock, product.id]);

    connection.query(query, [product.name, product.supplier, product.description, product.category, product.stock, product.id], (error, results) => {
        if (error) {
            console.error('Error al actualizar el producto:', error);
            event.reply('productUpdateResponse', { success: false, message: 'Error al actualizar el producto' });
        } else {
            console.log('Producto actualizado con éxito');
            event.reply('productUpdateResponse', { success: true, message: 'Producto actualizado con éxito' });
        }
    });
});

ipcMain.on('solicitarProveedor', (event, arg) => {
    const query = 'SELECT proveedor FROM proveedores WHERE idDelProducto = ?';

    connection.query(query, [arg.idDelProducto], (error, results) => {
        if (error) {
            console.error('Error al consultar la base de datos:', error);
            event.reply('enviarProveedor', []);
            return;
        }
        event.reply('enviarProveedor', results);
    });
});

ipcMain.handle('show-alert', async (event, options) => {
    const response = await dialog.showMessageBox(options);
    return response;
});


