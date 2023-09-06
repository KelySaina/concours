const express = require('express');
const cors = require('cors');
const connection = require('./db');

const app = express();

app.use(express.json());



const PORT = 5000;

app.use(cors());

app.get('/', (req, res) => {
    res.send("Hello")
})

app.post("/remember", (req, res) => {
    const { username, password } = req.body;

    connection.query(
        'SELECT remember, accountType FROM creds WHERE username = ? AND password = ?',
        [username, password],
        (err, rows) => {
            if (err) {
                console.error('Erreur lors de la récupération de login :', err);
                res.status(500).send('Erreur lors de la récupération de login');
            } else {
                res.send(rows)
            }
        }
    );
})

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    connection.query(
        'SELECT accountType,id FROM creds WHERE username = ? AND password = ?',
        [username, password],
        (err, rows) => {
            if (err) {
                console.error('Erreur lors de la récupération de login :', err);
                res.status(500).send('Erreur lors de la récupération de login');
            } else {
                res.send(rows)
            }
        }
    );
})

app.post("/setRemember", (req, res) => {
    const { r, id } = req.body;
    let q = ""

    r ? q = "update creds set remember = 0 where id = ? " : q = "update creds set remember = 1 where id = ? "

    connection.query(
        q,
        [id],
        (err, rows) => {
            if (err) {
                console.error('Erreur lors de la récupération de login :', err);
                res.status(500).send('Erreur lors de la récupération de login');
            } else {
                res.send(rows)
            }
        }
    );
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})