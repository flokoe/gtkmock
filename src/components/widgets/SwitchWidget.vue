<template>
  <label class="gtk-switch">
    <div class="switch-track" :class="{ 'active': props.active }">
      <div class="switch-handle"></div>
    </div>
  </label>
</template>

<script>
// Widget metadata for the registry
export const widgetMeta = {
  id: 'switch',
  name: 'Switch',
  icon: '⚙️',
  category: 'input',
  defaultProps: { active: false },
  dimensions: { width: 60, height: 24 }
};
</script>

<script setup>
const props = defineProps({
  active: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.gtk-switch {
  display: inline-block;
  position: relative;
  cursor: pointer;
}

.switch-track {
  position: relative;
  width: 40px;
  height: 20px;
  background-color: #dcdee0;
  border-radius: 10px;
  transition: background-color 0.2s;
}

.switch-handle {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background-color: #ffffff;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.switch-track.active {
  background-color: #3584e4;
}

.switch-track.active .switch-handle {
  transform: translateX(20px);
}
</style> 