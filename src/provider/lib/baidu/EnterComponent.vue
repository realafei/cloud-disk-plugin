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
  name: "EnterComponentBaidu",
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
<style scoped>
.enter-component {
  width: 58px;
  color: #636d7e;
  display: inline-block;
  position: relative;
  font-size: 11px;
  margin-top: 0;
  min-height: 60px;
  padding-top: 2px;
  margin-bottom: 1px;
  border-radius: 8px;
}
.enter-component:hover {
  background-color: #f1f3f8;
}
.enter-component-button {
  position: relative;
  text-align: center;
  background-color: transparent;
}
.enter-component-button-icon {
  display: block;
  font-size: 24px;
  margin-top: 6px;
}
.enter-component-button-text {
  display: block;
  overflow: hidden;
  max-width: 80px;
  margin-top: 4px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
