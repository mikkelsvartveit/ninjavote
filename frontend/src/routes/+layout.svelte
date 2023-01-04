<script>
  import "$lib/style/main.scss";
  import LoadingIcon from "$lib/icons/loading.svg";
  import CloseIcon from "$lib/icons/close.svg";
  import CheckboxIcon from "$lib/icons/check.svg";
</script>

<svelte:head>
  <link rel="preload" as="image" href={LoadingIcon} />
  <link rel="preload" as="image" href={CloseIcon} />
  <link rel="preload" as="image" href={CheckboxIcon} />
</svelte:head>

<slot />

<style lang="scss">
</style>
