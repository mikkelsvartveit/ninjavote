import { HooksObject } from "@feathersjs/feathers";
import { disallow, discard } from "feathers-hooks-common";

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [disallow()],
    patch: [disallow()],
    remove: [],
  },

  after: {
    all: [discard("voterSecret")],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
