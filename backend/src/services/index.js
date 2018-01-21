const patiente = require('./patiente/patiente.service.js');
module.exports = function (app) {
  app.configure(patiente);
};
