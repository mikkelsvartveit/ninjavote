import { Hook, HookContext } from "@feathersjs/feathers";

export default (): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.params.connection) {
      context.service.emit("poll-opened", {
        connection: context.params.connection,
        pollId: context.id,
      });
    }

    return context;
  };
};
