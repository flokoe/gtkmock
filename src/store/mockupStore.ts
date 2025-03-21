import { reactive } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { getWidgetDimensions, getWidgetMetadata } from '@/components/WidgetRegistry';
import { MockupData, Screen, Widget, MockupStore } from '@/types/mockup';

// The mockup store holds all screens and widgets data
// This separates the data model from the rendering

const mockupData: MockupData = reactive({
  screens: [], // Array of screen objects
  currentScreenIndex: -1,
  selectedWidgetId: null, // Changed from index to ID
});

// Create a new screen with a unique ID
function addScreen(): number {
  const screen: Screen = {
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
function selectScreen(index: number): Screen | null {
  if (index >= 0 && index < mockupData.screens.length) {
    mockupData.currentScreenIndex = index;
    mockupData.selectedWidgetId = null;
    return mockupData.screens[index];
  }
  return null;
}

// Get the currently selected screen
function getCurrentScreen(): Screen | null {
  if (mockupData.currentScreenIndex >= 0 && mockupData.currentScreenIndex < mockupData.screens.length) {
    return mockupData.screens[mockupData.currentScreenIndex];
  }
  return null;
}

// Get a screen by index
function getScreenAt(index: number): Screen | null {
  if (index >= 0 && index < mockupData.screens.length) {
    return mockupData.screens[index];
  }
  return null;
}

// Remove a screen by index
function removeScreen(index: number): Screen | null {
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
function duplicateScreen(index: number): number {
  if (index >= 0 && index < mockupData.screens.length) {
    // Deep clone the screen and give it a new ID
    const sourceScreen = mockupData.screens[index];
    const newScreen: Screen = JSON.parse(JSON.stringify(sourceScreen));
    
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
function updateScreen(screenIndex: number, updates: Partial<Screen>): Screen | null {
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

// Add a widget to the current screen
function addWidget(type: string, x: number = 100, y: number = 100): Widget | null {
  const currentScreen = getCurrentScreen();
  if (!currentScreen) return null;
  
  // Get metadata for this widget type
  const metadata = getWidgetMetadata(type);
  if (!metadata) return null;
  
  // Get default dimensions
  const dimensions = getWidgetDimensions(type);
  
  // Create the widget with default properties
  const widget: Widget = {
    id: uuidv4(),
    type: type,
    x: x,
    y: y,
    width: dimensions.width || 100,
    height: dimensions.height || 40,
    properties: {},
    zIndex: currentScreen.widgets.length + 1
  };
  
  // Initialize default properties based on metadata
  if (metadata.properties) {
    metadata.properties.forEach(prop => {
      widget.properties[prop.name] = prop.defaultValue;
    });
  }
  
  // Add to screen
  currentScreen.widgets.push(widget);
  
  // Select the new widget
  selectWidget(widget.id);
  
  return widget;
}

// Select a widget by ID
function selectWidget(widgetId: string): Widget | null {
  mockupData.selectedWidgetId = widgetId;
  
  // Find the widget
  if (mockupData.currentScreenIndex >= 0) {
    const screen = mockupData.screens[mockupData.currentScreenIndex];
    return screen.widgets.find(widget => widget.id === widgetId) || null;
  }
  
  return null;
}

// Get the currently selected widget
function getSelectedWidget(): Widget | null {
  if (mockupData.currentScreenIndex >= 0 && mockupData.selectedWidgetId) {
    const screen = mockupData.screens[mockupData.currentScreenIndex];
    return screen.widgets.find(widget => widget.id === mockupData.selectedWidgetId) || null;
  }
  
  return null;
}

// Update a widget by ID
function updateWidget(widgetId: string, updates: Partial<Widget>): Widget | null {
  if (mockupData.currentScreenIndex >= 0) {
    const screen = mockupData.screens[mockupData.currentScreenIndex];
    const widgetIndex = screen.widgets.findIndex(w => w.id === widgetId);
    
    if (widgetIndex >= 0) {
      // Update properties (excluding ID)
      Object.entries(updates).forEach(([key, value]) => {
        if (key !== 'id') {
          if (key === 'properties') {
            // Merge properties objects
            screen.widgets[widgetIndex].properties = {
              ...screen.widgets[widgetIndex].properties,
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
function deleteWidget(widgetId: string): boolean {
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
function importMockup(jsonData: string): boolean {
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
function exportMockup(): string {
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

// Export the store
export const useMockupStore = (): MockupStore => {
  return {
    // Screen operations
    addScreen,
    selectScreen,
    getCurrentScreen,
    getScreenAt,
    renameScreen: (index: number, name: string): void => {
      if (index >= 0 && index < mockupData.screens.length) {
        mockupData.screens[index].name = name;
      }
    },
    deleteScreen: removeScreen,
    
    // Widget operations
    addWidget,
    selectWidget,
    getSelectedWidget,
    updateWidgetPosition: (widgetId: string, x: number, y: number): Widget | null => {
      const widget = selectWidget(widgetId);
      if (widget) {
        widget.x = x;
        widget.y = y;
        return updateWidget(widgetId, { x, y });
      }
      return null;
    },
    updateWidgetSize: (widgetId: string, width: number, height: number): Widget | null => {
      const widget = selectWidget(widgetId);
      if (widget) {
        widget.width = width;
        widget.height = height;
        return updateWidget(widgetId, { width, height });
      }
      return null;
    },
    updateWidgetProperty: (widgetId: string, propertyName: string, value: any): Widget | null => {
      const widget = selectWidget(widgetId);
      if (widget) {
        widget.properties[propertyName] = value;
        return updateWidget(widgetId, { properties: widget.properties });
      }
      return null;
    },
    deleteWidget,
    
    // Other operations
    resetStore: initialize,
    exportData: exportMockup,
    importData: importMockup
  };
}

// Export these functions directly for direct imports
export { 
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
  initialize,
  mockupData
}; 