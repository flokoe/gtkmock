import { Component } from 'vue';

// Basic widget dimensions
export interface WidgetDimensions {
  width: number | null;
  height: number | null;
}

// Property types that can be edited in the properties panel
export type PropertyType = 'string' | 'number' | 'boolean' | 'select' | 'color';

// Definition of a property that can be edited
export interface PropertyDefinition {
  name: string;
  label: string;
  type: PropertyType;
  defaultValue: any;
  options?: string[]; // For select type
}

// Widget metadata information
export interface WidgetMetadata {
  displayName: string;
  category: string;
  description: string;
  properties: PropertyDefinition[];
  dimensions: WidgetDimensions;
  icon?: string;
  component?: Component;
}

// Widget instance as stored in the mockup
export interface Widget {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  properties: Record<string, any>;
  zIndex: number;
}

// Registry of all available widget types
export interface WidgetRegistry {
  [key: string]: WidgetMetadata;
}
