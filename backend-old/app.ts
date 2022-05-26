import feathers from "@feathersjs/feathers";
import "@feathersjs/transport-commons";
import express from "@feathersjs/express";
import socketio from "@feathersjs/socketio";

interface Message {
  id?: number;
  text: string;
}

class MessageService {
  messages: Message[] = [];

  async find() {
    return this.messages;
  }

  async create(data: Pick<Message, "text">) {
    const message = {
      id: this.messages.length,
      text: data.text,
    };

    this.messages.push(message);

    return message;
  }
}

const app = express(feathers());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.configure(express.rest());
app.configure(socketio());

app.use("/messages", new MessageService());
app.use(express.errorHandler());

app.on("connection", (connection) => app.channel("everybody").join(connection));

app.publish((data) => app.channel("everybody"));

app
  .listen(3030)
  .on("listening", () =>
    console.log("Feathers server listening on localhost:3030")
  );

// For good measure let's create a message
// So our API doesn't look so empty
app.service("messages").create({
  text: "Hello world from the server",
});

/* app.service("messages").on("created", (message: Message) => {
  console.log("A new message has been created: ", message);
}); */

/* const main = async () => {
  await app.service("messages").create({ text: "Hello world!" });

  await app.service("messages").create({ text: "Hello world again!" });

  const messages = await app.service("messages").find();

  console.log("All messages:", messages);
};

main();
 */
