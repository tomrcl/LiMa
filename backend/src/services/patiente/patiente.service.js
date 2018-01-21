// Initializes the `patiente` service on path `/patientes`
const createService = require('feathers-mongoose');
const createModel = require('../../models/patiente.model');
const hooks = require('./patiente.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'patiente',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/patientes', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('patientes');

  service.hooks(hooks);
};
