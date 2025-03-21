<template>
  <label class="gtk-checkbox">
    <input type="checkbox" :checked="props.checked" class="checkbox-input" />
    <span class="checkbox-label">{{ props.text }}</span>
  </label>
</template>

<script>
  // Widget metadata for the registry
  export const widgetMeta = {
    id: 'checkbox',
    name: 'Check Button',
    icon: '☑️',
    category: 'input',
    defaultProps: { checked: false, text: 'Check me' },
    dimensions: { width: 120, height: 24 },
  };
</script>

<script setup>
  const props = defineProps({
    text: {
      type: String,
      default: 'Check me',
    },
    checked: {
      type: Boolean,
      default: false,
    },
  });
</script>

<style scoped>
  .gtk-checkbox {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #2e3436;
    cursor: pointer;
  }

  .checkbox-input {
    margin-right: 8px;
  }

  .checkbox-label {
    user-select: none;
  }
</style>
