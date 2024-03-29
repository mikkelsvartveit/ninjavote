import { HooksObject } from "@feathersjs/feathers";
import { disallow } from "feathers-hooks-common";

export default {
  before: {
    all: [],
    find: [disallow("external")],
    get: [disallow("external")],
    create: [],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()],
  },

  after: {
    all: [],
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
