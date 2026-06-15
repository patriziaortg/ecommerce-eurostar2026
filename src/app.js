const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes/index');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

app.use(express.json());

app.use('/api', apiRoutes);
app.use('/', healthRoutes);

app.use(errorHandler);

module.exports = app;
