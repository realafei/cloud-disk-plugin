<template>
  <teleport to="body">
    <div v-if="providerRef" class="rename-panel">
      <transition name="fade">
        <div
          v-if="providerRef.visible"
          class="rename-panel-mask"
          @click="onMaskClick"
        ></div>
      </transition>
      <transition name="fade-bottom">
        <div v-if="providerRef.visible" class="rename-panel-container">
          <div class="rename-panel-container-content">
            <div class="rename-panel-container-content-header">
              <rename-control></rename-control>
            </div>
            <div class="rename-panel-container-content-body">
              <rename-preview></rename-preview>
            </div>
            <material-loading v-if="providerRef.isLoading"></material-loading>
          </div>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script lang="ts">
import type { Ref } from "vue";
import type { Provider } from "@/provider/type";

import { inject, defineComponent } from "vue";
import RenameControl from "@/components/RenameControl.vue";
import RenamePreview from "@/components/RenamePreview.vue";
import MaterialLoading from "@/components/Material/MaterialLoading.vue";

export default defineComponent({
  name: "RenamePanel",
  components: {
    RenameControl,
    RenamePreview,
    MaterialLoading,
  },
  setup() {
    const providerRef = inject<Ref<Provider>>("providerRef");

    const onMaskClick = () => {
      if (!providerRef?.value.isLoading) {
        providerRef?.value.setVisible(false);
      }
    };

    return {
      providerRef,
      onMaskClick,
    };
  },
});
</script>

<style scoped>
.rename-panel {
  top: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  display: flex;
  position: fixed;
  font-size: var(--font-size);
  align-items: end;
  justify-content: center;
}
.rename-panel:has(.rename-panel-container) {
  height: 100vh;
}
.rename-panel-mask {
  width: 100vw;
  height: 100vh;
  position: absolute;
  backdrop-filter: blur(calc(var(--gutter) / 2));
}
.rename-panel-container {
  z-index: 1;
}
.rename-panel-container-content {
  display: grid;
  padding: var(--gutter);
  grid-gap: var(--gutter);
  overflow: hidden;
  max-width: 100vw;
  min-width: 33vw;
  max-height: 90vh;
  min-height: 60vh;
  box-sizing: border-box;
  box-shadow: var(--box-shadow-around);
  transition: box-shadow var(--transition-default);
  background-color: var(--color-white);
  grid-template-rows: auto minmax(200px, 1fr);
  border-top-left-radius: var(--gutter);
  border-top-right-radius: var(--gutter);
}
.rename-panel-container-content:hover {
  box-shadow: var(--box-shadow-around-hover);
}
</style>
