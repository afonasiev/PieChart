<script setup lang="ts">
import buttonIcon from "@/shared/ui/button/icon/index.vue";
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps<{
  modelValue: boolean;
  title: string;
}>();
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const modalRef = ref<HTMLElement | null>(null);
let lastFocusedElement: HTMLElement | null = null;

const close = () => emit("update:modelValue", false);
const handleTab = (e: KeyboardEvent) => {
  if (e.key !== "Tab" || !modalRef.value) return;
  const focusable = modalRef.value.querySelectorAll<HTMLElement>(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
  );
  if (!focusable.length) return;
  const first = focusable.item(0);
  const last = focusable.item(focusable.length - 1);
  if (!first || !last) return;

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
};
const handleKey = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.modelValue) return close();
};

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      lastFocusedElement = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      await nextTick();
      const el = modalRef.value?.querySelector<HTMLElement>("[autofocus], button, [href], input");
      el?.focus();
    } else {
      document.body.style.overflow = "";
      lastFocusedElement?.focus();
    }
  },
);

onMounted(() => {
  window.addEventListener("keydown", handleKey);
  window.addEventListener("keydown", handleTab);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKey);
  window.removeEventListener("keydown", handleTab);
  document.body.style.overflow = "";
});
</script>

<template>
  <Teleport to="body">
    <transition :name="$style.modal">
      <div
        v-if="modelValue"
        :class="$style.overlay"
        @click.self="close"
        aria-modal="true"
        role="dialog"
      >
        <div :class="$style.modal" ref="modalRef">
          <div :class="$style.header">
            <h2 :class="$style.heading">{{ title }}</h2>
            <button-icon icon="close" @click="close" />
          </div>
          <div :class="$style.body">
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style lang="scss" module>
.overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}
.modal {
  width: 100%;
  max-width: 520px;
  border-radius: 14px;
  background: #fff;
  //box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.2),
    0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  will-change: transform;
  animation: modal-in 0.2s ease;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 16px 20px;
  border-bottom: 1px solid #ececec;
}
.heading {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
.body {
  display: flex;
  flex-direction: column;
  padding: 16px 20px;
}
@keyframes modal-in {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
