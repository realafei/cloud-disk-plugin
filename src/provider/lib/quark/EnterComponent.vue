<template>
  <div class="enter-component">
    <button type="button" class="enter-component-button" @click="onClick">
      <span class="enter-component-button-icon">
        <icon-edit-circle-outlined></icon-edit-circle-outlined>
      </span>
      <span class="enter-component-button-text">重命名</span>
    </button>
  </div>
</template>

<script lang="ts">
import type { Ref } from "vue";
import type Provider from "@/provider/type";

import { inject, defineComponent } from "vue";
import IconEditCircleOutlined from "@/components/Icon/EditCircleOutlined.vue";

export default defineComponent({
  name: "EnterComponentQuark",
  components: {
    IconEditCircleOutlined,
  },
  setup() {
    const providerRef = inject<Ref<Provider>>("providerRef");
    const onClick = () => {
      providerRef?.value.setVisible(true);
    };

    return {
      onClick,
    };
  },
});
</script>

<style>
#ice-container
  .section-main
  > .section-header.list-header
  > .btn-operate
  > .btn-main {
  display: flex;
  align-items: center;
}
</style>

<style scoped>
.enter-component {
  margin-right: 12px;
}
.enter-component-button {
  color: #52565e;
  cursor: pointer;
  height: 36px;
  border: 1px solid #ddd;
  padding: 0 14px;
  outline: none;
  display: inline-block;
  position: relative;
  font-size: 14px;
  text-align: center;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  font-weight: 700;
  user-select: none;
  line-height: 1.499;
  white-space: nowrap;
  touch-action: manipulation;
  border-radius: 8px;
  background-image: none;
  background-color: transparent;
}
.enter-component-button-icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  font-size: 16px;
  margin-right: 3px;
  vertical-align: -0.2em;
}
.enter-component-button-text {
  display: inline-block;
  transition: margin-left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  pointer-events: none;
}
</style>
