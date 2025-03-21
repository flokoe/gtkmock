import { reactive, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { getWidgetDimensions, getWidgetMetadata } from '@/components/WidgetRegistry';

// The mockup store holds all screens and widgets data
// This separates the data model from the rendering

const mockupData = reactive({
  screens: [], // Array of screen objects
  currentScreenIndex: -1,
  selectedWidgetId: null, // Changed from index to ID
});

// Create a new screen with a unique ID
function addScreen() {
  const screen = {
    id: uuidv4(),
    name: `Screen ${mockupData.screens.length + 1}`,
    width: 360,
    height: 640,
    widgets: [] // Array of widget objects with unique IDs
  };
  
  mockupData.screens.push(screen);
  const screenIndex = mockupData.screens.length - 1;
  selectScreen(screenIndex);
  
  return screenIndex;
}

// Select a screen by index
function selectScreen(index) {
  if (index >= 0 && index < mockupData.screens.length) {
    mockupData.currentScreenIndex = index;
    mockupData.selectedWidgetId = null;
    return mockupData.screens[index];
  }
  return null;
}

// Get the currently selected screen
function getCurrentScreen() {
  if (mockupData.currentScreenIndex >= 0 && mockupData.currentScreenIndex < mockupData.screens.length) {
    return mockupData.screens[mockupData.currentScreenIndex];
  }
  return null;
}

// Get a screen by index
function getScreenAt(index) {
  if (index >= 0 && index < mockupData.screens.length) {
    return mockupData.screens[index];
  }
  return null;
}

// Remove a screen by index
function removeScreen(index) {
  if (mockupData.screens.length > 1) {
    mockupData.screens.splice(index, 1);
    
    // Update current screen index if needed
    if (mockupData.currentScreenIndex >= mockupData.screens.length) {
      mockupData.currentScreenIndex = mockupData.screens.length - 1;
    }
    
    return mockupData.currentScreenIndex >= 0 ? 
      mockupData.screens[mockupData.currentScreenIndex] : null;
  } else if (mockupData.screens.length === 1) {
    // Don't remove the last screen, just clear it
    mockupData.screens[0].widgets = [];
    return mockupData.screens[0];
  }
  
  return null;
}

// Duplicate a screen by index
function duplicateScreen(index) {
  if (index >= 0 && index < mockupData.screens.length) {
    // Deep clone the screen and give it a new ID
    const sourceScreen = mockupData.screens[index];
    const newScreen = JSON.parse(JSON.stringify(sourceScreen));
    
    // Assign new IDs to the duplicated screen and its widgets
    newScreen.id = uuidv4();
    newScreen.name = `${sourceScreen.name}_copy`;
    
    // Give each widget a new ID
    newScreen.widgets.forEach(widget => {
      widget.id = uuidv4();
    });
    
    // Insert after original
    mockupData.screens.splice(index + 1, 0, newScreen);
    return index + 1; // Return the index of the new screen
  }
  
  return -1;
}

// Update a screen's properties
function updateScreen(screenIndex, updates) {
  if (screenIndex >= 0 && screenIndex < mockupData.screens.length) {
    const screen = mockupData.screens[screenIndex];
    
    // Update properties (excluding widgets)
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'widgets' && key !== 'id') {
        screen[key] = value;
      }
    });
    
    return screen;
  }
  
  return null;
}

// Add a widget to a screen
function addWidget(screenIndex, widgetType, x, y, defaultProps = {}) {
  if (screenIndex >= 0 && screenIndex < mockupData.screens.length) {
    // Get widget metadata from registry
    const widgetMetadata = getWidgetMetadata(widgetType);
    
    if (!widgetMetadata) {
      console.error(`Widget type '${widgetType}' not found in registry`);
      return null;
    }
    
    // Merge default props from registry with any provided props
    const mergedProps = {
      ...widgetMetadata.defaultProps,
      ...defaultProps
    };
    
    // Create the widget with a unique ID
    const widget = {
      id: uuidv4(),
      type: widgetType,
      x,
      y,
      width: widgetMetadata.dimensions.width,
      height: widgetMetadata.dimensions.height,
      props: mergedProps
    };
    
    // Add to the screen
    mockupData.screens[screenIndex].widgets.push(widget);
    
    // Select the new widget
    mockupData.selectedWidgetId = widget.id;
    
    return widget;
  }
  
  return null;
}

// Select a widget by ID
function selectWidget(widgetId) {
  mockupData.selectedWidgetId = widgetId;
  
  // Find the widget
  if (mockupData.currentScreenIndex >= 0) {
    const screen = mockupData.screens[mockupData.currentScreenIndex];
    return screen.widgets.find(widget => widget.id === widgetId) || null;
  }
  
  return null;
}

// Get the currently selected widget
function getSelectedWidget() {
  if (mockupData.currentScreenIndex >= 0 && mockupData.selectedWidgetId) {
    const screen = mockupData.screens[mockupData.currentScreenIndex];
    return screen.widgets.find(widget => widget.id === mockupData.selectedWidgetId) || null;
  }
  
  return null;
}

// Update a widget by ID
function updateWidget(widgetId, updates) {
  if (mockupData.currentScreenIndex >= 0) {
    const screen = mockupData.screens[mockupData.currentScreenIndex];
    const widgetIndex = screen.widgets.findIndex(w => w.id === widgetId);
    
    if (widgetIndex >= 0) {
      // Update properties (excluding ID)
      Object.entries(updates).forEach(([key, value]) => {
        if (key !== 'id') {
          if (key === 'props') {
            // Merge props objects
            screen.widgets[widgetIndex].props = {
              ...screen.widgets[widgetIndex].props,
              ...value
            };
          } else {
            screen.widgets[widgetIndex][key] = value;
          }
        }
      });
      
      return screen.widgets[widgetIndex];
    }
  }
  
  return null;
}

// Delete a widget by ID
function deleteWidget(widgetId) {
  if (mockupData.currentScreenIndex >= 0) {
    const screen = mockupData.screens[mockupData.currentScreenIndex];
    const widgetIndex = screen.widgets.findIndex(w => w.id === widgetId);
    
    if (widgetIndex >= 0) {
      screen.widgets.splice(widgetIndex, 1);
      mockupData.selectedWidgetId = null;
      return true;
    }
  }
  
  return false;
}

// Clear selection
function clearSelection() {
  mockupData.selectedWidgetId = null;
}

// Import mockup data from JSON
function importMockup(jsonData) {
  try {
    const data = JSON.parse(jsonData);
    
    // Validate basic structure
    if (Array.isArray(data.screens)) {
      mockupData.screens = data.screens;
      mockupData.currentScreenIndex = data.screens.length > 0 ? 0 : -1;
      mockupData.selectedWidgetId = null;
      return true;
    }
  } catch (e) {
    console.error('Failed to import mockup data:', e);
  }
  
  return false;
}

// Export mockup data to JSON
function exportMockup() {
  return JSON.stringify({
    screens: mockupData.screens
  });
}

// Initialize with a default screen
function initialize() {
  if (mockupData.screens.length === 0) {
    addScreen();
  }
}

export {
  mockupData,
  addScreen,
  selectScreen,
  getCurrentScreen,
  getScreenAt,
  removeScreen,
  duplicateScreen,
  updateScreen,
  addWidget,
  selectWidget,
  getSelectedWidget,
  updateWidget,
  deleteWidget,
  clearSelection,
  importMockup,
  exportMockup,
  initialize
}; 