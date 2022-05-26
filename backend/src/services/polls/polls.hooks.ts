import { HookContext, HooksObject } from "@feathersjs/feathers";
import { disallow } from "feathers-hooks-common";
import emitPollOpened from "../../hooks/emit-poll-opened";
import populatePoll from "../../hooks/populate-poll";

export default {
  before: {
    all: [],
    find: [disallow()],
    get: [],
    create: [],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()],
  },

  after: {
    all: [],
    find: [],
    get: [populatePoll(), emitPollOpened()],
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
