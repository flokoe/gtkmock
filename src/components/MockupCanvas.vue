<template>
  <div class="mockup-canvas">
    <div class="canvas-toolbar">
      <div class="toolbar-group">
        <button class="btn btn-icon" @click="zoomOut" title="Zoom Out">
          <span>−</span>
        </button>
        <span class="zoom-level">{{ Math.round(zoom * 100) }}%</span>
        <button class="btn btn-icon" @click="zoomIn" title="Zoom In">
          <span>+</span>
        </button>
      </div>
      <button class="btn btn-primary" @click="addNewScreen">
        <span>New Screen</span>
      </button>
    </div>
    
    <div 
      class="canvas-container"
      @dragover.prevent="onDragOver"
      @drop.prevent="onDrop"
      @click="handleContainerClick"
    >
      <div 
        v-if="screens.length === 0" 
        class="empty-canvas"
      >
        <p>Drag and drop widgets from the left panel to start designing</p>
        <button class="btn btn-primary" @click="addNewScreen">Add your first screen</button>
      </div>
      
      <div class="screens-wrapper" :style="`transform: scale(${zoom}); transform-origin: top left;`">
        <div 
          v-for="(screen, screenIndex) in screens" 
          :key="screenIndex"
          class="mockup-screen"
          :class="{ 'active-screen': currentScreenIndex === screenIndex }"
          @click.stop="selectScreen(screenIndex)"
        >
          <div class="screen-header">
            <span class="screen-name">{{ screen.name }}</span>
            <div class="screen-actions">
              <button class="btn-icon" @click.stop="duplicateScreen(screenIndex)" title="Duplicate Screen">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="8" y="8" width="12" height="12" rx="2" ry="2"></rect>
                  <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path>
                </svg>
              </button>
              <button class="btn-icon" @click.stop="removeScreen(screenIndex)" title="Delete Screen">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="screen-content" :style="{ width: `${screen.width}px`, height: `${screen.height}px` }">
            <div
              v-for="(widget, widgetIndex) in screen.widgets"
              :key="widgetIndex"
              class="canvas-widget"
              :style="{
                left: `${widget.x}px`,
                top: `${widget.y}px`,
                width: widget.width ? `${widget.width}px` : 'auto',
                height: widget.height ? `${widget.height}px` : 'auto'
              }"
              @click.stop="selectWidget(screenIndex, widgetIndex)"
              :class="{ 'selected-widget': currentScreenIndex === screenIndex && selectedWidgetIndex === widgetIndex }"
            >
              <component 
                :is="getWidgetComponent(widget.type)" 
                v-bind="widget.props" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue';

const emit = defineEmits([
  'select-widget', 
  'select-screen', 
  'deselect', 
  'update-widget', 
  'update-screen'
]);

// Define reactive state
const screens = ref([]);
const currentScreenIndex = ref(-1);
const selectedWidgetIndex = ref(-1);
const zoom = ref(1);

// Add a new screen
const addNewScreen = () => {
  screens.value.push({
    name: `Screen ${screens.value.length + 1}`,
    width: 360,
    height: 640,
    widgets: []
  });
  const screenIndex = screens.value.length - 1;
  selectScreen(screenIndex);
};

// Select a screen
const selectScreen = (index) => {
  currentScreenIndex.value = index;
  selectedWidgetIndex.value = -1;
  
  // Emit screen selection event with screen data
  emit('select-screen', index, screens.value[index]);
};

// Remove a screen
const removeScreen = (index) => {
  if (screens.value.length > 1) {
    screens.value.splice(index, 1);
    if (currentScreenIndex.value >= screens.value.length) {
      currentScreenIndex.value = screens.value.length - 1;
    }
    // Emit selection for the new current screen
    if (currentScreenIndex.value >= 0) {
      emit('select-screen', currentScreenIndex.value, screens.value[currentScreenIndex.value]);
    } else {
      emit('deselect');
    }
  } else {
    screens.value = [];
    currentScreenIndex.value = -1;
    emit('deselect');
  }
  selectedWidgetIndex.value = -1;
};

// Duplicate a screen
const duplicateScreen = (index) => {
  const newScreen = JSON.parse(JSON.stringify(screens.value[index]));
  newScreen.name = `${newScreen.name}_copy`;
  screens.value.splice(index + 1, 0, newScreen);
  selectScreen(index + 1);
};

// Select a widget
const selectWidget = (screenIndex, widgetIndex) => {
  currentScreenIndex.value = screenIndex;
  selectedWidgetIndex.value = widgetIndex;
  
  // Emit widget selection event with widget data
  emit('select-widget', screenIndex, widgetIndex, screens.value[screenIndex].widgets[widgetIndex]);
};

// Handle clicks on the canvas container (deselect)
const handleContainerClick = (event) => {
  // Only deselect if clicking directly on the container, not on a screen or widget
  if (event.target.classList.contains('canvas-container')) {
    currentScreenIndex.value = -1;
    selectedWidgetIndex.value = -1;
    emit('deselect');
  }
};

// Methods to update screens and widgets (called from App.vue)
const updateSelectedScreen = (updatedScreen) => {
  if (currentScreenIndex.value >= 0 && currentScreenIndex.value < screens.value.length) {
    // Update the screen properties
    screens.value[currentScreenIndex.value] = {
      ...screens.value[currentScreenIndex.value],
      ...updatedScreen
    };
    
    // Emit update event
    emit('update-screen', screens.value[currentScreenIndex.value]);
  }
};

// Get screen by index (called from App.vue)
const getScreenAt = (index) => {
  if (index >= 0 && index < screens.value.length) {
    return screens.value[index];
  }
  return null;
};

const updateSelectedWidget = (updatedWidget) => {
  if (
    currentScreenIndex.value >= 0 && 
    selectedWidgetIndex.value >= 0 && 
    currentScreenIndex.value < screens.value.length && 
    selectedWidgetIndex.value < screens.value[currentScreenIndex.value].widgets.length
  ) {
    // Update the widget properties
    screens.value[currentScreenIndex.value].widgets[selectedWidgetIndex.value] = {
      ...screens.value[currentScreenIndex.value].widgets[selectedWidgetIndex.value],
      ...updatedWidget
    };
    
    // Emit update event
    emit('update-widget', screens.value[currentScreenIndex.value].widgets[selectedWidgetIndex.value]);
  }
};

const deleteSelectedWidget = () => {
  if (
    currentScreenIndex.value >= 0 && 
    selectedWidgetIndex.value >= 0 && 
    currentScreenIndex.value < screens.value.length && 
    selectedWidgetIndex.value < screens.value[currentScreenIndex.value].widgets.length
  ) {
    // Remove the widget
    screens.value[currentScreenIndex.value].widgets.splice(selectedWidgetIndex.value, 1);
    selectedWidgetIndex.value = -1;
  }
};

// Zoom in and out
const zoomIn = () => {
  zoom.value = Math.min(zoom.value + 0.1, 2);
};

const zoomOut = () => {
  zoom.value = Math.max(zoom.value - 0.1, 0.5);
};

// Drag and drop handlers
const onDragOver = (event) => {
  event.dataTransfer.dropEffect = 'copy';
};

const onDrop = (event) => {
  if (currentScreenIndex.value === -1) {
    addNewScreen();
  }
  
  try {
    const widgetData = JSON.parse(event.dataTransfer.getData('application/json'));
    const rect = event.target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / zoom.value;
    const y = (event.clientY - rect.top) / zoom.value;
    
    // Add the widget to the current screen
    screens.value[currentScreenIndex.value].widgets.push({
      type: widgetData.type,
      x,
      y,
      width: widgetData.type === 'button' ? 80 : 
             widgetData.type === 'entry' ? 150 : 
             null,
      height: widgetData.type === 'button' ? 30 : 
              widgetData.type === 'entry' ? 30 : 
              null,
      props: { ...widgetData.defaultProps }
    });
    
    // Select the new widget
    const widgetIndex = screens.value[currentScreenIndex.value].widgets.length - 1;
    selectWidget(currentScreenIndex.value, widgetIndex);
  } catch (e) {
    console.error('Error adding widget:', e);
  }
};

// Helper to get the appropriate component for a widget type
const getWidgetComponent = (type) => {
  // This would map to actual components in a real implementation
  return 'div';
};

// Add a default screen when the component is mounted
setTimeout(() => {
  if (screens.value.length === 0) {
    addNewScreen();
  }
}, 100);
</script>

<style scoped>
.mockup-canvas {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.canvas-toolbar {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  align-items: center;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-md);
  background-color: var(--gray-2);
  color: var(--gray-7);
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-speed);
}

.btn-icon:hover {
  background-color: var(--gray-3);
}

.zoom-level {
  font-size: 0.85rem;
  color: var(--gray-6);
  width: 48px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.canvas-container {
  flex: 1;
  position: relative;
  padding-bottom: 60px;
}

.screens-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.empty-canvas {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  height: 100%;
  color: var(--gray-5);
  text-align: center;
  padding: 40px;
}

.mockup-screen {
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08), var(--shadow-md);
  display: inline-block;
  overflow: hidden;
  transition: box-shadow var(--transition-speed);
}

.active-screen {
  box-shadow: 0 0 0 2px var(--blue-2), 0 4px 10px rgba(0, 0, 0, 0.1);
}

.screen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background-color: var(--gray-1);
  border-bottom: 1px solid var(--gray-2);
}

.screen-name {
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--gray-7);
}

.screen-actions {
  display: flex;
  gap: 6px;
}

.screen-content {
  position: relative;
  min-height: 300px;
  background-color: white;
}

.canvas-widget {
  position: absolute;
  border-radius: var(--border-radius-sm);
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid var(--gray-3);
  transition: border var(--transition-speed), box-shadow var(--transition-speed);
}

.selected-widget {
  border: 1px solid var(--blue-3);
  box-shadow: 0 0 0 1px var(--blue-3);
}
</style> 