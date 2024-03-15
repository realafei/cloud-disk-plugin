<template>
  <label
    class="material-input"
    :class="{
      'is-focus': isFocus,
      'is-active': isActive,
      'is-disabled': disabled,
    }"
  >
    <div v-if="label" class="material-input-label">{{ label }}</div>
    <input
      v-if="type !== 'textarea'"
      v-model="computedValue"
      ref="inputRef"
      class="material-input-input"
      :type="type"
      :value="modelValue"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="computedPlaceholder"
      @blur="onInputBlur"
      @focus="onInputFocus"
    />
    <textarea
      v-else
      v-model="computedValue"
      ref="textareaRef"
      rows="1"
      class="material-input-textarea"
      :style="textareaStyle"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="computedPlaceholder"
      @blur="onTextareaBlur"
      @focus="onTextareaFocus"
    ></textarea>
  </label>
</template>

<script lang="ts">
import {
  ref,
  watch,
  computed,
  nextTick,
  onMounted,
  defineComponent,
} from "vue";
import { isEmpty } from "@/utils/is";

export default defineComponent({
  name: "MaterialInput",
  props: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "textarea",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const computedValue = computed({
      get: () => props.modelValue,
      set: (val) => {
        if (!props.disabled && !props.readonly) {
          emit("update:modelValue", val);
        }
      },
    });
    const computedPlaceholder = computed(() =>
      props.label ? "" : props.placeholder
    );

    const isFocus = ref(false);
    const isActive = computed(
      () => !isEmpty(props.modelValue) || isFocus.value
    );

    const inputRef = ref<HTMLInputElement>();
    const textareaRef = ref<HTMLTextAreaElement>();
    const textareaStyle = ref<{ height?: string }>({});

    const onInputBlur = () => {
      isFocus.value = false;
    };
    const onInputFocus = () => {
      isFocus.value = true;
    };

    const onTextareaBlur = () => {
      isFocus.value = false;
      calcTextareaStyle();
    };
    const onTextareaFocus = () => {
      isFocus.value = true;
      calcTextareaStyle();
    };
    const calcTextareaStyle = () => {
      textareaStyle.value.height = "auto";
      nextTick(() => {
        textareaStyle.value.height = textareaRef.value?.value
          ? textareaRef.value.scrollHeight + "px"
          : "auto";
      });
    };

    watch(
      () => [props.type, props.modelValue],
      ([_type]) => {
        if (_type === "textarea") {
          calcTextareaStyle();
        }
      }
    );

    onMounted(() => {
      if (props.type === "textarea") {
        calcTextareaStyle();
      }
    });

    return {
      computedValue,
      computedPlaceholder,
      isFocus,
      isActive,
      inputRef,
      textareaRef,
      textareaStyle,
      onInputBlur,
      onInputFocus,
      onTextareaBlur,
      onTextareaFocus,
    };
  },
});
</script>

<style scoped>
.material-input {
  --material-input-size: 0.4em;
  --material-label-size: 0.8em;
  color: var(--color-gray);
  display: flex;
  position: relative;
  font-size: inherit;
  box-sizing: border-box;
  margin-top: var(--material-input-size);
  padding-top: calc(var(--material-input-size) + var(--material-label-size));
  padding-bottom: var(--material-input-size);
  margin-bottom: var(--material-input-size);
  border-bottom: 1px solid var(--color-gray);
  background-color: transparent;
}
.material-input.is-focus {
  border-bottom-color: var(--color-blue);
}
.material-input-input,
.material-input-textarea {
  color: var(--color-gray-700);
  width: 100%;
  outline: none;
  font-size: inherit;
  min-height: calc(var(--material-input-size) + 1em);
  transition: border-bottom-color var(--transition-default);
  box-sizing: content-box;
  line-height: calc(var(--material-input-size) + 1em);
  background-color: transparent;
  border-block-end-width: 0;
  border-inline-end-width: 0;
  border-block-start-width: 0;
  border-inline-start-width: 0;
}
.material-input.is-focus .material-input-input,
.material-input.is-focus .material-input-textarea {
  border-bottom-color: var(--color-blue);
  border-block-end-color: var(--color-blue);
}
.material-input.is-disabled .material-input-input,
.material-input.is-disabled .material-input-textarea {
  color: var(--color-gray);
}
.material-input-label {
  top: calc(var(--material-label-size) + var(--material-input-size) * 1.5);
  left: calc(var(--material-input-size) * 2);
  color: var(--color-gray-700);
  position: absolute;
  transition:
    top var(--transition-default),
    left var(--transition-default),
    color var(--transition-default),
    font-size var(--transition-default);
  line-height: 1;
  background-color: transparent;
}
.material-input.is-active .material-input-label {
  top: 0;
  left: 0;
  color: var(--color-gray-900);
  font-size: var(--material-label-size);
}
.material-input.is-focus .material-input-label {
  color: var(--color-blue);
}
.material-input.is-disabled .material-input-label {
  color: var(--color-gray-300);
}
</style>
