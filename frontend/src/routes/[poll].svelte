<script lang="ts">
  import feathers from "@feathersjs/client";
  import socketio from "@feathersjs/socketio-client";
  import io from "socket.io-client";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { Button, Modal, Dialog, TextField, Checkbox } from "attractions";
  import type { IOption, IPoll, IVote, IVoterSession } from "src/types/poll";
  import PollOption from "../components/PollOption.svelte";

  // @ts-ignore - isProduction comes from Rollup config
  // const API_URL = isProduction ? '/' : 'http://localhost:3030';
  const API_URL = "http://localhost:3030/";
  // const API_URL = `http://${window.location.hostname}:3030/`;

  // Get ID for poll to load
  const { params } = $page;
  const pollId = params.poll;

  const socket = io(API_URL);
  // @ts-ignore
  const feathersApp = feathers();
  feathersApp.configure(socketio(socket));

  // TODO: add types
  let session: IVoterSession | null = null;

  let poll: IPoll | null = null;
  let nickname = "";
  let newQuestion = "";
  let newOption = "";

  $: sortedOptions = poll
    ? poll.options
        .sort((a: IOption, b: IOption) => a.text.localeCompare(b.text))
        .sort((a: IOption, b: IOption) => b.votes.length - a.votes.length)
    : [];

  feathersApp.service("options").on("created", (option: IOption) => {
    console.log(option);
    if (poll) {
      poll.options = [...poll.options, { ...option, votes: [] }];
    }
  });

  feathersApp.service("votes").on("created", (vote: IVote) => {
    if (poll) {
      const option = poll.options.find(
        (option: IOption) => option.id === vote.optionId
      );

      if (option) {
        option.votes.push(vote);

        // Force re-render of options
        poll.options = [...poll.options];
      }
    }
  });

  feathersApp.service("votes").on("removed", (vote: IVote) => {
    if (poll) {
      const option = poll.options.find(
        (option: IOption) => option.id === vote.optionId
      );

      if (option) {
        option.votes = option.votes.filter((v: IVote) => v.id !== vote.id);

        // Force re-render of options
        poll.options = [...poll.options];
      }
    }
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

    console.log(poll);
  });

  const createSession = () => {
    const voterId = Math.random().toString(36).substring(2, 15);
    const voterSecret = Math.random().toString(36).substring(2, 15);

    // Check if someone with the same nickname has already voted in this poll
    if (
      poll !== null &&
      poll.options
        .reduce(
          (acc: IVote[], cur: IOption): IVote[] => [...acc, ...cur.votes],
          []
        )
        .some(
          (vote: IVote) => vote.name === nickname && vote.voterId !== voterId
        )
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
  <Modal open={poll !== null && session === null} noClickaway>
    <Dialog constrainWidth title="Enter name">
      <p>You need a nickname to vote in this poll.</p>
      <TextField outline bind:value={nickname} placeholder="Name" />
      <Button on:click={createSession} style="float: right;">Join</Button>
    </Dialog>
  </Modal>

  {#if poll !== null}
    <h1>{poll?.question ?? "Loading..."}</h1>

    {#if session}
      <p>Poll joined as <b>{session.nickname}</b></p>
    {/if}

    {#each sortedOptions as option}
      <PollOption {feathersApp} {session} {option} numberOfVoters={0} />
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

<style lang="scss">
  @use "../style/main.scss";

  .option-container {
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 8px 0;
    padding: 0 10px;

    &.selected {
      background-color: #f0f0f0;
    }

    &:hover {
      background-color: #f7f7f7;
    }
  }

  .checkbox-label {
    margin-left: 10px;
    padding: 15px 0;
  }
</style>
