const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Nicole@01',
    database: 'eheshoppingdb'
});

connection.connect();

connection.query('SELECT idEmpleado, contrasena FROM empleados', (error, results) => {
    if (error) throw error;

    results.forEach((user) => {
        if (user.contrasena) { // Asegúrate de no hashear contraseñas nulas
            const hashedPassword = bcrypt.hashSync(user.contrasena, 10);

            connection.query('UPDATE empleados SET contrasena = ? WHERE idEmpleado = ?', [hashedPassword, user.idEmpleado], (err) => {
                if (err) throw err;
                console.log(`Contraseña actualizada para el empleado ${user.idEmpleado}`);
            });
        }
    });
});
