<template>
  <teleport to="body">
    <div v-if="providerRef" class="main-panel">
      <transition name="fade">
        <div
          v-if="providerRef.visible"
          class="main-panel-mask"
          @click="onMaskClick"
        ></div>
      </transition>
      <transition name="fade-bottom">
        <div v-if="providerRef.visible" class="main-panel-content">
          <div class="main-panel-content-header">
            <div class="main-panel-content-header-title">
              <span class="main-panel-content-header-title-content">
                批量重命名当前目录下所有文件
              </span>
              <a
                v-if="hasNewVersion"
                :href="updateUrl"
                target="_blank"
                class="main-panel-content-header-title-new-version"
              >
                发现新版本：{{ newVersion }} 点击更新
              </a>
              <span
                v-else
                class="main-panel-content-header-title-current-version"
              >
                当前版本：{{ currentVersion }}
              </span>
            </div>
            <form
              v-if="providerRef.replaceParams"
              class="main-panel-content-header-form"
            >
              <template
                v-if="providerRef.replaceParams.renameMode === 'series'"
              >
                <div class="main-panel-content-header-form-item">
                  <material-input
                    v-model="providerRef.replaceParams.title"
                    label="剧名"
                  ></material-input>
                </div>
                <div class="main-panel-content-header-form-item">
                  <material-input
                    v-model="providerRef.replaceParams.season"
                    label="季数"
                    type="number"
                  ></material-input>
                </div>
              </template>
              <template
                v-if="providerRef.replaceParams.renameMode === 'pattern'"
              >
                <div class="main-panel-content-header-form-item">
                  <material-input
                    v-model="providerRef.replaceParams.pattern"
                    label="正则"
                  ></material-input>
                </div>
                <div class="main-panel-content-header-form-item">
                  <material-input
                    v-model="providerRef.replaceParams.replace"
                    label="替换文本"
                  ></material-input>
                </div>
              </template>
            </form>
            <div class="main-panel-content-header-ctrl">
              <div class="main-panel-content-header-ctrl-option">
                <material-radio
                  v-model="providerRef.replaceParams.renameMode"
                  label="series"
                >
                  剧集模式
                </material-radio>
                <material-radio
                  v-model="providerRef.replaceParams.renameMode"
                  label="pattern"
                >
                  正则模式
                </material-radio>
                <material-checkbox
                  v-model="providerRef.replaceParams.autoEpisode"
                >
                  自动集数
                </material-checkbox>
              </div>
              <button
                class="main-panel-content-header-ctrl-reset-button"
                :disabled="providerRef.isLoading"
                @click="onResetClick"
              >
                重置
              </button>
              <button
                class="main-panel-content-header-ctrl-confirm-button"
                :disabled="!providerRef.shouldContinue || providerRef.isLoading"
                @click="onConfirmClick"
              >
                应用
              </button>
            </div>
          </div>
          <div class="main-panel-content-body">
            <ul class="main-panel-content-body-grid">
              <li
                class="main-panel-content-body-grid-item"
                :class="{
                  'is-error': providerRef.hasError,
                  'is-change': providerRef.hasChange,
                  'is-checked': !providerRef.hasUncheckedAll,
                }"
              >
                <div class="main-panel-content-body-grid-item-checkbox">
                  <material-checkbox
                    :model-value="providerRef.hasCheckedAll"
                    :indeterminate="
                      !providerRef.hasCheckedAll && !providerRef.hasUncheckedAll
                    "
                    @update:model-value="onCheckedAllUpdate"
                  ></material-checkbox>
                </div>
                <div class="main-panel-content-body-grid-item-old_file_name">
                  原文件名
                </div>
                <div class="main-panel-content-body-grid-item-right-arrow">
                  ⮕
                </div>
                <div class="main-panel-content-body-grid-item-new_file_name">
                  新文件名
                </div>
              </li>
              <li
                v-for="item in currentList"
                :key="item.id"
                class="main-panel-content-body-grid-item"
                :class="{
                  'is-error': item.isError,
                  'is-change': item.isChange,
                  'is-checked': item.isChecked,
                }"
              >
                <div class="main-panel-content-body-grid-item-checkbox">
                  <material-checkbox
                    :model-value="item.isChecked"
                    @update:model-value="onIsCheckUpdate(item, $event)"
                  ></material-checkbox>
                </div>
                <div
                  class="main-panel-content-body-grid-item-old_file_name"
                  :title="item.oldFileName"
                >
                  {{ item.oldFileName }}
                </div>
                <div class="main-panel-content-body-grid-item-right-arrow">
                  ⮕
                </div>
                <div
                  class="main-panel-content-body-grid-item-new_file_name"
                  :title="item.newFileName"
                >
                  {{ item.newFileName }}
                </div>
              </li>
            </ul>
          </div>
          <material-loading v-if="providerRef.isLoading"></material-loading>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script lang="ts">
import type { Ref } from "vue";
import type { Provider, IListItem } from "@/provider/type";

import { ref, inject, onMounted, onUnmounted, defineComponent } from "vue";
import MaterialInput from "@/components/Material/MaterialInput.vue";
import MaterialRadio from "@/components/Material/MaterialRadio.vue";
import MaterialLoading from "@/components/Material/MaterialLoading.vue";
import MaterialCheckbox from "@/components/Material/MaterialCheckbox.vue";
import useVersion from "@/utils/useVersion";

export default defineComponent({
  name: "MainPanel",
  components: {
    MaterialInput,
    MaterialRadio,
    MaterialLoading,
    MaterialCheckbox,
  },
  setup() {
    const { currentVersion, newVersion, hasNewVersion, updateUrl } =
      useVersion();

    const providerRef = inject<Ref<Provider>>("providerRef");

    const onMaskClick = () => {
      if (!providerRef?.value.isLoading) {
        providerRef?.value.setVisible(false);
      }
    };

    const onResetClick = () => {
      providerRef?.value.reset();
    };

    const onConfirmClick = () => {
      providerRef?.value.batchRename();
    };

    const onIsCheckUpdate = (item: IListItem, val: boolean) => {
      providerRef?.value.updateItemIsCheck(item, val);
    };

    const onCheckedAllUpdate = (val: boolean) => {
      providerRef?.value.updateCheckedAll(val);
    };

    const currentList = ref<IListItem[]>([]);
    const updateCurrentList = (val: IListItem[]) => {
      currentList.value = val;
    };

    onMounted(() => {
      providerRef?.value.onCurrentListUpdate(updateCurrentList);
    });

    onUnmounted(() => {
      providerRef?.value.offCurrentListUpdate(updateCurrentList);
    });

    return {
      currentVersion,
      newVersion,
      hasNewVersion,
      updateUrl,
      providerRef,
      currentList,
      onMaskClick,
      onResetClick,
      onConfirmClick,
      onIsCheckUpdate,
      onCheckedAllUpdate,
    };
  },
});
</script>

<style scoped>
.main-panel {
  top: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  display: flex;
  position: fixed;
  align-items: end;
  justify-content: center;
}
.main-panel:has(div) {
  height: 100vh;
}
.main-panel-mask {
  width: 100vw;
  height: 100vh;
  position: absolute;
  backdrop-filter: blur(5px);
}
.main-panel-content {
  z-index: 1;
  display: grid;
  padding: var(--gutter);
  grid-gap: var(--gutter);
  overflow: hidden;
  max-width: 100vw;
  min-width: 768px;
  min-height: 60vh;
  max-height: 90vh;
  box-sizing: border-box;
  box-shadow: var(--shadow);
  background-color: var(--color-white);
  grid-template-rows: auto 1fr;
  border-top-left-radius: var(--gutter);
  border-top-right-radius: var(--gutter);
}
.main-panel-content-header {
  padding: var(--gutter);
  border-radius: var(--gutter);
  background-color: var(--color-gray-100);
}
.main-panel-content-header-title {
  display: flex;
  align-items: top;
  justify-content: space-between;
}
.main-panel-content-header-title-content {
  font-size: 18px;
}
.main-panel-content-header-title-current-version {
  font-size: 12px;
}
.main-panel-content-header-title-new-version {
  color: var(--color-red);
  font-size: 12px;
}
.main-panel-content-header-form {
  display: grid;
  grid-gap: var(--gutter);
  grid-template-columns: 1fr 1fr;
}
.main-panel-content-header-ctrl {
  display: grid;
  grid-gap: var(--gutter);
  margin-top: var(--gutter);
  grid-template-columns: 1fr auto auto;
}
.main-panel-content-header-ctrl-option {
  display: flex;
  align-items: center;
}
.main-panel-content-header-ctrl-confirm-button {
  color: var(--color-primary-700);
  height: auto;
  padding: 8px 15px;
  transition: var(--transition-all);
  line-height: 1;
  border-color: transparent;
  border-radius: var(--gutter);
  background-color: transparent;
}
.main-panel-content-header-ctrl-confirm-button:hover {
  color: var(--color-primary-50);
  background-color: var(--color-primary-700);
}
.main-panel-content-header-ctrl-confirm-button[disabled] {
  color: var(--color-gray-500);
  cursor: not-allowed;
}
.main-panel-content-header-ctrl-confirm-button[disabled]:hover {
  color: var(--color-gray-700);
  background-color: var(--color-gray-100);
}
.main-panel-content-header-ctrl-reset-button {
  color: var(--color-gray-500);
  height: auto;
  padding: 8px 15px;
  transition: var(--transition-all);
  line-height: 1;
  border-color: transparent;
  border-radius: var(--gutter);
  background-color: transparent;
}
.main-panel-content-header-ctrl-reset-button:hover {
  color: var(--color-gray-50);
  background-color: var(--color-gray-300);
}
.main-panel-content-body {
  overflow: auto;
}
.main-panel-content-body-grid {
  display: grid;
  grid-gap: 10px;
  font-size: 12px;
  line-height: 1;
  grid-template-columns: auto minmax(200px, 1fr) auto minmax(200px, 1fr);
}
.main-panel-content-body-grid-item {
  display: contents;
  color: var(--color-gray);
}
.main-panel-content-body-grid-item.is-change {
  color: var(--color-gray-900);
}
.main-panel-content-body-grid-item.is-error {
  color: var(--color-red);
}
.main-panel-content-body-grid-item:not(.is-checked)
  .main-panel-content-body-grid-item-new_file_name {
  color: var(--color-gray-300);
}
</style>
