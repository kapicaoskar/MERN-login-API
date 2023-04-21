console.clear()
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require("cors");
const app = express();
const connect = require('./db/connect.js');
const expressip = require('express-ip');
app.use(expressip().getIpInfoMiddleware);

fs.readdirSync(path.join(__dirname, 'routes')).forEach((file) => {
    if (file.endsWith('.js')) {
        const router = require(path.join(__dirname, 'routes', file));
        app.use(router);
    }
});


fs.readdirSync(path.join(__dirname, 'routes/normalLogin')).forEach((file) => {
    if (file.endsWith('.js')) {
        const router = require(path.join(__dirname, 'routes/normalLogin', file));
        app.use(router);
    }
});


fs.readdirSync(path.join(__dirname, 'routes/discordLogin')).forEach((file) => {
    if (file.endsWith('.js')) {
        const router = require(path.join(__dirname, 'routes/discordLogin', file));
        app.use(router);
    }
});



fs.readdirSync(path.join(__dirname, 'routes/steamLogin')).forEach((file) => {
    if (file.endsWith('.js')) {
        const router = require(path.join(__dirname, 'routes/steamLogin', file));
        app.use(router);
    }
});



app.listen(4000, () => {
    app.use(cors());
    connect();
    console.log('Postawiono API na http://localhost:4000');
});




