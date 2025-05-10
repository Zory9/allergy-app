const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require("dotenv").config({path: './.env'})
const pool = require('./db');
const router = express.Router();
const cors = require('cors');

const app = express()
const port = 3000

app.use(bodyParser.json({limit: '50mb'}))
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
  })
)
app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        const allowedOrigins = ['http://localhost:4200', 'http://localhost:8080'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

const routes = require("./routes/routes");
app.use('/', routes)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})