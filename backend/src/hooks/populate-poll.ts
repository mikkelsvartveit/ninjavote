import { Hook, HookContext } from "@feathersjs/feathers";

export default (): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const pollId = context.id;
    // console.log(context);

    const options = await context.app.service("options").find({
      query: {
        pollId,
      },
    });

    await Promise.all(
      options.data.map(async (option: any) => {
        const votes = await context.app.service("votes").find({
          query: {
            optionId: option.id,
          },
        });

        // Remove 'optionId' from each vote
        option.votes = votes.data.map(
          ({
            id,
            voterId,
            name,
          }: {
            id: number;
            voterId: string;
            name: string;
          }) => ({
            id,
            voterId,
            name,
          })
        );
      })
    );

    context.result = { ...context.result, options: options.data };

    return context;
  };
};
