import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import MockupCanvas from '../../../src/components/MockupCanvas.vue';
import * as mockupStore from '../../../src/store/mockupStore';

// Create spy versions of store functions to track calls
vi.spyOn(mockupStore, 'addScreen');
vi.spyOn(mockupStore, 'addWidget');
vi.spyOn(mockupStore, 'selectScreen');

// Mock the UUID function
vi.mock('uuid', () => ({
  v4: () => `mock-uuid-${Math.random().toString(36).substring(2, 9)}`,
}));

describe('MockupCanvas', () => {
  beforeEach(() => {
    // Reset mocks and mockup data before each test
    vi.clearAllMocks();
    mockupStore.initialize();
  });

  it('renders empty canvas when no screens exist', () => {
    // Ensure mockupData has no screens
    mockupStore.mockupData.screens = [];

    const wrapper = mount(MockupCanvas);
    expect(wrapper.find('.empty-canvas').exists()).toBe(true);
    expect(wrapper.find('.empty-canvas p').text()).toContain('Drag and drop widgets');
  });

  it('adds a new screen when clicking Add Screen button', async () => {
    // Mock the addScreen function to return a specific index
    vi.mocked(mockupStore.addScreen).mockReturnValue(0);

    // Ensure mockupData has no screens
    mockupStore.mockupData.screens = [];

    const wrapper = mount(MockupCanvas);
    await wrapper.find('.empty-canvas button').trigger('click');

    // Verify addScreen was called
    expect(mockupStore.addScreen).toHaveBeenCalled();
  });

  it('allows drag and drop of widgets to different screens', async () => {
    // Set up three screens in the mock data
    mockupStore.mockupData.screens = [
      {
        id: 'screen-1',
        name: 'Screen 1',
        width: 300,
        height: 500,
        widgets: [],
      },
      {
        id: 'screen-2',
        name: 'Screen 2',
        width: 300,
        height: 500,
        widgets: [],
      },
      {
        id: 'screen-3',
        name: 'Screen 3',
        width: 300,
        height: 500,
        widgets: [],
      },
    ];
    mockupStore.mockupData.currentScreenIndex = 0;

    // Create a mock widget that will be "dropped"
    const widgetData = {
      type: 'button',
      defaultProps: { text: 'Test Button' },
    };

    // Mock the addWidget function to simulate adding to the specific screen
    vi.mocked(mockupStore.addWidget).mockImplementation((screenIndex, type, x, y) => {
      const widget = {
        id: 'mock-widget-id',
        type,
        x,
        y,
        width: 100,
        height: 40,
        properties: widgetData.defaultProps,
        zIndex: 1,
      };

      // Add the widget to the specified screen
      mockupStore.mockupData.screens[screenIndex].widgets.push(widget);
      return widget;
    });

    const wrapper = mount(MockupCanvas);

    // Get component instance
    const vm = wrapper.vm;

    // Test dropping on the second screen
    const dropEventSecondScreen = {
      preventDefault: vi.fn(),
      dataTransfer: {
        getData: () => JSON.stringify(widgetData),
      },
      clientX: 150,
      clientY: 150,
      target: {
        getBoundingClientRect: () => ({
          left: 100,
          top: 100,
        }),
      },
    };

    // @ts-expect-error - access the component's internal methods
    await vm.onDropToScreen(dropEventSecondScreen, 1);

    // Verify addWidget was called with the correct screen index
    expect(mockupStore.addWidget).toHaveBeenCalledWith(
      1, // second screen index
      'button',
      expect.any(Number),
      expect.any(Number),
      widgetData.defaultProps
    );

    // Verify the widget was added to the second screen
    expect(mockupStore.mockupData.screens[1].widgets.length).toBe(1);
    expect(mockupStore.mockupData.screens[0].widgets.length).toBe(0);

    // Verify selectScreen was called with the correct index
    expect(mockupStore.selectScreen).toHaveBeenCalledWith(1);

    // Now test dropping on the third screen
    const dropEventThirdScreen = {
      preventDefault: vi.fn(),
      dataTransfer: {
        getData: () =>
          JSON.stringify({
            type: 'label',
            defaultProps: { text: 'Test Label' },
          }),
      },
      clientX: 200,
      clientY: 200,
      target: {
        getBoundingClientRect: () => ({
          left: 150,
          top: 150,
        }),
      },
    };

    // Reset the mocks to track the new calls
    vi.clearAllMocks();

    // @ts-expect-error - access the component's internal methods
    await vm.onDropToScreen(dropEventThirdScreen, 2);

    // Verify addWidget was called with the third screen index
    expect(mockupStore.addWidget).toHaveBeenCalledWith(
      2, // third screen index
      'label',
      expect.any(Number),
      expect.any(Number),
      { text: 'Test Label' }
    );

    // Verify the widget was added to the third screen
    expect(mockupStore.mockupData.screens[2].widgets.length).toBe(1);
    expect(mockupStore.mockupData.screens[1].widgets.length).toBe(1);
    expect(mockupStore.mockupData.screens[0].widgets.length).toBe(0);

    // Verify selectScreen was called with the third screen index
    expect(mockupStore.selectScreen).toHaveBeenCalledWith(2);
  });

  it('properly calculates widget coordinates based on drop position', async () => {
    // Set up the mock data with one screen
    mockupStore.mockupData.screens = [
      {
        id: 'screen-1',
        name: 'Screen 1',
        width: 300,
        height: 500,
        widgets: [],
      },
    ];
    mockupStore.mockupData.currentScreenIndex = 0;

    // Create a mock widget that will be "dropped"
    const widgetData = {
      type: 'button',
      defaultProps: { text: 'Test Button' },
    };

    // Define specific coordinates for the test
    const dropX = 150;
    const dropY = 200;
    const screenLeft = 50;
    const screenTop = 100;

    // Expected coordinates after calculation
    const zoom = 1; // Default zoom
    const expectedX = (dropX - screenLeft) / zoom;
    const expectedY = (dropY - screenTop) / zoom;

    // Track actual coordinates passed to addWidget
    let actualX, actualY;

    // Mock the addWidget function to capture coordinates
    vi.mocked(mockupStore.addWidget).mockImplementation((screenIndex, type, x, y) => {
      actualX = x;
      actualY = y;

      const widget = {
        id: 'mock-widget-id',
        type,
        x,
        y,
        width: 100,
        height: 40,
        properties: widgetData.defaultProps,
        zIndex: 1,
      };

      mockupStore.mockupData.screens[screenIndex].widgets.push(widget);
      return widget;
    });

    const wrapper = mount(MockupCanvas);
    const vm = wrapper.vm;

    // Create the drop event
    const dropEvent = {
      preventDefault: vi.fn(),
      dataTransfer: {
        getData: () => JSON.stringify(widgetData),
      },
      clientX: dropX,
      clientY: dropY,
      target: {
        getBoundingClientRect: () => ({
          left: screenLeft,
          top: screenTop,
        }),
      },
    };

    // @ts-expect-error - access the component's internal methods
    await vm.onDropToScreen(dropEvent, 0);

    // Verify coordinates were calculated correctly
    expect(actualX).toBeCloseTo(expectedX);
    expect(actualY).toBeCloseTo(expectedY);

    // Verify widget was added to the screen
    expect(mockupStore.mockupData.screens[0].widgets.length).toBe(1);
    expect(mockupStore.mockupData.screens[0].widgets[0].x).toBeCloseTo(expectedX);
    expect(mockupStore.mockupData.screens[0].widgets[0].y).toBeCloseTo(expectedY);
  });
});
