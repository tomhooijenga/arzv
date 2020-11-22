<template>
  <div class="spinner uk-margin-auto uk-margin-auto-vertical"></div>
</template>

<style scoped>
.spinner {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: text-bottom;
  border: 0.25em solid #1e87f0;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border 0.75s linear infinite;
}

@keyframes spinner-border {
  to {
    transform: rotate(360deg);
  }
}
</style>
