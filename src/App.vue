<template>
  <transition name="fade">
    <component v-if="EnterComponent" :is="EnterComponent"></component>
    <div v-else></div>
  </transition>
  <rename-panel></rename-panel>
</template>

<script lang="ts">
import type { Ref } from "vue";
import type Provider from "@/provider/interface";

import { inject, computed, defineComponent } from "vue";
import RenamePanel from "@/components/RenamePanel.vue";

export default defineComponent({
  name: "App",
  components: {
    RenamePanel,
  },
  setup() {
    const providerRef = inject<Ref<Provider>>("providerRef");

    const EnterComponent = computed(() => providerRef?.value?.EnterComponent?.());

    return {
      EnterComponent,
    };
  },
});
</script>
