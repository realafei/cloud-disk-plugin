<template>
  <div class="material-loading">
    <icon-loading class="material-loading-icon"></icon-loading>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import IconLoading from "@/components/Icon/Loading.vue";

export default defineComponent({
  name: "MaterialLoading",
  components: {
    IconLoading,
  },
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
.material-loading-icon {
  font-size: calc(var(--font-size) * 2);
}
</style>
