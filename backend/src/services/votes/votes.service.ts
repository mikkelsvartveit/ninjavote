// Initializes the `votes` service on path `/votes`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Votes } from './votes.class';
import createModel from '../../models/votes.model';
import hooks from './votes.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'votes': Votes & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/votes', new Votes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('votes');

  service.hooks(hooks);
}
