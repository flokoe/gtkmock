<template>
  <div class="placeholder-widget">
    {{ props.type || 'Widget' }}
  </div>
</template>

<script>
  // Base metadata for placeholder widgets
  export const createPlaceholderMeta = (id, name, icon, category, defaultProps, dimensions) => ({
    id,
    name,
    component: 'placeholder',
    icon,
    category,
    defaultProps: { type: id, ...defaultProps },
    dimensions,
  });

  // Export metadata for all placeholder widgets
  export const placeholderWidgets = {
    image: createPlaceholderMeta(
      'image',
      'Image',
      '🖼️',
      'basic',
      { src: '' },
      { width: 100, height: 100 }
    ),
    separator: createPlaceholderMeta(
      'separator',
      'Separator',
      '—',
      'basic',
      {},
      { width: 150, height: 1 }
    ),
    box: createPlaceholderMeta(
      'box',
      'Box',
      '📦',
      'container',
      { orientation: 'vertical', spacing: 8 },
      { width: 200, height: 150 }
    ),
    grid: createPlaceholderMeta('grid', 'Grid', '⊞', 'container', {}, { width: 200, height: 150 }),
    headerbar: createPlaceholderMeta(
      'headerbar',
      'HeaderBar',
      '▭',
      'container',
      { title: 'Window Title' },
      { width: 300, height: 48 }
    ),
    windowControls: createPlaceholderMeta(
      'windowControls',
      'Window Controls',
      '🔲',
      'container',
      { side: 'start' },
      { width: 80, height: 30 }
    ),
    dropdown: createPlaceholderMeta(
      'dropdown',
      'Dropdown',
      '▼',
      'input',
      { items: ['Item 1', 'Item 2'] },
      { width: 150, height: 30 }
    ),
  };
</script>

<script setup>
  const props = defineProps({
    type: String,
  });
</script>

<style scoped>
  .placeholder-widget {
    padding: 8px;
    background-color: #f8f9fa;
    border: 1px dashed #adb5bd;
    border-radius: 4px;
    font-size: 13px;
    color: #495057;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-height: 24px;
  }
</style>
