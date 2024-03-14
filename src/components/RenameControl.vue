<template>
  <div v-if="providerRef" class="rename-control">
    <div class="rename-control-header">
      <span class="rename-control-header-content">
        批量重命名当前目录下所有文件
      </span>
      <a
        v-if="hasNewVersion"
        :href="updateUrl"
        target="_blank"
        class="rename-control-header-new-version"
      >
        发现新版本：{{ newVersion }} 点击更新
      </a>
      <span v-else class="rename-control-header-current-version">
        当前版本：{{ currentVersion }}
      </span>
    </div>
    <div v-if="providerRef.replaceParams" class="rename-control-body">
      <template v-if="providerRef.replaceParams.renameMode === 'series'">
        <div class="rename-control-body-item">
          <material-input
            v-model="providerRef.replaceParams.title"
            label="剧名"
            :disabled="isDisabled"
          ></material-input>
        </div>
        <div class="rename-control-body-item">
          <material-input
            v-model="providerRef.replaceParams.season"
            label="季数"
            type="number"
            :disabled="isDisabled"
          ></material-input>
        </div>
      </template>
      <template v-if="providerRef.replaceParams.renameMode === 'pattern'">
        <div class="rename-control-body-item">
          <material-input
            v-model="providerRef.replaceParams.pattern"
            label="正则"
            :disabled="isDisabled"
          ></material-input>
        </div>
        <div class="rename-control-body-item">
          <material-input
            v-model="providerRef.replaceParams.replace"
            label="替换文本"
            :disabled="isDisabled"
          ></material-input>
        </div>
      </template>
    </div>
    <div class="rename-control-footer">
      <div class="rename-control-footer-option">
        <material-radio
          v-model="providerRef.replaceParams.renameMode"
          label="series"
          :disabled="isDisabled"
        >
          剧集模式
        </material-radio>
        <material-radio
          v-model="providerRef.replaceParams.renameMode"
          label="pattern"
          :disabled="isDisabled"
        >
          正则模式
        </material-radio>
        <material-checkbox
          v-model="providerRef.replaceParams.autoEpisode"
          :disabled="isDisabled"
        >
          自动集数
        </material-checkbox>
      </div>
      <button
        class="rename-control-footer-button reset"
        :disabled="isDisabled"
        @click="onResetClick"
      >
        重置
      </button>
      <button
        class="rename-control-footer-button confirm"
        :disabled="!providerRef.shouldContinue || isDisabled"
        @click="onConfirmClick"
      >
        应用
      </button>
    </div>

    <material-loading v-if="providerRef.isControlLoading"></material-loading>
  </div>
</template>

<script lang="ts">
import type { Ref } from "vue";
import type { Provider } from "@/provider/type";
import type { IVersion } from "@/utils/useVersion";

import { inject, computed, defineComponent } from "vue";
import MaterialInput from "@/components/Material/MaterialInput.vue";
import MaterialRadio from "@/components/Material/MaterialRadio.vue";
import MaterialLoading from "@/components/Material/MaterialLoading.vue";
import MaterialCheckbox from "@/components/Material/MaterialCheckbox.vue";

export default defineComponent({
  name: "RenameControl",
  components: {
    MaterialInput,
    MaterialRadio,
    MaterialLoading,
    MaterialCheckbox,
  },
  setup() {
    const version = inject<IVersion>("version");

    const providerRef = inject<Ref<Provider>>("providerRef");

    const isDisabled = computed(
      () =>
        providerRef?.value.replaceParamsDisabled || providerRef?.value.isLoading
    );

    const onResetClick = () => {
      providerRef?.value.reset();
    };

    const onConfirmClick = () => {
      providerRef?.value.batchRename();
    };

    return {
      ...version,
      providerRef,
      isDisabled,
      onResetClick,
      onConfirmClick,
    };
  },
});
</script>

<style scoped>
.rename-control {
  padding: var(--gutter);
  background: linear-gradient(
    180deg,
    var(--color-gray-50) 0%,
    var(--color-gray-100) 100%
  );
  box-shadow: var(--box-shadow-md);
  transition: box-shadow var(--transition-default);
  border-radius: var(--gutter);
}
.rename-control:hover {
  box-shadow: var(--box-shadow-xl);
}
.rename-control-header {
  display: flex;
  align-items: top;
  justify-content: space-between;
}
.rename-control-header-content {
  font-size: var(--font-size-lg);
}
.rename-control-header-current-version {
  font-size: var(--font-size-xs);
}
.rename-control-header-new-version {
  color: var(--color-red);
  font-size: var(--font-size-xs);
}
.rename-control-body {
  display: grid;
  grid-gap: var(--gutter);
  align-items: end;
  grid-template-columns: 1fr 1fr;
}
.rename-control-footer {
  display: grid;
  grid-gap: var(--gutter);
  margin-top: var(--gutter);
  grid-template-columns: 1fr auto auto;
}
.rename-control-footer-option {
  display: flex;
  align-items: center;
}
.rename-control-footer-button {
  border: none;
  cursor: pointer;
  transition: var(--transition-all);
  line-height: 1;
  background-color: transparent;
}
.rename-control-footer-button.reset {
  color: var(--color-gray-900);
}
.rename-control-footer-button.reset:hover {
  color: var(--color-gray-700);
}
.rename-control-footer-button.confirm {
  color: var(--color-blue);
}
.rename-control-footer-button.confirm:hover {
  color: var(--color-blue-700);
}
.rename-control-footer-button[disabled] {
  color: var(--color-gray-300);
  cursor: not-allowed;
}
.rename-control-footer-button[disabled]:hover {
  color: var(--color-gray-400);
}
</style>
