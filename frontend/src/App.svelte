<script lang="ts">
  import feathers from "@feathersjs/client";
  import socketio from "@feathersjs/socketio-client";
  import io from "socket.io-client";
  import { onMount } from "svelte";

  const socket = io("http://localhost:3030");
  // @ts-ignore
  const client = feathers();
  client.configure(socketio(socket));
  const pollsService = client.service("polls");
  const optionsService = client.service("options");
  const votesService = client.service("votes");

  let poll = [];
  let newMessage = "";

  optionsService.on("created", (data) => {
    console.log(data);
  });

  const addMessage = () => {
    if (newMessage.length > 0) {
      pollsService.create({ text: newMessage });
      newMessage = "";
    }
  };

  onMount(async () => {
    poll = await pollsService.get("erdukul123");
    console.log(poll);
  });

  export let name: string;
</script>

<main>
  <h1>Hello {name}!</h1>

  <input bind:value={newMessage} />
  <button on:click={addMessage}>Add message</button>

  <!-- <ul>
    {#each messages as message}
      <li>{message.text}</li>
    {/each}
  </ul> -->
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
