const path = require('path');

function getSwaggerSpec(req, res, next) {
  const swaggerFilePath = path.resolve(__dirname, '../../swagger.json');

  res.sendFile(swaggerFilePath, (err) => {
    if (err) {
      next(err);
    }
  });
}

module.exports = { getSwaggerSpec };
