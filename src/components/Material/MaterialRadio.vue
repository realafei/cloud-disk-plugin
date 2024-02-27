<template>
  <label
    class="material-radio"
    :class="{
      'is-disabled': disabled,
      'is-readonly': readonly,
      'is-checked': isChecked,
      [type]: true,
    }"
    @change="onChange"
  >
    <span class="material-radio-input">
      <input
        class="material-radio-input-original"
        type="radio"
        :value="label"
        :checked="isChecked"
      />
    </span>
    <span v-if="label || $slots.default" class="material-radio-label">
      <template v-if="!$slots.default && label">{{ label }}</template>
      <slot></slot>
    </span>
  </label>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "MaterialRadio",
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: false,
    },
    label: {
      type: [String, Number, Boolean],
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "radio",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const isChecked = computed(() => props.modelValue === props.label);

    const onChange = () => {
      if (!props.disabled && !props.readonly) {
        emit("update:modelValue", props.label);
      }
    };

    return {
      isChecked,
      onChange,
    };
  },
});
</script>

<style scoped>
.material-radio {
  cursor: pointer;
}
.material-radio.radio {
  display: inline-flex;
  min-width: 1em;
  min-height: 1em;
  white-space: nowrap;
  align-items: center;
}

.material-checkbox + .material-radio,
.material-radio.radio + .material-radio.radio {
  margin-left: 0.5em;
}
.material-radio.radio .material-radio-input {
  width: 1em;
  height: 1em;
  display: inline-block;
  position: relative;
}
.material-radio.radio .material-radio-input::before {
  width: 100%;
  height: 100%;
  border: 2px solid var(--color-primary);
  content: "";
  display: block;
  box-sizing: border-box;
  transition: var(--transition-all);
  border-radius: 50%;
  background-color: transparent;
}
.material-radio.radio .material-radio-input::after {
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  content: "";
  display: block;
  position: absolute;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  transition: var(--transition-all);
  border-radius: 50%;
  background-color: var(--color-primary);
}
.material-radio.radio.is-checked .material-radio-input::after {
  width: 50%;
  height: 50%;
}
.material-radio.radio .material-radio-input-original {
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  margin: 0;
  z-index: -1;
  outline: none;
  opacity: 0;
  position: absolute;
}
.material-radio.radio .material-radio-label {
  margin-left: 0.5em;
}

.material-radio.button {
  color: var(--color-gray-900);
  height: auto;
  border: 1px solid var(--color-gray-300);
  padding: 8px 15px;
  transition: var(--transition-all);
  line-height: 1;
  border-radius: var(--gutter);
  background-color: var(--color-white);
}
.material-radio.button:has(+ .material-radio.button) {
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.material-radio.button + .material-radio.button {
  border-left: none;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.material-radio.button.is-checked {
  color: var(--color-gray-50);
  border-color: var(--color-primary);
  background-color: var(--color-primary);
}
.material-radio.button .material-radio-input-original {
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  margin: 0;
  z-index: -1;
  outline: none;
  opacity: 0;
  position: absolute;
}
</style>
