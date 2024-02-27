<template>
  <div class="material-loading">
    <!-- <div class="material-loading-spinner"></div> -->
    <svg class="material-loading-spinner" viewBox="0 0 50 50">
      <circle
        class="material-loading-spinner-path"
        cx="25"
        cy="25"
        r="20"
        fill="none"
      ></circle>
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MaterialLoading",
});
</script>

<style>
*:has(> .material-loading) {
  position: relative;
}
</style>
<style scoped>
.material-loading {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  z-index: 2000;
  display: flex;
  position: absolute;
  transition: opacity var(--el-transition-default);
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
}
.material-loading-spinner {
  width: 2em;
  height: 2em;
  animation: spin 1s linear infinite;
}
.material-loading-spinner-path {
  stroke: var(--color-primary);
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-width: 0.2em;
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
