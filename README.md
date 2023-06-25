# Ninjavote

Ninjavote is a web application for instantly creating simple polls in your group chats. To create a poll, just head to [ninjavote.com](https://ninjavote.com), type your question, and share the link with your group. Real-time synchronization with WebSockets ensures that the poll always stays up to date for everyone!

![Ninjavote screen dump](https://github.com/mikkelsvartveit/ninjavote/assets/30391413/7a02ac66-dc03-48fd-9562-336b47a3b897)

### Running locally

To install all dependencies and run both the server and the client locally, run the following commands:

```
git clone https://github.com/mikkelsvartveit/ninjavote.git
cd ninjavote/frontend
npm run install:all
npm start
```

The Feathers server should now be running at `localhost:3030` and the Svelte app at `localhost:3000`.
