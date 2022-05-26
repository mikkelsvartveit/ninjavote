import assert from 'assert';
import app from '../../src/app';

describe('\'polls\' service', () => {
  it('registered the service', () => {
    const service = app.service('polls');

    assert.ok(service, 'Registered the service');
  });
});
