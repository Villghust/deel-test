const express = require('express');
const bodyParser = require('body-parser');

const { sequelize } = require('./model');

const router = require('./router');

const app = express();

app.use(bodyParser.json());
app.use(router);

app.set('sequelize', sequelize);
app.set('models', sequelize.models);

module.exports = app;
