<template>
  <div class="mockup-canvas">
    <div class="canvas-toolbar">
      <div class="toolbar-group">
        <button class="btn btn-icon" title="Zoom Out" @click="zoomOut">
          <span>−</span>
        </button>
        <span class="zoom-level">{{ Math.round(zoom * 100) }}%</span>
        <button class="btn btn-icon" title="Zoom In" @click="zoomIn">
          <span>+</span>
        </button>
      </div>
      <div class="toolbar-actions">
        <button class="btn btn-primary" @click="addNewScreen">
          <span>New Screen</span>
        </button>
        <button class="btn" @click="exportMockupData">
          <span>Export</span>
        </button>
        <button class="btn" @click="importMockupData">
          <span>Import</span>
        </button>
      </div>
    </div>

    <div
      class="canvas-container"
      @dragover.prevent="onDragOver"
      @drop.prevent="onDrop"
      @click="handleContainerClick"
    >
      <div v-if="mockupData.screens.length === 0" class="empty-canvas">
        <p>Drag and drop widgets from the left panel to start designing</p>
        <button class="btn btn-primary" @click="addNewScreen">Add your first screen</button>
      </div>

      <div
        class="screens-wrapper"
        :style="`transform: scale(${zoom}); transform-origin: top left;`"
      >
        <div
          v-for="(screen, screenIndex) in mockupData.screens"
          :key="screen.id"
          class="mockup-screen"
          :class="{ 'active-screen': mockupData.currentScreenIndex === screenIndex }"
          @click.stop="selectScreen(screenIndex)"
        >
          <div class="screen-header">
            <span class="screen-name">{{ screen.name }}</span>
            <div class="screen-actions">
              <button
                class="btn-icon"
                title="Duplicate Screen"
                @click.stop="duplicateScreen(screenIndex)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="8" y="8" width="12" height="12" rx="2" ry="2"></rect>
                  <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path>
                </svg>
              </button>
              <button
                class="btn-icon"
                title="Delete Screen"
                @click.stop="removeScreen(screenIndex)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>

          <div
            class="screen-content"
            :style="{ width: `${screen.width}px`, height: `${screen.height}px` }"
            @dragover.prevent="onDragOver"
            @drop.prevent="event => onDropToScreen(event, screenIndex)"
          >
            <div
              v-for="widget in screen.widgets"
              :key="widget.id"
              class="canvas-widget"
              :style="{
                left: `${widget.x}px`,
                top: `${widget.y}px`,
                width: widget.width ? `${widget.width}px` : 'auto',
                height: widget.height ? `${widget.height}px` : 'auto',
              }"
              :class="{ 'selected-widget': mockupData.selectedWidgetId === widget.id }"
              @click.stop="selectWidgetById(widget.id)"
            >
              <component :is="getWidgetComponent(widget.type)" v-bind="widget.properties" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import {
    mockupData,
    addScreen,
    selectScreen as selectScreenInStore,
    getScreenAt,
    removeScreen as removeScreenFromStore,
    duplicateScreen as duplicateScreenInStore,
    updateScreen,
    addWidget,
    selectWidget,
    updateWidget,
    deleteWidget,
    clearSelection,
    importMockup,
    exportMockup,
    initialize,
  } from '@/store/mockupStore';
  import { getWidgetComponent } from '@/components/WidgetRegistry';

  const emit = defineEmits([
    'select-widget',
    'select-screen',
    'deselect',
    'update-widget',
    'update-screen',
  ]);

  // Local state
  const zoom = ref(1);

  // Add a new screen
  const addNewScreen = () => {
    const screenIndex = addScreen();
    selectScreen(screenIndex);
  };

  // Select a screen
  const selectScreen = index => {
    const screen = selectScreenInStore(index);
    if (screen) {
      // Emit screen selection event with screen data
      emit('select-screen', index, screen);
    }
  };

  // Remove a screen
  const removeScreen = index => {
    const result = removeScreenFromStore(index);

    if (result) {
      // Selected a different screen - emit selection
      emit('select-screen', mockupData.currentScreenIndex, result);
    } else {
      // No screens left or invalid index
      emit('deselect');
    }
  };

  // Duplicate a screen
  const duplicateScreen = index => {
    const newIndex = duplicateScreenInStore(index);
    if (newIndex >= 0) {
      selectScreen(newIndex);
    }
  };

  // Select a widget by ID
  const selectWidgetById = widgetId => {
    // First, determine which screen contains this widget
    const screenIndex = mockupData.screens.findIndex(screen =>
      screen.widgets.some(widget => widget.id === widgetId)
    );

    if (screenIndex !== -1) {
      // If the screen containing this widget is not the current screen, select it first
      if (mockupData.currentScreenIndex !== screenIndex) {
        // Select the screen in the store
        const screen = selectScreenInStore(screenIndex);

        // Emit screen selection event to update properties panel
        if (screen) {
          emit('select-screen', screenIndex, screen);
        }
      }

      // Then select the widget
      const widget = selectWidget(widgetId);

      if (widget) {
        // Emit widget selection event with widget data
        emit('select-widget', mockupData.currentScreenIndex, widgetId, widget);
      }
    }
  };

  // Handle clicks on the canvas container (deselect)
  const handleContainerClick = event => {
    // Only deselect if clicking directly on the container, not on a screen or widget
    if (event.target.classList.contains('canvas-container')) {
      clearSelection();
      emit('deselect');
    }
  };

  // Update selected widget (called from App.vue)
  const updateSelectedWidget = updatedWidget => {
    if (mockupData.selectedWidgetId) {
      const widget = updateWidget(mockupData.selectedWidgetId, updatedWidget);
      if (widget) {
        emit('update-widget', widget);
      }
    }
  };

  // Delete selected widget
  const deleteSelectedWidget = () => {
    if (mockupData.selectedWidgetId) {
      if (deleteWidget(mockupData.selectedWidgetId)) {
        emit('deselect');
      }
    }
  };

  // Update selected screen
  const updateSelectedScreen = updatedScreen => {
    if (mockupData.currentScreenIndex >= 0) {
      const screen = updateScreen(mockupData.currentScreenIndex, updatedScreen);
      if (screen) {
        emit('update-screen', screen);
      }
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
  const onDragOver = event => {
    event.dataTransfer.dropEffect = 'copy';
  };

  const onDrop = event => {
    if (mockupData.currentScreenIndex === -1) {
      addNewScreen();
    }

    try {
      const widgetData = JSON.parse(event.dataTransfer.getData('application/json'));
      const rect = event.target.getBoundingClientRect();
      const x = (event.clientX - rect.left) / zoom.value;
      const y = (event.clientY - rect.top) / zoom.value;

      // Add the widget to the current screen
      const widget = addWidget(
        mockupData.currentScreenIndex,
        widgetData.type,
        x,
        y,
        widgetData.defaultProps
      );

      if (widget) {
        // The new widget is already selected in the store
        emit('select-widget', mockupData.currentScreenIndex, widget.id, widget);
      }
    } catch (e) {
      console.error('Error adding widget:', e);
    }
  };

  // Handle drop on a specific screen
  const onDropToScreen = (event, screenIndex) => {
    try {
      const widgetData = JSON.parse(event.dataTransfer.getData('application/json'));
      const rect = event.target.getBoundingClientRect();
      const x = (event.clientX - rect.left) / zoom.value;
      const y = (event.clientY - rect.top) / zoom.value;

      // First select the screen where we dropped the widget
      const screen = selectScreenInStore(screenIndex);
      if (screen) {
        emit('select-screen', screenIndex, screen);
      }

      // Add the widget to the specific screen
      const widget = addWidget(screenIndex, widgetData.type, x, y, widgetData.defaultProps);

      if (widget) {
        // Then select the widget we just dropped
        emit('select-widget', screenIndex, widget.id, widget);
      }
    } catch (e) {
      console.error('Error adding widget to screen:', e);
    }
  };

  // Import and export mockup data
  const importMockupData = () => {
    const jsonData = prompt('Paste JSON mockup data:');
    if (jsonData) {
      if (importMockup(jsonData)) {
        if (mockupData.screens.length > 0) {
          selectScreen(0);
        }
      } else {
        alert('Invalid mockup data format');
      }
    }
  };

  const exportMockupData = () => {
    const jsonData = exportMockup();
    alert('Copy this JSON data to save your mockup:\n\n' + jsonData);
  };

  // Add a default screen when the component is mounted
  onMounted(() => {
    initialize();
  });

  // Expose methods for the parent component
  defineExpose({
    updateSelectedWidget,
    updateSelectedScreen,
    deleteSelectedWidget,
    getScreenAt,
  });
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

  .toolbar-actions {
    display: flex;
    gap: 8px;
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
    box-shadow:
      0 4px 6px rgba(0, 0, 0, 0.08),
      var(--shadow-md);
    display: inline-block;
    overflow: hidden;
    transition: box-shadow var(--transition-speed);
  }

  .active-screen {
    box-shadow:
      0 0 0 2px var(--blue-2),
      0 4px 10px rgba(0, 0, 0, 0.1);
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
    transition:
      border var(--transition-speed),
      box-shadow var(--transition-speed);
  }

  .selected-widget {
    border: 1px solid var(--blue-3);
    box-shadow: 0 0 0 1px var(--blue-3);
  }
</style>
