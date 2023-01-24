<script lang="ts">
  import { poll } from "$lib/store/pollStore";
  import { session } from "$lib/store/sessionStore";
  import Modal from "$lib/components/Modal.svelte";
  import type { IOption } from "$lib/types/poll";
  import type feathers from "@feathersjs/feathers";

  export let feathersApp: feathers.Application<unknown>;
  export let show: boolean;
  export let onClose: () => void;

  let optionText = "";
  let errorMessage = "";

  // Focus the input field when the modal is shown
  let inputElement: HTMLInputElement;
  $: show, inputElement?.focus();

  const addOption = async () => {
    if ($poll === null) {
      return;
    }

    // Verify that the option text is not empty
    if (optionText.trim() === "") {
      errorMessage = "The option can't be empty!";
      return;
    }

    // Check if the option already exists
    if (
      $poll.options.some(
        (option: IOption) =>
          option.text.trim().toLowerCase() === optionText.trim().toLowerCase()
      )
    ) {
      errorMessage = "This option already exists!";
      return;
    }

    const option = {
      pollId: $poll.id,
      text: optionText,
    };

    // Close the modal
    onClose();

    // Clear the input field
    optionText = "";

    // Save the new option
    const createdOption = await feathersApp.service("options").create(option);

    // Automatically select the new option
    feathersApp.service("votes").create({
      optionId: createdOption.id,
      voterId: $session?.voterId,
      voterSecret: $session?.voterSecret,
      name: $session?.nickname,
    });
  };
</script>

<main>
  {#if show}
    <Modal on:close={onClose} allowClose>
      <span slot="header">New option</span>

      <form on:submit|preventDefault={addOption}>
        <input
          bind:this={inputElement}
          type="text"
          class="text-field"
          bind:value={optionText}
          placeholder="Your option"
        />

        {#if errorMessage}
          <p class="error">{errorMessage}</p>
        {/if}

        <button class="button" style="float: right;">
          <span>Create option</span>
        </button>
      </form>
    </Modal>
  {/if}
</main>
