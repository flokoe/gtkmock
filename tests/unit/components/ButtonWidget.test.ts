import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ButtonWidget, { widgetMeta } from '../../../src/components/widgets/ButtonWidget.vue';

describe('ButtonWidget', () => {
  it('renders with default props', () => {
    const wrapper = mount(ButtonWidget);
    expect(wrapper.text()).toBe('Button');
    expect(wrapper.classes()).toContain('gtk-button');
    expect(wrapper.classes()).not.toContain('suggested-action');
    expect(wrapper.classes()).not.toContain('destructive-action');
    expect(wrapper.classes()).not.toContain('pill-button');
  });

  it('renders with custom text', () => {
    const wrapper = mount(ButtonWidget, {
      props: {
        text: 'Custom Button'
      }
    });
    expect(wrapper.text()).toBe('Custom Button');
  });

  it('applies suggested action style', () => {
    const wrapper = mount(ButtonWidget, {
      props: {
        buttonStyle: 'suggested'
      }
    });
    expect(wrapper.classes()).toContain('suggested-action');
  });

  it('applies destructive action style', () => {
    const wrapper = mount(ButtonWidget, {
      props: {
        buttonStyle: 'destructive'
      }
    });
    expect(wrapper.classes()).toContain('destructive-action');
  });

  it('applies pill button style', () => {
    const wrapper = mount(ButtonWidget, {
      props: {
        buttonStyle: 'pill'
      }
    });
    expect(wrapper.classes()).toContain('pill-button');
  });

  it('exposes widget metadata', () => {
    // Test that the widget metadata is properly exported
    expect(widgetMeta).toBeDefined();
    expect(widgetMeta.id).toBe('button');
    expect(widgetMeta.name).toBe('Button');
    expect(widgetMeta.category).toBe('basic');
  });
}); 