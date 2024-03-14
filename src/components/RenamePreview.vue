<template>
  <div v-if="providerRef" class="rename-preview">
    <div class="rename-preview-status">
      <span
        v-for="item in providerRef.statusList"
        :key="item.message"
        class="rename-preview-status-item"
        :class="item.className"
      >
        {{ item.message }}
      </span>
    </div>
    <div class="rename-preview-content">
      <ul class="rename-preview-grid rename-preview-grid-header">
        <li
          class="rename-preview-grid-item"
          :class="{
            'is-error': providerRef.hasError,
            'is-change': providerRef.hasChange,
            'is-checked': !providerRef.hasUncheckedAll,
          }"
        >
          <div class="rename-preview-grid-item-checkbox">
            <material-checkbox
              :model-value="providerRef.hasCheckedAll"
              :indeterminate="
                !providerRef.hasCheckedAll && !providerRef.hasUncheckedAll
              "
              @update:model-value="onCheckedAllUpdate"
            ></material-checkbox>
          </div>
          <div class="rename-preview-grid-item-old-file-name">原文件名</div>
          <div class="rename-preview-grid-item-right-arrow">⮕</div>
          <div class="rename-preview-grid-item-new-file-name">新文件名</div>
          <div class="rename-preview-grid-item-new-file-status">
            <icon-frown-outlined
              v-if="providerRef.hasError"
            ></icon-frown-outlined>
            <icon-meh-outlined
              v-else-if="!providerRef.hasChange"
            ></icon-meh-outlined>
            <icon-smile-outlined
              v-else-if="providerRef.shouldContinue"
            ></icon-smile-outlined>
          </div>
        </li>
      </ul>
      <ul class="rename-preview-grid rename-preview-grid-body">
        <li
          v-for="item in currentList"
          :key="item.id"
          class="rename-preview-grid-item"
          :class="{
            'is-error': item.isError,
            'is-change': item.isChange,
            'is-checked': item.isChecked,
          }"
        >
          <div class="rename-preview-grid-item-checkbox">
            <material-checkbox
              :model-value="item.isChecked"
              :readonly="item.status !== 'none'"
              @update:model-value="onItemIsCheckedUpdate(item, $event)"
            ></material-checkbox>
          </div>
          <div
            class="rename-preview-grid-item-old-file-name"
            :title="item.oldFileName"
          >
            {{ item.oldFileName }}
          </div>
          <div class="rename-preview-grid-item-right-arrow">⮕</div>
          <div
            class="rename-preview-grid-item-new-file-name"
            :title="item.newFileName"
          >
            {{ item.newFileName }}
          </div>
          <div class="rename-preview-grid-item-new-file-status">
            <!-- <template v-if="item.status === 'none'"></template> -->
            <icon-check-circle-outlined
              v-if="item.status === 'ready'"
            ></icon-check-circle-outlined>
            <icon-loading v-else-if="item.status === 'pending'"></icon-loading>
            <icon-check-outlined
              v-else-if="item.status === 'success'"
            ></icon-check-outlined>
            <icon-close-outlined
              v-else-if="item.status === 'fail'"
            ></icon-close-outlined>
          </div>
        </li>
      </ul>
    </div>

    <material-loading v-if="providerRef.isPreviewLoading"></material-loading>
  </div>
</template>

<script lang="ts">
import type { Ref } from "vue";
import type { Provider, IListItem } from "@/provider/type";

import { ref, inject, onMounted, onUnmounted, defineComponent } from "vue";
import IconLoading from "@/components/Icon/Loading.vue";
import IconMehOutlined from "@/components/Icon/MehOutlined.vue";
import IconSmileOutlined from "@/components/Icon/SmileOutlined.vue";
import IconFrownOutlined from "@/components/Icon/FrownOutlined.vue";
import IconCheckOutlined from "@/components/Icon/CheckOutlined.vue";
import IconCloseOutlined from "@/components/Icon/CloseOutlined.vue";
import MaterialLoading from "@/components/Material/MaterialLoading.vue";
import MaterialCheckbox from "@/components/Material/MaterialCheckbox.vue";
import IconCheckCircleOutlined from "@/components/Icon/CheckCircleOutlined.vue";

export default defineComponent({
  name: "RenamePreview",
  components: {
    IconLoading,
    IconMehOutlined,
    MaterialLoading,
    MaterialCheckbox,
    IconSmileOutlined,
    IconFrownOutlined,
    IconCheckOutlined,
    IconCloseOutlined,
    IconCheckCircleOutlined,
  },
  setup() {
    const providerRef = inject<Ref<Provider>>("providerRef");

    const currentList = ref<IListItem[]>(providerRef?.value.currentList || []);

    const onCurrentListUpdate = (val: IListItem[]) => {
      currentList.value = val;
    };

    const onCheckedAllUpdate = (val: boolean) => {
      providerRef?.value.updateCheckedAll(val);
    };

    const onItemIsCheckedUpdate = (item: IListItem, val: boolean) => {
      providerRef?.value.updateItemIsCheck(item, val);
    };

    onMounted(() => {
      providerRef?.value.onCurrentListUpdate(onCurrentListUpdate);
    });

    onUnmounted(() => {
      providerRef?.value.offCurrentListUpdate(onCurrentListUpdate);
    });

    return {
      providerRef,
      currentList,
      onCheckedAllUpdate,
      onItemIsCheckedUpdate,
    };
  },
});
</script>

<style scoped>
.rename-preview {
  display: grid;
  grid-gap: var(--gutter);
  grid-template-rows: auto minmax(200px, 1fr);
}
.rename-preview-status {
  display: flex;
  flex-wrap: wrap;
  font-size: var(--font-size-sm);
  align-items: center;
}
.rename-preview-status-item {
  margin: calc(var(--gutter) / 2);
}
.rename-preview-status-item.blue {
  color: var(--color-blue);
}
.rename-preview-status-item.red {
  color: var(--color-red);
}
.rename-preview-status-item.gray {
  color: var(--color-gray);
}
.rename-preview-status-item.green {
  color: var(--color-green);
}
.rename-preview-status-item.yellow {
  color: var(--color-yellow);
}
.rename-preview-content {
  overflow: auto;
  position: relative;
  max-height: 50vh;
}
.rename-preview-grid {
  display: grid;
  grid-gap: var(--gutter);
  font-size: var(--font-size-sm);
  line-height: 1;
  grid-template-columns: auto minmax(200px, 1fr) auto minmax(200px, 1fr) 2rem;
}
.rename-preview-grid-header {
  top: 0;
  z-index: 1;
  position: sticky;
  margin-bottom: var(--gutter);
  background-color: var(--color-white);
}
.rename-preview-grid-item {
  color: var(--color-gray-300);
  display: contents;
  transition: color var(--transition-default);
}
.rename-preview-grid-item.is-checked {
  color: var(--color-gray-600);
}
.rename-preview-grid-item.is-checked.is-change {
  color: var(--color-gray-900);
}
.rename-preview-grid-item.is-checked.is-error {
  color: var(--color-red);
}
.rename-preview-grid-item-old-file-name,
.rename-preview-grid-item-new-file-name,
.rename-preview-grid-item-new-file-status {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.rename-preview-grid-item-new-file-status {
  display: flex;
  text-align: right;
  align-items: center;
  padding-right: calc(var(--gutter) / 2);
  justify-content: flex-end;
}
</style>
