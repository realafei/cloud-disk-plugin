<template>
  <transition
    name="m-message-fade"
    appear
    mode="in-out"
    @before-leave="$emit('close')"
    @after-leave="$emit('destroy')"
  >
    <div
      class="m-message-wrapper"
      v-if="state.visible"
      :id="id"
      :style="{
        width: width,
      }"
      :class="wrapperClassName"
    >
      <div
        class="m-message"
        :class="className"
        @mouseenter="handleClearTimer"
        @mouseleave="handleStartTimer"
      >
        <div class="m-message-icons" v-if="iconURL || type">
          <img v-if="iconURL" :src="iconURL" class="m-message--icon" />
          <MaterialIcon v-else-if="type" :name="type" class="m-message--icon" />
        </div>
        <div class="m-message-content">
          <div class="m-message--title" v-if="title || $slots.title">
            <slot name="title">{{ title }}</slot>
          </div>
          <template v-if="supportHTML && message">
            <div
              class="m-message--description"
              v-if="!state.collapsed"
              v-html="message"
            ></div>
          </template>
          <template v-else>
            <div class="m-message--description" v-if="!state.collapsed">
              <slot>{{ message }}</slot>
            </div>
          </template>
        </div>
        <div class="m-message--control">
          <button
            class="m-message--button m-message--arrow-down"
            v-if="collapsable && (title || $slots.title)"
            :class="{
              'is-collapsed': state.collapsed,
            }"
            @click="triggerCollapse"
          >
            <svg
              viewBox="0 0 35 35"
              width="20"
              height="20"
              version="1.1"
              fill="currentColor"
            >
              <path
                d="M9.4,13.9c-0.2,0.2-0.2,0.6,0,0.8l8.1,8.1l0,0l0,0l8.1-8.1c0.2-0.2,0.2-0.6,0-0.8l-1.3-1.3 c-0.2-0.2-0.6-0.2-0.8,0l-5.5,5.5c-0.2,0.2-0.6,0.2-0.8,0l-5.5-5.5c-0.2-0.2-0.6-0.2-0.8,0L9.4,13.9z"
              />
            </svg>
          </button>
          <button
            class="m-message--button m-message--close"
            v-if="closable"
            @click="handleClose"
          >
            <svg
              viewBox="0 0 35 35"
              width="20"
              height="20"
              version="1.1"
              fill="currentColor"
            >
              <path
                d="M19.5,17.5l5.1,5.1l-2,2l-5.1-5.1l-5.1,5.1l-2-2l5.1-5.1l-5.1-5.1l2-2l5.1,5.1l5.1-5.1l2,2L19.5,17.5z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import type { Ref } from "vue";
import { defineComponent, reactive, onMounted, ref, onBeforeMount } from "vue";
import MaterialIcon from "@/components/Material/MaterialIcon.vue";

function useTimeout(cb: () => void, time: number) {
  const t: Ref<number> = ref(0);
  t.value = window.setTimeout(cb, time);
  return {
    stop() {
      window.clearTimeout(t.value);
    },
  };
}

export default defineComponent({
  components: { MaterialIcon },
  name: "MaterialMessage",
  emits: ["close", "destroy", "collapsed"],
  props: {
    id: String,
    type: {
      type: String,
      default: "info",
    },
    title: String,
    message: String,
    iconURL: String,
    duration: {
      type: Number,
      default: 3000,
    },
    isCollapsed: Boolean,
    collapsable: Boolean,
    supportHTML: Boolean,
    width: String,
    className: String,
    wrapperClassName: String,
    closable: Boolean,
    stopTimerOnHover: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { expose, emit }) {
    const state = reactive({
      visible: true,
      collapsed: props.isCollapsed,
      timer: null,
    });
    let stopTimer: () => void;

    const startTimer = () => {
      if (props.duration < 0) return;
      ({ stop: stopTimer } = useTimeout(() => {
        close();
      }, props.duration));
    };
    const clearTimer = () => {
      stopTimer?.();
    };

    const close = () => {
      state.visible = false;
    };

    const triggerCollapse = () => {
      state.collapsed = !state.collapsed;
      emit("collapsed", state.collapsed);
    };

    const handleClose = () => {
      state.visible = false;
    };
    const handleClearTimer = () => {
      props.stopTimerOnHover && clearTimer();
    };

    const handleStartTimer = () => {
      props.stopTimerOnHover && startTimer();
    };

    onBeforeMount(() => {
      clearTimer();
    });
    onMounted(() => {
      startTimer();
    });

    expose({
      close,
    });
    return {
      state,
      handleClearTimer,
      handleStartTimer,
      triggerCollapse,
      handleClose,
    };
  },
});
</script>
<style>
.m-message-container {
  position: fixed;
  z-index: 20000;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0);
  transition: all 1s ease-in-out;
}
.m-message-container.is-top-left,
.m-message-container.is-top-center,
.m-message-container.is-top-right {
  width: 100%;
  top: 0;
  left: 0;
}
.m-message-container.is-top-left {
  align-items: flex-start;
}
.m-message-container.is-top-center {
  align-items: center;
}
.m-message-container.is-top-right {
  align-items: flex-end;
}
.m-message-container.is-center {
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  align-items: center;
  justify-content: center;
}
.m-message-container.is-bottom-left,
.m-message-container.is-bottom-center,
.m-message-container.is-bottom-right {
  bottom: 0;
  left: 0;
  width: 100%;
  justify-content: flex-end;
}
.m-message-container.is-bottom-left {
  align-items: flex-start;
}
.m-message-container.is-bottom-center {
  align-items: center;
}
.m-message-container.is-bottom-right {
  align-items: flex-end;
}
.m-message-container.has-mask {
  background-color: rgba(255, 255, 255, 0.3);
  width: 100%;
  height: 100%;
  pointer-events: all;
}
.m-message-wrapper {
  z-index: 20000;
  display: inline-block;
  max-width: 500px;
}
.m-message-wrapper + .m-message-wrapper {
  margin-top: 15px;
}
.m-message-wrapper::before,
.m-message-wrapper::after {
  content: "";
  clear: both;
  display: table;
}
.m-message {
  display: flex;
  align-items: center;
  padding: 10px;
  font-size: 14px;
  overflow: hidden;
  border-radius: 4px;
  box-sizing: border-box;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.15);
  background: #fff;
  pointer-events: all;
  position: relative;
  min-width: 150px;
}
.m-message-icons {
  float: left;
  box-sizing: border-box;
  margin-right: 10px;
}
.m-message--title {
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.m-message-content {
  box-sizing: border-box;
  overflow: auto;
  width: 100%;
}
.m-message--description {
  line-height: 1.6;
  color: #0e1921;
}
.m-message--title + .m-message--description {
  margin-top: 5px;
}
.m-message--icon {
  width: 25px;
  height: 25px;
  vertical-align: middle;
  display: inline-block;
  border-radius: 50%;
}
.m-message--control {
  position: relative;
  height: 100%;
  align-self: flex-start;
  white-space: nowrap;
  margin-right: -5px;
  margin-left: 10px;
  margin-top: 3px;
}
.m-message--button {
  border: none;
  outline: none;
  background: none;
  cursor: pointer;
  font-size: 15px;
  color: #646464;
  font-weight: 600;
  padding: 0;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  vertical-align: middle;
}
.m-message--button:hover {
  color: #f56c6c;
}
.m-message--arrow-down.is-collapsed {
  transform: rotate(90deg);
}
.m-message-fade-enter-active {
  animation: m-message-fade-in-down 0.3s;
}
.m-message-fade-leave-active {
  animation: m-message-fade-out 0.3s;
}
@keyframes m-message-fade-in-down {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
@keyframes m-message-fade-out {
  0% {
    opacity: 1;
    margin-top: 0;
  }
  100% {
    opacity: 0;
    margin-top: -45px;
  }
}
</style>
