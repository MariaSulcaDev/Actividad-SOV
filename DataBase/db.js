const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'colegio',
    database: 'CLIENTE',
    port: '33060'
})

connection.connect((err) => {
    if (err) {
        throw err;
    } else {
        console.log('Conexion establecida')
    }
})

module.exports = connection;