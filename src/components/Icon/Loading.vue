<template>
  <svg
    class="icon"
    data-icon="loading"
    fill="currentColor"
    width="1em"
    height="1em"
    viewBox="0 0 50 50"
    focusable="false"
    aria-hidden="true"
  >
    <circle class="icon-path" r="20" cx="25" cy="25" fill="none"></circle>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "IconLoading",
});
</script>

<style scoped>
.icon {
  animation: spin 1s linear infinite;
}
.icon-path {
  stroke: var(--color-blue);
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-width: 0.1em;
  stroke-linecap: round;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
}

@keyframes spin {
  to {
    transform: rotate(1turn);
  }
}

@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }

  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}
</style>
