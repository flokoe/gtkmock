import { describe, it, expect } from 'vitest';
import {
  getWidgetsByCategory,
  getAllWidgets,
  getWidgetComponent,
  getWidgetMetadata,
  getWidgetDimensions,
  generateWidgetId
} from '../../../src/components/WidgetRegistry';

describe('WidgetRegistry', () => {
  it('returns widgets by category', () => {
    const basicWidgets = getWidgetsByCategory('basic');
    expect(basicWidgets.length).toBeGreaterThan(0);
    expect(basicWidgets.some(w => w.displayName === 'Button')).toBe(true);
    expect(basicWidgets.some(w => w.displayName === 'Label')).toBe(true);
    
    const inputWidgets = getWidgetsByCategory('input');
    expect(inputWidgets.length).toBeGreaterThan(0);
    expect(inputWidgets.some(w => w.displayName === 'Entry')).toBe(true);
    expect(inputWidgets.some(w => w.displayName === 'Checkbox')).toBe(true);
  });
  
  it('returns all widgets', () => {
    const allWidgets = getAllWidgets();
    expect(allWidgets.length).toBeGreaterThan(0);
    
    // Check if it contains widgets from different categories
    const categories = new Set(allWidgets.map(w => w.category));
    expect(categories.size).toBeGreaterThan(1);
    expect(categories.has('basic')).toBe(true);
    expect(categories.has('input')).toBe(true);
  });
  
  it('returns widget component by type', () => {
    const buttonComponent = getWidgetComponent('button');
    expect(buttonComponent).toBeDefined();
    
    const labelComponent = getWidgetComponent('label');
    expect(labelComponent).toBeDefined();
    
    const unknownComponent = getWidgetComponent('unknown');
    expect(unknownComponent).toBeDefined(); // Should return placeholder
  });
  
  it('returns widget metadata by type', () => {
    const buttonMeta = getWidgetMetadata('button');
    expect(buttonMeta).not.toBeNull();
    expect(buttonMeta?.displayName).toBe('Button');
    expect(buttonMeta?.category).toBe('basic');
    
    const unknownMeta = getWidgetMetadata('unknown');
    expect(unknownMeta).toBeNull();
  });
  
  it('returns widget dimensions by type', () => {
    const buttonDimensions = getWidgetDimensions('button');
    expect(buttonDimensions).toBeDefined();
    
    // Don't check for non-null width/height, as they can be null by design
    expect(buttonDimensions).toHaveProperty('width');
    expect(buttonDimensions).toHaveProperty('height');
    
    const unknownDimensions = getWidgetDimensions('unknown');
    // Should return default dimensions
    expect(unknownDimensions).toBeDefined();
    expect(unknownDimensions.width).toBeNull();
    expect(unknownDimensions.height).toBeNull();
  });
  
  it('generates unique widget IDs', () => {
    const id1 = generateWidgetId();
    const id2 = generateWidgetId();
    
    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
    expect(id1.length).toBeGreaterThan(0);
  });
}); 