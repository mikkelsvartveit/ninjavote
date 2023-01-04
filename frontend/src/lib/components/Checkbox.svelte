<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import checkIcon from "$lib/icons/check.svg";

  const dispatch = createEventDispatcher();

  export let checked: boolean;

  let isChecked = checked;

  // If the checked prop changes, update the internal state
  $: checked, (isChecked = checked);

  const toggle = () => {
    isChecked = !isChecked;
    dispatch("change", isChecked);
  };
</script>

<button on:click={toggle} class="checkbox-container">
  <div class="checkbox-outer">
    {#if isChecked}
      <span class="checkbox-checked">
        <img src={checkIcon} alt="checked" />
      </span>
    {:else}
      <span class="checkbox-unchecked" />
    {/if}
  </div>

  <slot />
</button>

<style lang="scss">
  .checkbox-container {
    font-size: 16px;
    display: block;
    width: 100%;
    background: none;
    border: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    cursor: pointer;

    &:hover {
      .checkbox-outer {
        background-color: RGBA(0, 0, 0, 0.05);
      }
    }
  }

  .checkbox-outer {
    width: 36px;
    height: 36px;
    padding: 5px;
    box-sizing: border-box;
    border-radius: 100px;
    margin: 0;
    transition-duration: 0.1s;
  }

  .checkbox-unchecked {
    display: inline-block;
    width: 100%;
    height: 100%;
    border: 2px solid #ddd;
    box-sizing: border-box;
    border-radius: 100px;
  }

  .checkbox-checked {
    background-color: $accent-color-primary;
    display: inline-block;
    width: 100%;
    height: 100%;
    border-radius: 100px;

    img {
      width: 100%;
      height: 100%;
      padding: 4px;
      box-sizing: border-box;
    }
  }
</style>
