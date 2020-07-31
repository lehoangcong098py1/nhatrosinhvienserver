const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const swaggerDoc = require('./swaggerDoc')
const ngrok = require('ngrok');
//require('dotenv').load()
const port = process.env.PORT || 3000


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

let routes = require('./routes') //importing route
routes(app)

swaggerDoc(app)

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
})

app.listen(port)

// ngrok.connect({
//     proto : 'http',
//     addr : port,
//     auth : `${user}:${password}`
// }, (err, url) => {
//     if (err) {
//         console.error('Error while connecting Ngrok',err);
//         return new Error('Ngrok Failed');
//     } else {
//         console.log('Tunnel Created -> ', url);
//         console.log('Tunnel Inspector ->  http://127.0.0.1:4040');
//     }
// });
var url =ngrok.connect();
console.log(url);

console.log('RESTful API server started on: ' + port)