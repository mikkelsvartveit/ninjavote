<script lang="ts">
  import { env } from "$env/dynamic/public";
  import type { Application } from "@feathersjs/feathers";
  import type { PageData } from "./$types";
  import feathers from "@feathersjs/client";
  import socketio from "@feathersjs/socketio-client";
  import io from "socket.io-client";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import type { IOption, IVote } from "$lib/types/poll";
  import PollOption from "./PollOption.svelte";
  import EnterNameModal from "./modals/EnterNameModal.svelte";
  import ErrorRefreshModal from "./modals/ErrorRefreshModal.svelte";
  import { poll } from "$lib/store/pollStore";
  import { session } from "$lib/store/sessionStore";
  import AddIcon from "$lib/icons/add.svg";
  import CheckIcon from "$lib/icons/check.svg";
  import "$lib/style/main.scss";
  import AddOptionModal from "./modals/AddOptionModal.svelte";

  // Set poll from load function
  export let data: PageData;
  $poll = data.poll;

  // Get ID for poll
  const { params } = $page;
  const pollId = params.poll;

  let feathersApp: Application<unknown>;

  let isHydrated = false;
  let error = false;
  let showAddOptionModal = false;

  let newQuestion = "";

  $: sortedOptions = $poll
    ? $poll.options
        .sort((a: IOption, b: IOption) => a.text.localeCompare(b.text))
        .sort((a: IOption, b: IOption) => b.votes.length - a.votes.length)
    : [];

  onMount(() => {
    if (!env.PUBLIC_API_URL) {
      throw new Error("Environment variable API_URL is not defined");
    }

    // Initialize Feathers client
    const socket = io(env.PUBLIC_API_URL);
    feathersApp = feathers();
    feathersApp.configure(socketio(socket));

    // Register Feathers services
    feathersApp.service("options").on("created", (option: IOption) => {
      if ($poll) {
        $poll.options = [...$poll.options, { ...option, votes: [] }];
      }
    });

    feathersApp.service("votes").on("created", (vote: IVote) => {
      if ($poll) {
        const option = $poll.options.find(
          (option: IOption) => option.id === vote.optionId
        );

        if (option) {
          option.votes.push(vote);

          // Force re-render of options
          $poll.options = $poll.options;
        }
      }
    });

    feathersApp.service("votes").on("removed", (vote: IVote) => {
      if ($poll) {
        const option = $poll.options.find(
          (option: IOption) => option.id === vote.optionId
        );

        if (option) {
          option.votes = option.votes.filter((v: IVote) => v.id !== vote.id);

          // Force re-render of options
          $poll.options = $poll.options;
        }
      }
    });

    feathersApp.hooks({
      error(context) {
        console.error(context.error);
        if (context.error.code === 500) {
          error = true;
        }
      },
    });

    const sessionJson = localStorage.getItem(pollId);
    if (sessionJson) {
      $session = JSON.parse(sessionJson);
    } else {
      $session = null;
    }

    // Initialize Feathers session
    if ($poll) {
      feathersApp.service("polls").get(pollId);
    }

    isHydrated = true;
  });

  const createPoll = async () => {
    const newPoll = {
      id: pollId,
      question: newQuestion,
    };
    await feathersApp.service("polls").create(newPoll);
    $poll = await feathersApp.service("polls").get(pollId);
  };
</script>

<svelte:head>
  <title>
    {$poll ? `${$poll.question} - Ninjavote` : "Ninjavote"}
  </title>
</svelte:head>

<main>
  {#if $poll !== null}
    {#if isHydrated}
      <EnterNameModal />
    {/if}

    {#if $session}
      <p>
        Poll joined as <b>{$session.nickname}</b>
      </p>
    {/if}

    <h1>{$poll.question}</h1>

    {#if sortedOptions.length === 0}
      <p>There are no options yet. Add some below!</p>
    {/if}

    {#each sortedOptions as option (option.id)}
      <PollOption {feathersApp} {option} />
    {/each}

    <button
      on:click={() => (showAddOptionModal = true)}
      id="add-option-button"
      class="button icon center"
    >
      <img src={AddIcon} alt="Plus icon" />
      <span>Add Option</span>
    </button>
  {:else}
    <form on:submit|preventDefault={createPoll}>
      <input
        type="text"
        bind:value={newQuestion}
        placeholder="Type your question here..."
        class="text-field new-poll-input"
      />
      <button class="button create-poll-button center">
        <img src={CheckIcon} alt="Confirm icon" />
        <span>Create Poll</span>
      </button>
    </form>
  {/if}

  <AddOptionModal
    show={showAddOptionModal}
    onClose={() => (showAddOptionModal = false)}
    {feathersApp}
  />
  <ErrorRefreshModal show={error} />
</main>

<style lang="scss">
  main {
    font-size: 16px;
    max-width: 600px;
    margin: 30px auto;
    padding: 0 5px;
  }

  h1 {
    font-weight: 700;
    margin-top: 10px;
  }

  .new-poll-input {
    margin: 50px 0 30px 0;
    padding: 0;
    text-align: center;
    border: none;
    border-radius: 0;
    font-size: 24px;
    font-weight: 500;
    caret-color: $accent-color-primary;
  }

  .create-poll-button {
    font-size: 18px;
    padding: 10px 20px;
  }

  #add-option-button {
    margin-top: 20px;
  }
</style>
