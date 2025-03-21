// Widget Registry - Maps widget types to components
import { markRaw } from 'vue';
import LabelWidget from './widgets/LabelWidget.vue';
import ButtonWidget from './widgets/ButtonWidget.vue';
import EntryWidget from './widgets/EntryWidget.vue';
import PlaceholderWidget from './widgets/PlaceholderWidget.vue';

// Map actual implemented widgets
const actualWidgets = {
  'label': markRaw(LabelWidget),
  'button': markRaw(ButtonWidget),
  'entry': markRaw(EntryWidget),
};

// All supported widget types (even if not fully implemented)
const supportedWidgetTypes = [
  'label',
  'button',
  'entry',
  'checkbox',
  'switch',
  'dropdown',
  'box',
  'grid',
  'headerbar',
  'windowControls',
  'image',
  'separator'
];

// Default widget dimensions (used when creating new widgets)
export const widgetDimensions = {
  'button': { width: 80, height: 30 },
  'entry': { width: 150, height: 30 },
  'checkbox': { width: 120, height: 24 },
  'switch': { width: 60, height: 24 },
  'label': { width: null, height: null },
  'image': { width: 100, height: 100 },
  'separator': { width: 150, height: 1 },
  'box': { width: 200, height: 150 },
  'grid': { width: 200, height: 150 },
  'headerbar': { width: 300, height: 48 },
  'windowControls': { width: 80, height: 30 },
  'dropdown': { width: 150, height: 30 },
};

// Get a component for a given widget type
export function getWidgetComponent(type) {
  // If we have a real implementation, use it
  if (actualWidgets[type]) {
    return actualWidgets[type];
  }
  
  // If it's a supported widget type, use a placeholder
  if (supportedWidgetTypes.includes(type)) {
    return markRaw(PlaceholderWidget);
  }
  
  // Fallback to a div
  return 'div';
}

// Get default dimensions for a widget type
export function getWidgetDimensions(type) {
  return widgetDimensions[type] || { width: null, height: null };
} 