<script lang="ts">
  import type { Application } from "@feathersjs/feathers";
  import feathers from "@feathersjs/client";
  import socketio from "@feathersjs/socketio-client";
  import io from "socket.io-client";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { Button, Loading } from "attractions";
  import type { IOption, IVote } from "$/types/poll";
  import PollOption from "$/components/PollOption.svelte";
  import EnterNameModal from "$/components/modals/EnterNameModal.svelte";
  import { poll } from "$/store/pollStore";
  import { session } from "$/store/sessionStore";

  // Get ID for poll to load
  const { params } = $page;
  const pollId = params.poll;

  let feathersApp: Application<any>;

  let isLoading = true;

  let newQuestion = "";
  let newOption = "";

  $: sortedOptions = $poll
    ? $poll.options
        .sort((a: IOption, b: IOption) => a.text.localeCompare(b.text))
        .sort((a: IOption, b: IOption) => b.votes.length - a.votes.length)
    : [];

  onMount(async () => {
    const API_URL = `http://${window.location.hostname}:3030/`;

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
  {#if isLoading}
    <div class="loading-container">
      <Loading />
    </div>
  {:else}
    <EnterNameModal />

    {#if $poll !== null}
      <h1>{$poll.question}</h1>

      {#if $session}
        <p>Poll joined as <b>{$session.nickname}</b></p>
      {/if}

      {#each sortedOptions as option (option.id)}
        <PollOption {feathersApp} {option} />
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

  .loading-container {
    margin: 50px auto;
    font-size: 32px;
  }
</style>
