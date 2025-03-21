<template>
  <div class="app-container">
    <header class="app-header">
      <h1>GTK4/LibAdwaita Mockup Editor</h1>
    </header>
    <main class="app-content">
      <div class="sidebar widgets-panel">
        <h2>Widgets</h2>
        <WidgetsList />
      </div>
      <div class="main-area canvas-panel">
        <h2>Canvas</h2>
        <MockupCanvas 
          ref="mockupCanvas"
          @select-widget="handleWidgetSelection"
          @select-screen="handleScreenSelection"
          @deselect="handleDeselection"
          @update-widget="handleWidgetUpdate"
          @update-screen="handleScreenUpdate"
        />
      </div>
      <div class="sidebar properties-panel">
        <h2>Properties</h2>
        <PropertiesPanel 
          :hasSelection="hasWidgetSelection"
          :selectedWidget="selectedWidget"
          :isScreenSelected="isScreenSelected"
          :selectedScreen="selectedScreen"
          @update-widget="handleWidgetPropertyUpdate"
          @update-screen="handleScreenPropertyUpdate"
          @delete-widget="handleWidgetDelete"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WidgetsList from '@/components/WidgetsList.vue';
import MockupCanvas from '@/components/MockupCanvas.vue';
import PropertiesPanel from '@/components/PropertiesPanel.vue';

// Selection state
const hasWidgetSelection = ref(false);
const selectedWidget = ref(null);
const isScreenSelected = ref(false);
const selectedScreen = ref(null);
const mockupCanvas = ref(null);

// Selection handlers
const handleWidgetSelection = (screenIndex, widgetIndex, widget) => {
  hasWidgetSelection.value = true;
  selectedWidget.value = widget;
  
  // When a widget is selected, also select its parent screen
  if (!isScreenSelected.value) {
    if (mockupCanvas.value) {
      // Get the screen from the canvas component
      const screen = mockupCanvas.value.getScreenAt(screenIndex);
      if (screen) {
        isScreenSelected.value = true;
        selectedScreen.value = screen;
      }
    }
  }
};

const handleScreenSelection = (screenIndex, screen) => {
  isScreenSelected.value = true;
  selectedScreen.value = screen;
  
  // Selecting only a screen clears any widget selection
  hasWidgetSelection.value = false;
  selectedWidget.value = null;
};

const handleDeselection = () => {
  hasWidgetSelection.value = false;
  selectedWidget.value = null;
  isScreenSelected.value = false;
  selectedScreen.value = null;
};

// Update handlers
const handleWidgetPropertyUpdate = (updatedWidget) => {
  if (mockupCanvas.value) {
    mockupCanvas.value.updateSelectedWidget(updatedWidget);
  }
};

const handleScreenPropertyUpdate = (updatedScreen) => {
  if (mockupCanvas.value) {
    mockupCanvas.value.updateSelectedScreen(updatedScreen);
  }
};

const handleWidgetUpdate = (widget) => {
  selectedWidget.value = widget;
};

const handleScreenUpdate = (screen) => {
  selectedScreen.value = screen;
};

const handleWidgetDelete = () => {
  if (mockupCanvas.value) {
    mockupCanvas.value.deleteSelectedWidget();
  }
  hasWidgetSelection.value = false;
  selectedWidget.value = null;
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Cantarell', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-header {
  padding: 1rem;
  background-color: #3584e4;
  color: white;
}

.app-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  padding: 1rem;
  background-color: #ffffff;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}

.widgets-panel {
  border-right: 1px solid #ddd;
}

.main-area {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background-color: #f5f6f7;
}

.properties-panel {
  /* Border removed */
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

h2 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #1c71d8;
}
</style> 