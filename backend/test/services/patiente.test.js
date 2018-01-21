const assert = require('assert');
const app = require('../../src/app');

describe('\'patiente\' service', () => {
  it('registered the service', () => {
    const service = app.service('patientes');

    assert.ok(service, 'Registered the service');
  });
});
