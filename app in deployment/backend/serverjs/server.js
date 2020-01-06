const express = require('express');
const path = require('path');
const app = express();
var cors = require('cors');
const request = require('request');
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var mailer = require("nodemailer");


app.use(express.static(path.join(__dirname, 'frontend')));
app.use(cors());
app.use(bodyParser.json());

request.post = Promise.promisify(request.post);

app.post('/api/login_auth', function (req, res) {
    //console.log("request: ", req.body);
    let dataPr = req.body;
    let url = 'http://192.168.0.8:3030/imprimanteunicarm/backend/php/login_auth.php';
    request.post(
        url,
        { json: dataPr },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.status(response.statusCode).send(body);
            } else {
                //console.log("error: ", error)
            }
        }
    );
});

app.post('/api/Listare', function (req, res) {
    //console.log("request Listare: ", req.body);
    let dataPr = req.body;
    let url = 'http://192.168.0.8:3030/imprimanteunicarm/backend/php/Listare.php';
    request.post(
        url,
        { json: dataPr },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.status(response.statusCode).send(JSON.stringify(body));
            } else {
                //console.log("error: ", error)
            }
        }
    );
});
app.post('/api/Updates', function (req, res) {
    //console.log("request Updates: ", req.body);
    let dataPr = req.body;
    let url = 'http://192.168.0.8:3030/imprimanteunicarm/backend/php/Updates.php';
    request.post(
        url,
        { json: dataPr },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.status(response.statusCode).send(JSON.stringify(body));
            } else {
                //console.log("error: ", error)
            }
        }
    );
});
app.post('/api/Delete', function (req, res) {
    //console.log("request: delete ", req.body);
    let dataPr = req.body;
    let url = 'http://192.168.0.8:3030/imprimanteunicarm/backend/php/Delete.php';
    request.post(
        url,
        { json: dataPr },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.status(response.statusCode).send(JSON.stringify(body));
            } else {
                //console.log("error: ", error)
            }
        }
    );
});
app.post('/api/SendMail', function (req, res) {
    //console.log("request: send mail ", req.body);
    let dataPr = req.body;

    var smtpTransport = mailer.createTransport({
        host: 'mail.unicarm.ro',
        port: 465,
        secure: true,  //true for 465 port, false for other ports
        auth: {
            user: 'imprimante@unicarm.ro',
            pass: 'Sit2010Unicarm'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    var mail = {
        from: "Sesizari Imprimante <imprimante@unicarm.ro>",
        to: dataPr.emailToAddress,
        subject: dataPr.emailSubject,
        text: dataPr.emailMsg,
        html: dataPr.emailMsg
    }

    smtpTransport.sendMail(mail, function (error, response) {
        if (error) {
            res.send(JSON.stringify(error));
            //console.log(error);
        } else {
            res.send(JSON.stringify("Message sent: " + response.message));
            //console.log("Message sent: " + response.message);
        }
        smtpTransport.close();
    });
});

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

let port = 9000;
app.listen(port);
//console.log("Server started at port : ", port);