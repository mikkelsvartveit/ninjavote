<script lang="ts">
  import type { Application } from "@feathersjs/feathers";
  import feathers from "@feathersjs/client";
  import socketio from "@feathersjs/socketio-client";
  import io from "socket.io-client";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { Button, Modal, Dialog, TextField } from "attractions";
  import type { IOption, IPoll, IVote, IVoterSession } from "src/types/poll";
  import PollOption from "../components/PollOption.svelte";
  import OptionVotersModal from "../components/modals/OptionVotersModal.svelte";

  // Get ID for poll to load
  const { params } = $page;
  const pollId = params.poll;

  let feathersApp: Application<any>;

  let session: IVoterSession | null = null;
  let poll: IPoll | null = null;

  let nickname = "";
  let newQuestion = "";
  let newOption = "";
  let optionToShowInModal: IOption | null = null;

  $: sortedOptions = poll
    ? poll.options
        .sort((a: IOption, b: IOption) => a.text.localeCompare(b.text))
        .sort((a: IOption, b: IOption) => b.votes.length - a.votes.length)
    : [];

  $: numberOfVoters = new Set(
    poll?.options
      .map((option: IOption) => option.votes)
      .reduce((acc: IVote[], votes: IVote[]) => acc.concat(votes), [])
      .map((vote: IVote) => vote.voterId)
  ).size;

  onMount(async () => {
    const API_URL = `http://${window.location.hostname}:3030/`;

    // Initialize Feathers client
    const socket = io(API_URL);
    feathersApp = feathers();
    feathersApp.configure(socketio(socket));

    // Register Feathers services
    feathersApp.service("options").on("created", (option: IOption) => {
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
          poll.options = poll.options;
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
          poll.options = poll.options;
        }
      }
    });

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

  <OptionVotersModal
    option={optionToShowInModal}
    onClose={() => (optionToShowInModal = null)}
  />

  {#if poll !== null}
    <h1>{poll?.question ?? "Loading..."}</h1>

    {#if session}
      <p>Poll joined as <b>{session.nickname}</b></p>
    {/if}

    {#each sortedOptions as option (option.id)}
      <PollOption
        {feathersApp}
        {session}
        {option}
        {numberOfVoters}
        openVotersModal={() => (optionToShowInModal = option)}
      />
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

  main {
    font-size: 16px;
    max-width: 600px;
    margin: 30px auto;
    padding: 0 5px;
  }
</style>
