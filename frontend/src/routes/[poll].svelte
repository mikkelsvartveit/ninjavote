<script lang="ts">
  import feathers from "@feathersjs/client";
  import socketio from "@feathersjs/socketio-client";
  import io from "socket.io-client";
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  // @ts-ignore - isProduction comes from Rollup config
  // const API_URL = isProduction ? '/' : 'http://localhost:3030';
  const API_URL = "http://localhost:3030/";

  // Get ID for poll to load
  const { params } = $page;
  const pollId = params.poll;

  const socket = io(API_URL);
  // @ts-ignore
  const feathersApp = feathers();
  feathersApp.configure(socketio(socket));

  // TODO: add types
  let poll: any;
  let newQuestion = "";
  let newOption = "";

  $: sortedOptions = poll
    ? poll.options.sort((a: any, b: any) => a.votes.length - b.votes.length)
    : [];

  feathersApp.service("options").on("created", (newOption: any) => {
    console.log(newOption);
    if (poll) {
      poll.options = [...poll.options, newOption];
    }
  });

  feathersApp.service("votes").on("created", (data: any) => {
    console.log(data);
  });

  onMount(async () => {
    try {
      poll = await feathersApp.service("polls").get(pollId);
    } catch (error) {
      poll = null;
    }
  });

  const createPoll = async () => {
    const newPoll = {
      id: pollId,
      question: newQuestion,
    };
    poll = await feathersApp.service("polls").create(newPoll);
  };

  const addOption = async () => {
    const option = {
      pollId,
      text: newOption,
    };
    await feathersApp.service("options").create(option);
  };
</script>

<main>
  {#if poll}
    <h1>{poll?.question ?? "Loading..."}</h1>

    {#each sortedOptions as option}
      <div>
        <label>
          <input type="checkbox" name="option" value={option.id} />
          {option.text}
        </label>
      </div>
    {/each}

    <input type="text" bind:value={newOption} />
    <button on:click={addOption}>Create Option</button>
  {:else}
    <h1>Create a new poll</h1>
    <input
      type="text"
      bind:value={newQuestion}
      placeholder="Type your question here..."
    />
    <button on:click={createPoll}>Create</button>
  {/if}
</main>

<style>
</style>
