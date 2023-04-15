import { HooksObject } from "@feathersjs/feathers";
import { iff, isProvider, disallow, discard } from "feathers-hooks-common";

export default {
  before: {
    all: [],
    find: [disallow("external")],
    get: [disallow("external")],
    create: [],
    update: [disallow()],
    patch: [disallow()],
    remove: [],
  },

  after: {
    all: [iff(isProvider("external"), discard("voterSecret"))],
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
