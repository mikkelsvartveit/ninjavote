<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import closeIcon from "$lib/icons/close.svg";

  export let allowClose = false;

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  const requestClose = () => {
    if (allowClose) {
      close();
    }
  };
</script>

<button class="modal-background" on:click={requestClose} />

<div class="modal">
  <div class="header">
    <h2 class="header-text">
      <slot name="header" />
    </h2>

    {#if allowClose}
      <button class="close-button" on:click={requestClose}>
        <img alt="close" src={closeIcon} />
      </button>
    {/if}
  </div>
  <slot />
</div>

<style lang="scss">
  .modal-background {
    border: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
  }

  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 90vw;
    background-color: white;
    border-radius: 6px;
    padding: 20px;
    z-index: 101;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .header-text {
      margin: 0;
    }
  }

  .close-button {
    background: none;
    position: relative;
    right: -10px;
    padding: 6px;
    border: none;
    transition-duration: 0.1s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
      border-radius: 100px;
    }

    img {
      display: block;
      width: 28px;
      height: 28px;
      /* https://codepen.io/sosuke/pen/Pjoqqp */
      filter: invert(63%) sepia(0%) saturate(690%) hue-rotate(136deg)
        brightness(86%) contrast(83%);
    }
  }
</style>
