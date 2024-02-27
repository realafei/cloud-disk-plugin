<template>
  <label
    class="material-checkbox"
    :class="{
      'is-checked': modelValue,
      'is-disabled': disabled,
      'is-readonly': readonly,
      'is-indeterminate': indeterminate,
    }"
    @change="onChange"
  >
    <span class="material-checkbox-input">
      <input
        class="material-checkbox-input-original"
        type="checkbox"
        :checked="modelValue"
      />
    </span>
    <span v-if="label || $slots.default" class="material-checkbox-label">
      <template v-if="!$slots.default && label">{{ label }}</template>
      <slot></slot>
    </span>
  </label>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MaterialCheckbox",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
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
    indeterminate: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const onChange = () => {
      if (!props.disabled && !props.readonly) {
        emit("update:modelValue", !props.modelValue);
      }
    };

    return {
      onChange,
    };
  },
});
</script>

<style scoped>
.material-checkbox {
  cursor: pointer;
  display: inline-flex;
  min-width: 1em;
  min-height: 1em;
  white-space: nowrap;
  align-items: center;
}
.material-radio + .material-checkbox,
.material-checkbox + .material-checkbox {
  margin-left: 0.5em;
}
.material-checkbox-input {
  width: 1em;
  height: 1em;
  display: inline-block;
  position: relative;
}
.material-checkbox-input::before {
  width: 100%;
  height: 100%;
  content: "";
  display: block;
  box-sizing: border-box;
  transition: var(--transition-all);
  border-top: 2px solid var(--color-primary);
  border-left: 2px solid var(--color-primary);
  border-right: 2px solid var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
  border-radius: 2px;
  background-color: transparent;
}
.material-checkbox .material-checkbox-input::after {
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  content: "";
  display: block;
  position: absolute;
}
.material-checkbox:not(.is-indeterminate) .material-checkbox-input::after {
  top: 0;
  left: 30%;
  width: 40%;
  height: 80%;
  content: "";
  display: block;
  position: absolute;
  transform: rotate(40deg);
  box-sizing: border-box;
  transition: var(--transition-all);
  border-right: 2px solid transparent;
  border-bottom: 2px solid transparent;
}
.material-checkbox.is-checked .material-checkbox-input::before {
  background-color: var(--color-primary);
}
.material-checkbox.is-checked:not(.is-indeterminate)
  .material-checkbox-input::after {
  border-right-color: #fff;
  border-bottom-color: #fff;
}

.material-checkbox.is-indeterminate .material-checkbox-input::before {
  background-color: var(--color-primary);
}

.material-checkbox.is-indeterminate .material-checkbox-input::after {
  top: 50%;
  left: 50%;
  width: 60%;
  height: 2px;
  content: "";
  display: block;
  position: absolute;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  transition: var(--transition-all);
  background-color: var(--color-white);
}
.material-checkbox-input-original {
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
.material-checkbox-label {
  margin-left: 0.5em;
}
</style>
