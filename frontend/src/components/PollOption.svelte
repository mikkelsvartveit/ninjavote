<script lang="ts">
  import type feathers from "@feathersjs/feathers";
  import { Button, Modal, Dialog, TextField, Checkbox } from "attractions";
  import type { IOption, IVote, IVoterSession } from "src/types/poll";

  export let feathersApp: feathers.Application<any>;
  export let session: IVoterSession | null;
  export let option: IOption;
  export let numberOfVoters: number;

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
    <Checkbox
      round
      value={String(option.id)}
      checked={isSelected(option)}
      on:change={() => toggleOption(option)}
    >
      <span class="checkbox-label">{option.text}</span>
    </Checkbox>

    <div
      class="fraction-indicator"
      style={`width: ${(option.votes.length / numberOfVoters) * 100}%`}
    />
  </div>

  <div class="fraction-indicator" />
</main>

<style lang="scss">
  .option-container {
    position: relative;
    box-shadow: inset 0px 0px 0px 1px #ccc;
    border-radius: 5px;
    margin: 8px 0;
    padding: 0 10px;

    &.selected {
      box-shadow: inset 0px 0px 0px 2px #efaf00;
    }

    &:hover {
      background-color: #f7f7f7;
    }

    .checkbox-label {
      margin-left: 10px;
      padding: 16px 0;
    }

    .fraction-indicator {
      position: absolute;
      top: 0;
      left: 0;
      width: 50%;
      height: 100%;
      background-color: #efaf00;
      opacity: 0.07;
      z-index: -1;
    }
  }
</style>
