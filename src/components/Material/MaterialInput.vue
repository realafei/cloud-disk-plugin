<template>
  <label
    class="material-input"
    :class="{ 'is-focus': isFocus, 'is-active': isActive }"
  >
    <div v-if="label" class="material-input_label">{{ label }}</div>
    <input
      v-if="type !== 'textarea'"
      v-model="computedValue"
      ref="inputRef"
      class="material-input_input"
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
      class="material-input_textarea"
      rows="1"
      :style="textareaStyle"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="computedPlaceholder"
      @blur="onTextareaBlur"
      @focus="onTextareaFocus"
      @input="onTextareaInput"
    ></textarea>
  </label>
</template>

<script lang="ts">
import { ref, computed, nextTick, onMounted, defineComponent } from "vue";
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
      set: (val) => emit("update:modelValue", val),
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
    const onTextareaInput = () => {
      calcTextareaStyle();
    };
    const calcTextareaStyle = () => {
      textareaStyle.value.height = "auto";
      nextTick(() => {
        textareaStyle.value.height = textareaRef.value?.value
          ? textareaRef.value.scrollHeight + 1 + "px"
          : "auto";
      });
    };

    onMounted(() => {
      if (props.type === "textarea") {
        onTextareaInput();
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
      onTextareaInput,
      onTextareaFocus,
    };
  },
});
</script>

<style scoped>
.material-input {
  color: var(--color-gray);
  display: block;
  position: relative;
  font-size: 14px;
  box-sizing: border-box;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-gray);
  background-color: transparent;
}
.material-input.is-focus {
  border-bottom-color: var(--color-primary);
}
.material-input_input,
.material-input_textarea {
  color: var(--color-gray-700);
  width: 100%;
  min-height: 1.25rem;
  transition: border-bottom-color var(--transition-default);
  box-sizing: border-box;
  line-height: 1.25rem;
  padding-top: 0.25rem;
  border-bottom: 1px solid transparent;
  padding-bottom: 0.25rem;
  background-color: inherit;
}
.material-input.is-focus .material-input_input,
.material-input.is-focus .material-input_textarea {
  border-bottom-color: var(--color-primary);
}
.material-input_label {
  top: calc(100% - 1.375rem);
  left: 0.5rem;
  color: inherit;
  position: absolute;
  transition:
    top var(--transition-default),
    left var(--transition-default),
    color var(--transition-default),
    font-size var(--transition-default);
  line-height: 1;
  background-color: transparent;
}
.material-input.is-focus .material-input_label {
  color: var(--color-primary-600);
}
.material-input.is-active .material-input_label {
  top: 0;
  left: 0;
  font-size: 0.75rem;
}
</style>
