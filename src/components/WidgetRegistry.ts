// Widget Registry - Maps widget types to components
import { markRaw } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { WidgetMetadata, WidgetDimensions, WidgetRegistry } from '@/types/widget';

// Import widget components
import LabelWidgetVue from './widgets/LabelWidget.vue';
import ButtonWidgetVue from './widgets/ButtonWidget.vue';
import EntryWidgetVue from './widgets/EntryWidget.vue';
import CheckboxWidgetVue from './widgets/CheckboxWidget.vue';
import SwitchWidgetVue from './widgets/SwitchWidget.vue';
import PlaceholderWidgetVue from './widgets/PlaceholderWidget.vue';

// Define widget metadata
const labelMeta: WidgetMetadata = {
  displayName: 'Label',
  category: 'basic',
  description: 'A simple text label',
  properties: [],
  dimensions: { width: null, height: null },
  icon: 'T',
};

const buttonMeta: WidgetMetadata = {
  displayName: 'Button',
  category: 'basic',
  description: 'A clickable button',
  properties: [],
  dimensions: { width: null, height: null },
  icon: 'B',
};

const entryMeta: WidgetMetadata = {
  displayName: 'Entry',
  category: 'input',
  description: 'A text input field',
  properties: [],
  dimensions: { width: null, height: null },
  icon: 'E',
};

const checkboxMeta: WidgetMetadata = {
  displayName: 'Checkbox',
  category: 'input',
  description: 'A checkbox input',
  properties: [],
  dimensions: { width: null, height: null },
  icon: '☑',
};

const switchMeta: WidgetMetadata = {
  displayName: 'Switch',
  category: 'input',
  description: 'A toggle switch',
  properties: [],
  dimensions: { width: null, height: null },
  icon: '⇄',
};

// Define placeholder widgets
const placeholderWidgets: Record<string, WidgetMetadata> = {
  placeholder: {
    displayName: 'Placeholder',
    category: 'utility',
    description: 'A placeholder for future widgets',
    properties: [],
    dimensions: { width: null, height: null },
    icon: '?',
  },
};

// Initialize registry with implemented widgets
const widgetRegistry: WidgetRegistry = {
  // Add implemented widgets with their metadata
  label: {
    ...labelMeta,
    component: markRaw(LabelWidgetVue),
  },
  button: {
    ...buttonMeta,
    component: markRaw(ButtonWidgetVue),
  },
  entry: {
    ...entryMeta,
    component: markRaw(EntryWidgetVue),
  },
  checkbox: {
    ...checkboxMeta,
    component: markRaw(CheckboxWidgetVue),
  },
  switch: {
    ...switchMeta,
    component: markRaw(SwitchWidgetVue),
  },
};

// Add placeholder widgets to the registry
Object.entries(placeholderWidgets).forEach(([id, meta]) => {
  widgetRegistry[id] = {
    ...meta,
    component: markRaw(PlaceholderWidgetVue),
  };
});

// Get all widgets by category
export function getWidgetsByCategory(category: string): WidgetMetadata[] {
  return Object.values(widgetRegistry).filter(widget => widget.category === category);
}

// Get all widgets
export function getAllWidgets(): WidgetMetadata[] {
  return Object.values(widgetRegistry);
}

// Get a component for a given widget type
export function getWidgetComponent(type: string) {
  return widgetRegistry[type]?.component || 'div';
}

// Get widget metadata
export function getWidgetMetadata(type: string): WidgetMetadata | null {
  return widgetRegistry[type] || null;
}

// Get default dimensions for a widget type
export function getWidgetDimensions(type: string): WidgetDimensions {
  return widgetRegistry[type]?.dimensions || { width: null, height: null };
}

// Generate a unique ID for a widget instance
export function generateWidgetId(): string {
  return uuidv4();
}
