<template>
  <div class="enter-component">
    <button type="button" class="enter-component-button" @click="onClick">
      <span class="enter-component-button-text">重命名</span>
    </button>
  </div>
</template>

<script lang="ts">
import type { Ref } from "vue";
import type Provider from "@/provider/type";

import { inject, defineComponent } from "vue";

export default defineComponent({
  name: "EnterComponentBaidu",
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
  margin-right: 16px;
}

.enter-component-button {
  color: #fff;
  border: none;
  height: 32px;
  cursor: pointer;
  padding: 8px 24px;
  font-size: 14px;
  transition: var(--transition-all);
  line-height: 1;
  font-weight: 700;
  white-space: nowrap;
  border-radius: 16px;
  background-image: linear-gradient(
    135deg,
    var(--color-primary-400) 0%,
    var(--color-primary-600) 100%
  );
}
.enter-component-button:hover {
  background-image: linear-gradient(
    135deg,
    var(--color-primary-600) 0%,
    var(--color-primary-700) 100%
  );
}
.enter-component-button:active {
  background-image: linear-gradient(
    135deg,
    var(--color-primary-600) 0%,
    var(--color-primary-800) 100%
  );
}
.enter-component-button[disabled] {
  color: var(--color-primary-700);
  cursor: not-allowed;
  background-image: linear-gradient(
    135deg,
    var(--color-primary-100) 0%,
    var(--color-primary-300) 100%
  );
}
</style>
