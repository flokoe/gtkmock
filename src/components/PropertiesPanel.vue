<template>
  <div class="properties-panel">
    <div v-if="!props.hasSelection && !props.isScreenSelected" class="no-selection">
      <p>Select a widget or screen to edit its properties</p>
    </div>

    <div v-else class="properties-content">
      <!-- Screen Properties -->
      <div v-if="props.isScreenSelected && localScreen" class="properties-form">
        <div class="properties-header">
          <h3>Screen Properties</h3>
        </div>

        <div class="properties-group">
          <h4>General</h4>
          <div class="property-row">
            <label>Name</label>
            <input v-model="localScreen.name" type="text" @change="updateScreen" />
          </div>
        </div>

        <div class="properties-group">
          <h4>Dimensions</h4>
          <div class="property-row">
            <label>Width</label>
            <input v-model.number="localScreen.width" type="number" @change="updateScreen" />
          </div>
          <div class="property-row">
            <label>Height</label>
            <input v-model.number="localScreen.height" type="number" @change="updateScreen" />
          </div>
        </div>
      </div>

      <!-- Visual separator if both screen and widget are selected -->
      <div v-if="props.isScreenSelected && props.hasSelection" class="properties-separator"></div>

      <!-- Widget Properties -->
      <div v-if="props.hasSelection && localWidget" class="properties-form">
        <div class="properties-header">
          <h3>{{ widgetTypeName }} Properties</h3>
        </div>

        <div class="properties-group">
          <h4>Position & Size</h4>
          <div class="property-row">
            <label>X</label>
            <input v-model.number="localWidget.x" type="number" @change="updateWidget" />
          </div>
          <div class="property-row">
            <label>Y</label>
            <input v-model.number="localWidget.y" type="number" @change="updateWidget" />
          </div>
          <div class="property-row">
            <label>Width</label>
            <input v-model.number="localWidget.width" type="number" @change="updateWidget" />
          </div>
          <div class="property-row">
            <label>Height</label>
            <input v-model.number="localWidget.height" type="number" @change="updateWidget" />
          </div>
        </div>

        <!-- Text Properties -->
        <div v-if="hasTextProperty" class="properties-group">
          <h4>Text</h4>
          <div class="property-row">
            <label>Content</label>
            <input v-model="localWidget.props.text" type="text" @change="updateWidget" />
          </div>
        </div>

        <!-- Button Properties -->
        <div v-if="localWidget && localWidget.type === 'button'" class="properties-group">
          <h4>Style</h4>
          <div class="property-row">
            <label>Button Style</label>
            <select v-model="localWidget.props.buttonStyle" @change="updateWidget">
              <option value="default">Default</option>
              <option value="suggested">Suggested Action</option>
              <option value="destructive">Destructive Action</option>
              <option value="pill">Pill Button</option>
            </select>
          </div>
        </div>

        <!-- Entry Properties -->
        <div v-if="localWidget && localWidget.type === 'entry'" class="properties-group">
          <h4>Input Settings</h4>
          <div class="property-row">
            <label>Placeholder</label>
            <input v-model="localWidget.props.placeholder" type="text" @change="updateWidget" />
          </div>
          <div class="property-row checkbox-row">
            <label>Password</label>
            <input v-model="localWidget.props.password" type="checkbox" @change="updateWidget" />
          </div>
        </div>

        <!-- Checkbox Properties -->
        <div
          v-if="localWidget && (localWidget.type === 'checkbox' || localWidget.type === 'switch')"
          class="properties-group"
        >
          <h4>State</h4>
          <div class="property-row checkbox-row">
            <label>Checked</label>
            <input v-model="localWidget.props.checked" type="checkbox" @change="updateWidget" />
          </div>
        </div>

        <!-- Dropdown Properties -->
        <div v-if="localWidget && localWidget.type === 'dropdown'" class="properties-group">
          <h4>Items</h4>
          <div v-for="(item, index) in localWidget.props.items" :key="index" class="property-row">
            <input v-model="localWidget.props.items[index]" type="text" @change="updateWidget" />
            <button class="btn-icon" @click="removeDropdownItem(index)">🗑️</button>
          </div>
          <button class="btn btn-sm" @click="addDropdownItem">Add Item</button>
        </div>

        <!-- Box Properties -->
        <div v-if="localWidget && localWidget.type === 'box'" class="properties-group">
          <h4>Container</h4>
          <div class="property-row">
            <label>Orientation</label>
            <select v-model="localWidget.props.orientation" @change="updateWidget">
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </div>
          <div class="property-row">
            <label>Spacing</label>
            <input
              v-model.number="localWidget.props.spacing"
              type="number"
              @change="updateWidget"
            />
          </div>
        </div>

        <div class="properties-actions">
          <button class="btn btn-danger" @click="deleteWidget">Delete Widget</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref, watch } from 'vue';

  const props = defineProps({
    hasSelection: {
      type: Boolean,
      default: false,
    },
    selectedWidget: {
      type: Object,
      default: null,
    },
    isScreenSelected: {
      type: Boolean,
      default: false,
    },
    selectedScreen: {
      type: Object,
      default: null,
    },
  });

  const emit = defineEmits(['update-widget', 'update-screen', 'delete-widget']);

  // Local reactive copies of props to avoid direct prop mutation
  const localWidget = ref(props.selectedWidget ? { ...props.selectedWidget } : null);
  const localScreen = ref(props.selectedScreen ? { ...props.selectedScreen } : null);

  // Watch for changes in props to update local copies
  watch(
    () => props.selectedWidget,
    newWidget => {
      localWidget.value = newWidget ? { ...newWidget } : null;
    },
    { deep: true }
  );

  watch(
    () => props.selectedScreen,
    newScreen => {
      localScreen.value = newScreen ? { ...newScreen } : null;
    },
    { deep: true }
  );

  // Computed properties
  const widgetTypeName = computed(() => {
    if (!localWidget.value) return '';

    const typeMap = {
      label: 'Label',
      button: 'Button',
      entry: 'Entry',
      checkbox: 'Check Button',
      switch: 'Switch',
      dropdown: 'Dropdown',
      box: 'Box',
      grid: 'Grid',
      headerbar: 'HeaderBar',
      windowControls: 'Window Controls',
      image: 'Image',
      separator: 'Separator',
    };

    return typeMap[localWidget.value.type] || localWidget.value.type;
  });

  // Check if the widget has a text property
  const hasTextProperty = computed(() => {
    if (!localWidget.value) return false;

    return (
      ['label', 'button', 'entry', 'checkbox'].includes(localWidget.value.type) &&
      localWidget.value.props &&
      'text' in localWidget.value.props
    );
  });

  // Methods
  const updateWidget = () => {
    emit('update-widget', localWidget.value);
  };

  const updateScreen = () => {
    emit('update-screen', localScreen.value);
  };

  const deleteWidget = () => {
    emit('delete-widget');
  };

  const addDropdownItem = () => {
    if (localWidget.value?.props?.items) {
      localWidget.value.props.items.push(`Item ${localWidget.value.props.items.length + 1}`);
      updateWidget();
    }
  };

  const removeDropdownItem = index => {
    if (localWidget.value?.props?.items && localWidget.value.props.items.length > 1) {
      localWidget.value.props.items.splice(index, 1);
      updateWidget();
    }
  };
</script>

<style scoped>
  .properties-panel {
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .properties-content {
    flex: 1;
    overflow-y: auto;
    padding-right: 8px;
  }

  .no-selection {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    color: var(--gray-5);
    text-align: center;
    padding: 30px;
  }

  .properties-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .properties-header {
    margin-bottom: -12px;
  }

  .properties-header h3 {
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--gray-7);
  }

  .properties-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .properties-group h4 {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--gray-6);
    margin-bottom: 2px;
  }

  .property-row {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .property-row label {
    font-size: 0.85rem;
    color: var(--gray-6);
  }

  .property-row input[type='text'],
  .property-row input[type='number'],
  .property-row select {
    flex: 1;
    padding: 6px 8px;
    border-radius: 4px;
    border: none;
    font-size: 0.85rem;
    background-color: var(--gray-1);
  }

  .property-row input[type='checkbox'] {
    width: 16px;
    height: 16px;
  }

  .checkbox-row {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .btn-danger {
    background-color: #e01b24;
    color: white;
    margin-top: 10px;
  }

  .properties-separator {
    height: 1px;
    background-color: var(--gray-3);
    margin: 16px 0;
  }

  .properties-actions {
    margin-top: 12px;
  }
</style>
