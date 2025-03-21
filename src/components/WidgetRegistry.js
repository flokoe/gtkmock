// Widget Registry - Maps widget types to components
import { markRaw } from 'vue';
import { v4 as uuidv4 } from 'uuid';

// Import widgets and their metadata
import LabelWidget, { widgetMeta as labelMeta } from './widgets/LabelWidget.vue';
import ButtonWidget, { widgetMeta as buttonMeta } from './widgets/ButtonWidget.vue';
import EntryWidget, { widgetMeta as entryMeta } from './widgets/EntryWidget.vue';
import CheckboxWidget, { widgetMeta as checkboxMeta } from './widgets/CheckboxWidget.vue';
import SwitchWidget, { widgetMeta as switchMeta } from './widgets/SwitchWidget.vue';
import PlaceholderWidget, { placeholderWidgets } from './widgets/PlaceholderWidget.vue';

// Initialize registry with implemented widgets
const widgetRegistry = {
  // Add implemented widgets with their metadata
  'label': {
    ...labelMeta,
    component: markRaw(LabelWidget)
  },
  'button': {
    ...buttonMeta,
    component: markRaw(ButtonWidget)
  },
  'entry': {
    ...entryMeta,
    component: markRaw(EntryWidget)
  },
  'checkbox': {
    ...checkboxMeta,
    component: markRaw(CheckboxWidget)
  },
  'switch': {
    ...switchMeta,
    component: markRaw(SwitchWidget)
  },
};

// Add placeholder widgets to the registry
Object.entries(placeholderWidgets).forEach(([id, meta]) => {
  widgetRegistry[id] = {
    ...meta,
    component: markRaw(PlaceholderWidget)
  };
});

// Get all widgets by category
export function getWidgetsByCategory(category) {
  return Object.values(widgetRegistry)
    .filter(widget => widget.category === category);
}

// Get all widgets
export function getAllWidgets() {
  return Object.values(widgetRegistry);
}

// Get a component for a given widget type
export function getWidgetComponent(type) {
  return widgetRegistry[type]?.component || 'div';
}

// Get widget metadata
export function getWidgetMetadata(type) {
  return widgetRegistry[type] || null;
}

// Get default dimensions for a widget type
export function getWidgetDimensions(type) {
  return widgetRegistry[type]?.dimensions || { width: null, height: null };
}

// Generate a unique ID for a widget instance
export function generateWidgetId() {
  return uuidv4();
} 