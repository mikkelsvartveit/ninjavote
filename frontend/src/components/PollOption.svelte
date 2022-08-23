<script lang="ts">
  import type feathers from "@feathersjs/feathers";
  import { Checkbox } from "attractions";
  import type { IOption, IVote, IVoterSession } from "src/types/poll";
  import VoterIcon from "./icons/VoterIcon.svelte";

  export let feathersApp: feathers.Application<any>;
  export let session: IVoterSession | null;
  export let option: IOption;
  export let numberOfVoters: number;
  export let openVotersModal: () => void;

  const getVoteIdFromOption = (option: IOption) =>
    option.votes.find((vote: IVote) => vote.voterId === session?.voterId)?.id;

  const isSelected = (option: IOption) =>
    option.votes.some((vote: IVote) => vote.voterId === session?.voterId);

  const toggleOption = (option: IOption) => {
    if (isSelected(option)) {
      feathersApp.service("votes").remove(getVoteIdFromOption(option), {
        query: {
          voterId: session?.voterId,
          voterSecret: session?.voterSecret,
        },
      });
    } else {
      feathersApp.service("votes").create({
        optionId: option.id,
        voterId: session?.voterId,
        voterSecret: session?.voterSecret,
        name: session?.nickname,
      });
    }
  };
</script>

<main>
  <div class="option-container" class:selected={isSelected(option)}>
    <div class="checkbox-container">
      <Checkbox
        round
        value={String(option.id)}
        checked={isSelected(option)}
        on:change={() => toggleOption(option)}
      >
        <span class="checkbox-label">{option.text}</span>
      </Checkbox>
    </div>

    <div class="votes" on:click={openVotersModal}>
      <!-- Show icons for the first three votes -->
      {#each { length: 3 } as _, index}
        {#if index < option.votes.length}
          <VoterIcon name={option.votes[index].name} />
        {/if}
      {/each}

      <!-- If more than three votes, show a number too -->
      {#if option.votes.length > 3}
        <span class="additional-voters-count">+{option.votes.length - 3}</span>
      {/if}
    </div>

    <div
      class="fraction-indicator"
      style={`width: ${(option.votes.length / numberOfVoters) * 100}%`}
    />
  </div>

  <div class="fraction-indicator" />
</main>

<style lang="scss">
  @use "../style/variables";

  .option-container {
    display: flex;
    justify-content: space-between;
    position: relative;
    box-shadow: inset 0px 0px 0px 1px #ccc;
    border-radius: 5px;
    margin: 8px 0;
    padding: 0 10px;

    &.selected {
      box-shadow: inset 0px 0px 0px 2px variables.$accent-color-primary;
    }

    * {
      // Fix for the checkbox being squeezed when text overflows
      flex-shrink: 1000;
    }

    .checkbox-container {
      flex-grow: 1;
      min-width: 0;

      .checkbox-label {
        margin-left: 10px;
        padding: 16px 0;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .votes {
      display: flex;
      align-items: center;
      padding-left: 10px;
      cursor: pointer;

      .additional-voters-count {
        margin-left: 5px;
        color: #888;
        font-size: 16px;
      }
    }

    .fraction-indicator {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background-color: variables.$accent-color-primary;
      opacity: 0.07;
      z-index: -1;
    }
  }
</style>
