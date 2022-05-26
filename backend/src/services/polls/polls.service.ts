// Initializes the `polls` service on path `/polls`
import { ServiceAddons } from "@feathersjs/feathers";
import { Application } from "../../declarations";
import { Polls } from "./polls.class";
import createModel from "../../models/polls.model";
import hooks from "./polls.hooks";

// Add this service to the service type index
declare module "../../declarations" {
  interface ServiceTypes {
    polls: Polls & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/polls", new Polls(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("polls");

  service.hooks(hooks);
}
