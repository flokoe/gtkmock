<template>
  <div class="mockup-canvas">
    <div class="canvas-toolbar">
      <button class="btn btn-sm" @click="zoomIn">+</button>
      <span class="zoom-level">{{ Math.round(zoom * 100) }}%</span>
      <button class="btn btn-sm" @click="zoomOut">-</button>
      <button class="btn btn-primary" @click="addNewScreen">New Screen</button>
    </div>
    
    <div 
      class="canvas-container"
      @dragover.prevent="onDragOver"
      @drop.prevent="onDrop"
      :style="`transform: scale(${zoom}); transform-origin: top left;`"
    >
      <div 
        v-if="screens.length === 0" 
        class="empty-canvas"
      >
        <p>Drag and drop widgets from the left panel to start designing</p>
        <button class="btn btn-primary" @click="addNewScreen">Add your first screen</button>
      </div>
      
      <div 
        v-for="(screen, screenIndex) in screens" 
        :key="screenIndex"
        class="mockup-screen"
        :class="{ 'active-screen': currentScreenIndex === screenIndex }"
        @click="selectScreen(screenIndex)"
      >
        <div class="screen-header">
          <span class="screen-title">{{ screen.name }}</span>
          <div class="screen-actions">
            <button class="btn-icon" @click.stop="duplicateScreen(screenIndex)">📋</button>
            <button class="btn-icon" @click.stop="removeScreen(screenIndex)">🗑️</button>
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
</template>

<script setup>
import { ref, computed } from 'vue';

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
  currentScreenIndex.value = screens.value.length - 1;
  selectedWidgetIndex.value = -1;
};

// Select a screen
const selectScreen = (index) => {
  currentScreenIndex.value = index;
  selectedWidgetIndex.value = -1;
};

// Remove a screen
const removeScreen = (index) => {
  if (screens.value.length > 1) {
    screens.value.splice(index, 1);
    if (currentScreenIndex.value >= screens.value.length) {
      currentScreenIndex.value = screens.value.length - 1;
    }
  } else {
    screens.value = [];
    currentScreenIndex.value = -1;
  }
  selectedWidgetIndex.value = -1;
};

// Duplicate a screen
const duplicateScreen = (index) => {
  const newScreen = JSON.parse(JSON.stringify(screens.value[index]));
  newScreen.name = `${newScreen.name} (Copy)`;
  screens.value.splice(index + 1, 0, newScreen);
  currentScreenIndex.value = index + 1;
};

// Select a widget
const selectWidget = (screenIndex, widgetIndex) => {
  currentScreenIndex.value = screenIndex;
  selectedWidgetIndex.value = widgetIndex;
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
    selectedWidgetIndex.value = screens.value[currentScreenIndex.value].widgets.length - 1;
  } catch (e) {
    console.error('Error adding widget:', e);
  }
};

// Helper to get the appropriate component for a widget type
const getWidgetComponent = (type) => {
  // This would map to actual components in a real implementation
  return 'div';
};
</script>

<style scoped>
.mockup-canvas {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.canvas-toolbar {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  align-items: center;
}

.btn-sm {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: var(--gray-2);
  color: var(--gray-7);
  font-weight: bold;
  border: none;
  cursor: pointer;
}

.zoom-level {
  font-size: 0.85rem;
  color: var(--gray-6);
  width: 45px;
  text-align: center;
}

.canvas-container {
  flex: 1;
  background-color: var(--gray-3);
  overflow: auto;
  padding: 20px;
  border-radius: 8px;
  position: relative;
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
  background-color: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.mockup-screen {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
}

.active-screen {
  box-shadow: 0 0 0 2px var(--blue-2), 0 3px 10px rgba(0, 0, 0, 0.1);
}

.screen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: var(--gray-1);
  border-bottom: 1px solid var(--gray-2);
}

.screen-title {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--gray-7);
}

.screen-actions {
  display: flex;
  gap: 5px;
}

.btn-icon {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-icon:hover {
  background-color: var(--gray-2);
}

.screen-content {
  position: relative;
  min-height: 300px;
  background-color: #ffffff;
  background-image: linear-gradient(#f5f5f5 1px, transparent 1px),
                    linear-gradient(90deg, #f5f5f5 1px, transparent 1px);
  background-size: 20px 20px;
}

.canvas-widget {
  position: absolute;
  padding: 2px;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid var(--gray-3);
}

.selected-widget {
  border: 2px solid var(--blue-3);
  box-shadow: 0 0 0 2px rgba(53, 132, 228, 0.3);
}
</style> 