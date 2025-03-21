import { Widget } from './widget';

// Screen definition
export interface Screen {
  id: string;
  name: string;
  width: number;
  height: number;
  widgets: Widget[];
}

// Complete mockup data structure
export interface MockupData {
  screens: Screen[];
  currentScreenIndex: number;
  selectedWidgetId: string | null;
}

// Functions that may be exported from mockup store
export interface MockupStore {
  // Screen operations
  addScreen: () => number;
  selectScreen: (index: number) => Screen | null;
  getCurrentScreen: () => Screen | null;
  getScreenAt: (index: number) => Screen | null;
  renameScreen: (index: number, name: string) => void;
  deleteScreen: (index: number) => void;

  // Widget operations
  addWidget: (type: string, x?: number, y?: number) => Widget | null;
  selectWidget: (id: string | null) => Widget | null;
  getSelectedWidget: () => Widget | null;
  updateWidgetPosition: (id: string, x: number, y: number) => void;
  updateWidgetSize: (id: string, width: number, height: number) => void;
  updateWidgetProperty: (id: string, propertyName: string, value: any) => void;
  deleteWidget: (id: string) => void;

  // Other operations
  resetStore: () => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
}
