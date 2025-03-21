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
        <MockupCanvas />
      </div>
      <div class="sidebar properties-panel">
        <h2>Properties</h2>
        <PropertiesPanel />
      </div>
    </main>
  </div>
</template>

<script setup>
import WidgetsList from '@/components/WidgetsList.vue';
import MockupCanvas from '@/components/MockupCanvas.vue';
import PropertiesPanel from '@/components/PropertiesPanel.vue';
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