import "@feathersjs/transport-commons";
import { HookContext } from "@feathersjs/feathers";
import { Application } from "./declarations";
import {
  Channel,
  RealTimeConnection,
} from "@feathersjs/transport-commons/lib/channels/channel/base";

export default function (app: Application): void {
  if (typeof app.channel !== "function") {
    // If no real-time functionality has been configured just return
    return;
  }

  app
    .service("polls")
    .on(
      "poll-opened",
      ({
        connection,
        pollId,
      }: {
        connection: RealTimeConnection;
        pollId: string;
      }): void => {
        app.channel(`polls/${pollId}`).join(connection);
      }
    );

  app.service("polls").publish((data: any): Channel => {
    return app.channel(`polls/${data.id}`);
  });

  app.service("options").publish((data: any): Channel => {
    return app.channel(`polls/${data.pollId}`);
  });

  app.service("votes").publish(async (data: any): Promise<Channel> => {
    const option = await app.service("options").get(data.optionId);
    const { pollId } = option;

    return app.channel(`polls/${pollId}`);
  });
}
