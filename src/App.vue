<template>
  <component :is="EnterComponent"></component>
  <main-panel></main-panel>
</template>

<script lang="ts">
import type { Ref } from "vue";
import type Provider from "@/provider/type";

import { computed, inject, defineComponent } from "vue";
import MainPanel from "@/components/MainPanel.vue";

export default defineComponent({
  name: "App",
  components: {
    MainPanel,
  },
  setup() {
    const providerRef = inject<Ref<Provider>>("providerRef");
    const EnterComponent = computed(() => providerRef?.value?.EnterComponent());

    return {
      EnterComponent,
    };
  },
});
</script>
