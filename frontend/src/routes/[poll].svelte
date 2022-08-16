<script lang="ts">
  import feathers from "@feathersjs/client";
  import socketio from "@feathersjs/socketio-client";
  import io from "socket.io-client";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { Button, Modal, Dialog, TextField } from "attractions";

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
  let session: {
    nickname: string;
    voterId: string;
    voterSecret: string;
  } | null;
  let poll: any;
  let nickname = "";
  let newQuestion = "";
  let newOption = "";

  $: sortedOptions = poll
    ? poll.options.sort((a: any, b: any) => a.votes.length - b.votes.length)
    : [];

  feathersApp.service("options").on("created", (option: any) => {
    console.log(option);
    if (poll) {
      poll.options = [...poll.options, { ...option, votes: [] }];
    }
  });

  feathersApp.service("votes").on("created", (data: any) => {
    console.log(data);
  });

  onMount(async () => {
    const sessionJson = localStorage.getItem(pollId);
    if (sessionJson) {
      session = JSON.parse(sessionJson);
    } else {
      session = null;
    }

    try {
      poll = await feathersApp.service("polls").get(pollId);
    } catch (error) {
      poll = null;
    }
  });

  const createSession = () => {
    const voterId = Math.random().toString(36).substring(2, 15);
    const voterSecret = Math.random().toString(36).substring(2, 15);

    // Check if someone with the same nickname has already voted in this poll
    if (
      poll.options
        .reduce((acc: any[], cur: any) => [acc, ...cur.votes], [])
        .some((vote: any) => vote.name === nickname && vote.voterId !== voterId)
    ) {
      // TODO: show error message
      return;
    }

    session = { nickname, voterId, voterSecret };
    localStorage.setItem(pollId, JSON.stringify(session));
  };

  const createPoll = async () => {
    const newPoll = {
      id: pollId,
      question: newQuestion,
    };
    await feathersApp.service("polls").create(newPoll);
    poll = await feathersApp.service("polls").get(pollId);
  };

  const addOption = async () => {
    const option = {
      pollId,
      text: newOption,
    };
    await feathersApp.service("options").create(option);
    newOption = "";
  };
</script>

<main>
  <Modal open={session === null} noClickaway>
    <Dialog constrainWidth title="Enter name">
      <p>You need a nickname to vote in this poll.</p>
      <TextField outline bind:value={nickname} placeholder="Name" />
      <Button on:click={createSession} style="float: right;">Join</Button>
    </Dialog>
  </Modal>
  {#if poll !== null}
    <h1>{poll?.question ?? "Loading..."}</h1>

    {#each sortedOptions as option}
      <div>
        <label>
          <input type="checkbox" name="option" value={option.id} />
          {option.text}
        </label>
      </div>
    {/each}

    <form on:submit|preventDefault={addOption}>
      <input type="text" bind:value={newOption} />
      <Button small filled on:click={addOption}>Create Option</Button>
    </form>
  {:else}
    <h1>Create a new poll</h1>
    <form on:submit|preventDefault={createPoll}>
      <input
        type="text"
        bind:value={newQuestion}
        placeholder="Type your question here..."
      />
      <button>Create Poll</button>
    </form>
  {/if}
</main>

<style>
  @import "$/style/main.scss";
</style>
