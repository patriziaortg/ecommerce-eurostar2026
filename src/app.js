const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes/index');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

app.use(express.json());

app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', apiRoutes);
app.use('/', healthRoutes);

app.use(errorHandler);

module.exports = app;
