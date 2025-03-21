<template>
  <div class="properties-panel">
    <div v-if="!hasSelection" class="no-selection">
      <p>Select a widget to edit its properties</p>
    </div>
    
    <div v-else class="properties-form">
      <div class="properties-header">
        <h3>{{ widgetTypeName }} Properties</h3>
      </div>
      
      <div class="properties-group">
        <h4>Position & Size</h4>
        <div class="property-row">
          <label>X</label>
          <input type="number" v-model.number="selectedWidget.x" @change="updateWidget" />
        </div>
        <div class="property-row">
          <label>Y</label>
          <input type="number" v-model.number="selectedWidget.y" @change="updateWidget" />
        </div>
        <div class="property-row">
          <label>Width</label>
          <input type="number" v-model.number="selectedWidget.width" @change="updateWidget" />
        </div>
        <div class="property-row">
          <label>Height</label>
          <input type="number" v-model.number="selectedWidget.height" @change="updateWidget" />
        </div>
      </div>
      
      <!-- Text Properties -->
      <div v-if="['label', 'button', 'entry'].includes(selectedWidget.type)" class="properties-group">
        <h4>Text</h4>
        <div class="property-row">
          <label>Content</label>
          <input type="text" v-model="selectedWidget.props.text" @change="updateWidget" />
        </div>
      </div>
      
      <!-- Button Properties -->
      <div v-if="selectedWidget.type === 'button'" class="properties-group">
        <h4>Style</h4>
        <div class="property-row">
          <label>Button Style</label>
          <select v-model="buttonStyle" @change="updateButtonStyle">
            <option value="default">Default</option>
            <option value="suggested">Suggested Action</option>
            <option value="destructive">Destructive Action</option>
            <option value="pill">Pill Button</option>
          </select>
        </div>
      </div>
      
      <!-- Entry Properties -->
      <div v-if="selectedWidget.type === 'entry'" class="properties-group">
        <h4>Input Settings</h4>
        <div class="property-row">
          <label>Placeholder</label>
          <input type="text" v-model="selectedWidget.props.placeholder" @change="updateWidget" />
        </div>
        <div class="property-row checkbox-row">
          <label>Password</label>
          <input type="checkbox" v-model="selectedWidget.props.password" @change="updateWidget" />
        </div>
      </div>
      
      <!-- Checkbox Properties -->
      <div v-if="selectedWidget.type === 'checkbox' || selectedWidget.type === 'switch'" class="properties-group">
        <h4>State</h4>
        <div class="property-row checkbox-row">
          <label>Checked</label>
          <input type="checkbox" v-model="selectedWidget.props.checked" @change="updateWidget" />
        </div>
      </div>
      
      <!-- Dropdown Properties -->
      <div v-if="selectedWidget.type === 'dropdown'" class="properties-group">
        <h4>Items</h4>
        <div v-for="(item, index) in selectedWidget.props.items" :key="index" class="property-row">
          <input type="text" v-model="selectedWidget.props.items[index]" @change="updateWidget" />
          <button class="btn-icon" @click="removeDropdownItem(index)">🗑️</button>
        </div>
        <button class="btn btn-sm" @click="addDropdownItem">Add Item</button>
      </div>
      
      <!-- Box Properties -->
      <div v-if="selectedWidget.type === 'box'" class="properties-group">
        <h4>Container</h4>
        <div class="property-row">
          <label>Orientation</label>
          <select v-model="selectedWidget.props.orientation" @change="updateWidget">
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </select>
        </div>
        <div class="property-row">
          <label>Spacing</label>
          <input type="number" v-model.number="selectedWidget.props.spacing" @change="updateWidget" />
        </div>
      </div>
      
      <div class="properties-actions">
        <button class="btn btn-danger" @click="deleteWidget">Delete Widget</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// These would be provided by the parent component in a real implementation
// For now, we'll simulate them with empty data
const hasSelection = ref(false);
const selectedWidget = ref(null);

// Computed properties
const widgetTypeName = computed(() => {
  if (!selectedWidget.value) return '';
  
  const typeMap = {
    'label': 'Label',
    'button': 'Button',
    'entry': 'Entry',
    'checkbox': 'Check Button',
    'switch': 'Switch',
    'dropdown': 'Dropdown',
    'box': 'Box',
    'grid': 'Grid',
    'headerbar': 'HeaderBar',
    'windowControls': 'Window Controls',
    'image': 'Image',
    'separator': 'Separator'
  };
  
  return typeMap[selectedWidget.value.type] || selectedWidget.value.type;
});

// Button style property (would be linked to actual CSS classes)
const buttonStyle = ref('default');

// Methods
const updateWidget = () => {
  // This would update the widget in the parent component
  console.log('Widget updated:', selectedWidget.value);
};

const updateButtonStyle = () => {
  // Update button style class
  console.log('Button style updated to:', buttonStyle.value);
  updateWidget();
};

const deleteWidget = () => {
  // This would delete the selected widget
  console.log('Delete widget');
  hasSelection.value = false;
  selectedWidget.value = null;
};

const addDropdownItem = () => {
  if (selectedWidget.value?.props?.items) {
    selectedWidget.value.props.items.push(`Item ${selectedWidget.value.props.items.length + 1}`);
    updateWidget();
  }
};

const removeDropdownItem = (index) => {
  if (selectedWidget.value?.props?.items && selectedWidget.value.props.items.length > 1) {
    selectedWidget.value.props.items.splice(index, 1);
    updateWidget();
  }
};

// Simulating a selected widget for demonstration purposes
setTimeout(() => {
  hasSelection.value = true;
  selectedWidget.value = {
    type: 'button',
    x: 50,
    y: 100,
    width: 120,
    height: 40,
    props: {
      text: 'Sample Button'
    }
  };
  buttonStyle.value = 'default';
}, 1000);
</script>

<style scoped>
.properties-panel {
  height: 100%;
  overflow-y: auto;
}

.no-selection {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: var(--gray-5);
  text-align: center;
  padding: 20px;
}

.properties-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.properties-header {
  padding-bottom: 10px;
  border-bottom: 1px solid var(--gray-2);
}

.properties-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-7);
}

.properties-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--gray-2);
}

.properties-group h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--gray-6);
  margin-bottom: 5px;
}

.property-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.property-row label {
  min-width: 80px;
  font-size: 0.85rem;
  color: var(--gray-6);
}

.property-row input[type="text"],
.property-row input[type="number"],
.property-row select {
  flex: 1;
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid var(--gray-3);
  font-size: 0.85rem;
  background-color: white;
}

.property-row input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.checkbox-row {
  justify-content: space-between;
}

.btn-danger {
  background-color: #e01b24;
  color: white;
  margin-top: 10px;
}

.btn-danger:hover {
  background-color: #c01020;
}

.properties-actions {
  padding-top: 10px;
}
</style> 