const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');

const app = express();
const port = 3000;

// Use session ANTES do cors e bodyParser
app.use(session({
  secret: 'educpaeeja7',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,   // true se for HTTPS
    sameSite: 'lax'  // 'lax' permite envio no mesmo site
  }
}));

app.use(cors({
  origin: `http://localhost:${port}`, // frontend rodando aqui
  credentials: true
}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

require("./routes/routes")(app);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}...`);
});
