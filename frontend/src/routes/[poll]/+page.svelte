<script lang="ts">
  import type { Application } from "@feathersjs/feathers";
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
  import LoadingIcon from "$lib/icons/loading.svg";
  import AddIcon from "$lib/icons/add.svg";
  import "$lib/style/main.scss";
  import AddOptionModal from "./modals/AddOptionModal.svelte";

  // Get ID for poll to load
  const { params } = $page;
  const pollId = params.poll;

  let feathersApp: Application<unknown>;

  let isLoading = true;
  let error = false;
  let showAddOptionModal = false;

  let newQuestion = "";

  $: sortedOptions = $poll
    ? $poll.options
        .sort((a: IOption, b: IOption) => a.text.localeCompare(b.text))
        .sort((a: IOption, b: IOption) => b.votes.length - a.votes.length)
    : [];

  onMount(async () => {
    const API_URL = window.location.origin;

    // Initialize Feathers client
    const socket = io(API_URL);
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

    try {
      $poll = await feathersApp.service("polls").get(pollId);
    } catch (error) {
      $poll = null;
    } finally {
      isLoading = false;
    }
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

<main>
  {#if isLoading}
    <div class="loading-container">
      <img src={LoadingIcon} alt="Loading..." />
    </div>
  {:else if $poll !== null}
    <EnterNameModal />

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
    margin-top: 10px;
  }

  .loading-container {
    margin: 30px auto;

    img {
      display: block;
      margin: 0 auto;
      height: 64px;
    }
  }

  #add-option-button {
    margin-top: 20px;
  }
</style>
