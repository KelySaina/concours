const express = require('express');
const cors = require('cors');
const connection = require('./db');
const nodemailer = require('nodemailer');

const app = express();

app.use(express.json());



const PORT = 5000;

app.use(cors());

app.get('/', (req, res) => {
    res.send("Hello")
})

app.post("/remember", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.post("/setRemember", async (req, res) => {
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

app.post("/mail", async (req, res) => {

    const { recipient } = req.body


    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'nalyvalisoa0510@gmail.com',
            pass: 'ohhfmdyfitixcura',
        },
    });

    async function sendEmail() {
        try {
            await transporter.sendMail({
                from: 'nalyvalisoa0510@gmail.com',
                to: recipient,
                subject: 'REINITIALIZE PASSWORD',
                text: 'Yuppie Hub',
                html: '<p>Hello,<br>You forgot your password, please click <a href="https://google.com">here</a> to reinitialize your password<br>Yuppie Hub </p>',
            });

            res.send("Mail sent")
        } catch (error) {
            res.send("An error occured")
        }
    }

    sendEmail();

})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})