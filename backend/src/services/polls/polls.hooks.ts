import { HookContext, HooksObject } from "@feathersjs/feathers";
import { disallow } from "feathers-hooks-common";

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
    get: [
      async (context: HookContext) => {
        if (context.params.connection) {
          context.service.emit("poll-opened", {
            connection: context.params.connection,
            pollId: context.id,
          });
        }

        return context;
      },
    ],
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
