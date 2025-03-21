<template>
  <button
    class="gtk-button"
    :class="{
      'suggested-action': props.buttonStyle === 'suggested',
      'destructive-action': props.buttonStyle === 'destructive',
      'pill-button': props.buttonStyle === 'pill',
    }"
  >
    {{ props.text || 'Button' }}
  </button>
</template>

<script>
  // Widget metadata for the registry
  export const widgetMeta = {
    id: 'button',
    name: 'Button',
    icon: '⬜',
    category: 'basic',
    defaultProps: { text: 'Button', buttonStyle: 'default' },
    dimensions: { width: 80, height: 30 },
  };
</script>

<script setup>
  const props = defineProps({
    text: {
      type: String,
      default: 'Button',
    },
    buttonStyle: {
      type: String,
      default: 'default',
    },
  });
</script>

<style scoped>
  .gtk-button {
    padding: 6px 12px;
    background-color: #fafafa;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    color: #333;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .gtk-button:hover {
    background-color: #f0f0f0;
  }

  .suggested-action {
    background-color: #3584e4;
    color: white;
    border-color: #2465b5;
  }

  .suggested-action:hover {
    background-color: #2a68c2;
  }

  .destructive-action {
    background-color: #e01b24;
    color: white;
    border-color: #b01818;
  }

  .destructive-action:hover {
    background-color: #c01c24;
  }

  .pill-button {
    border-radius: 20px;
    padding: 6px 16px;
  }
</style>
