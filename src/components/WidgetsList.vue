<template>
  <div class="widgets-list">
    <div class="widgets-category">
      <h3>Basic Widgets</h3>
      <div 
        v-for="widget in basicWidgets" 
        :key="widget.type" 
        class="widget-item draggable"
        draggable="true"
        @dragstart="onDragStart($event, widget)"
      >
        <div class="widget-icon">{{ widget.icon }}</div>
        <div class="widget-name">{{ widget.name }}</div>
      </div>
    </div>
    
    <div class="widgets-category">
      <h3>Containers</h3>
      <div 
        v-for="widget in containerWidgets" 
        :key="widget.type" 
        class="widget-item draggable"
        draggable="true"
        @dragstart="onDragStart($event, widget)"
      >
        <div class="widget-icon">{{ widget.icon }}</div>
        <div class="widget-name">{{ widget.name }}</div>
      </div>
    </div>
    
    <div class="widgets-category">
      <h3>Input Controls</h3>
      <div 
        v-for="widget in inputWidgets" 
        :key="widget.type" 
        class="widget-item draggable"
        draggable="true"
        @dragstart="onDragStart($event, widget)"
      >
        <div class="widget-icon">{{ widget.icon }}</div>
        <div class="widget-name">{{ widget.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const basicWidgets = ref([
  { type: 'label', name: 'Label', icon: 'T', defaultProps: { text: 'Label' } },
  { type: 'button', name: 'Button', icon: '⬜', defaultProps: { text: 'Button', buttonStyle: 'default' } },
  { type: 'image', name: 'Image', icon: '🖼️', defaultProps: { src: '' } },
  { type: 'separator', name: 'Separator', icon: '—', defaultProps: {} },
]);

const containerWidgets = ref([
  { type: 'box', name: 'Box', icon: '📦', defaultProps: { orientation: 'vertical', spacing: 8 } },
  { type: 'grid', name: 'Grid', icon: '⊞', defaultProps: {} },
  { type: 'headerbar', name: 'HeaderBar', icon: '▭', defaultProps: { title: 'Window Title' } },
  { type: 'windowControls', name: 'Window Controls', icon: '🔲', defaultProps: { side: 'start' } },
]);

const inputWidgets = ref([
  { type: 'entry', name: 'Entry', icon: '⌨️', defaultProps: { text: '', placeholder: 'Enter text...' } },
  { type: 'spinButton', name: 'Spin Button', icon: '🔢', defaultProps: { value: 0 } },
  { type: 'checkbox', name: 'Check Button', icon: '☑️', defaultProps: { checked: false, text: 'Check me' } },
  { type: 'switch', name: 'Switch', icon: '⚙️', defaultProps: { active: false } },
  { type: 'dropdown', name: 'Dropdown', icon: '▼', defaultProps: { items: ['Item 1', 'Item 2'] } },
]);

const onDragStart = (event, widget) => {
  event.dataTransfer.effectAllowed = 'copy';
  event.dataTransfer.setData('application/json', JSON.stringify(widget));
};
</script>

<style scoped>
.widgets-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.widgets-category {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.widgets-category h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--gray-6);
}

.widget-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--gray-2);
  background-color: white;
  transition: all 0.2s;
}

.widget-item:hover {
  background-color: var(--blue-0);
  border-color: var(--blue-1);
}

.widget-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: var(--gray-1);
  font-size: 1rem;
}

.widget-name {
  font-size: 0.9rem;
}
</style> 