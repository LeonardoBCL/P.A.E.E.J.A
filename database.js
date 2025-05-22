const mysql = require('mysql2');

db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "paeeja",
    multipleStatements: true
});

db.connect((err) => {
    if (err) {
        return console.error("Erro ao conectar ao MySQL:", err);
    }
    console.log("Conectado ao MySQL!");
});

module.exports = db;