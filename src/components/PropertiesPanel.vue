<template>
  <div class="properties-panel">
    <div v-if="!props.hasSelection && !props.isScreenSelected" class="no-selection">
      <p>Select a widget or screen to edit its properties</p>
    </div>
    
    <div v-else class="properties-content">
      <!-- Screen Properties -->
      <div v-if="props.isScreenSelected" class="properties-form">
        <div class="properties-header">
          <h3>Screen Properties</h3>
        </div>
        
        <div class="properties-group">
          <h4>General</h4>
          <div class="property-row">
            <label>Name</label>
            <input type="text" v-model="props.selectedScreen.name" @change="updateScreen" />
          </div>
        </div>
        
        <div class="properties-group">
          <h4>Dimensions</h4>
          <div class="property-row">
            <label>Width</label>
            <input type="number" v-model.number="props.selectedScreen.width" @change="updateScreen" />
          </div>
          <div class="property-row">
            <label>Height</label>
            <input type="number" v-model.number="props.selectedScreen.height" @change="updateScreen" />
          </div>
        </div>
      </div>
      
      <!-- Visual separator if both screen and widget are selected -->
      <div v-if="props.isScreenSelected && props.hasSelection" class="properties-separator"></div>
      
      <!-- Widget Properties -->
      <div v-if="props.hasSelection" class="properties-form">
        <div class="properties-header">
          <h3>{{ widgetTypeName }} Properties</h3>
        </div>
        
        <div class="properties-group">
          <h4>Position & Size</h4>
          <div class="property-row">
            <label>X</label>
            <input type="number" v-model.number="props.selectedWidget.x" @change="updateWidget" />
          </div>
          <div class="property-row">
            <label>Y</label>
            <input type="number" v-model.number="props.selectedWidget.y" @change="updateWidget" />
          </div>
          <div class="property-row">
            <label>Width</label>
            <input type="number" v-model.number="props.selectedWidget.width" @change="updateWidget" />
          </div>
          <div class="property-row">
            <label>Height</label>
            <input type="number" v-model.number="props.selectedWidget.height" @change="updateWidget" />
          </div>
        </div>
        
        <!-- Text Properties -->
        <div v-if="props.selectedWidget && ['label', 'button', 'entry'].includes(props.selectedWidget.type)" class="properties-group">
          <h4>Text</h4>
          <div class="property-row">
            <label>Content</label>
            <input type="text" v-model="props.selectedWidget.props.text" @change="updateWidget" />
          </div>
        </div>
        
        <!-- Button Properties -->
        <div v-if="props.selectedWidget && props.selectedWidget.type === 'button'" class="properties-group">
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
        <div v-if="props.selectedWidget && props.selectedWidget.type === 'entry'" class="properties-group">
          <h4>Input Settings</h4>
          <div class="property-row">
            <label>Placeholder</label>
            <input type="text" v-model="props.selectedWidget.props.placeholder" @change="updateWidget" />
          </div>
          <div class="property-row checkbox-row">
            <label>Password</label>
            <input type="checkbox" v-model="props.selectedWidget.props.password" @change="updateWidget" />
          </div>
        </div>
        
        <!-- Checkbox Properties -->
        <div v-if="props.selectedWidget && (props.selectedWidget.type === 'checkbox' || props.selectedWidget.type === 'switch')" class="properties-group">
          <h4>State</h4>
          <div class="property-row checkbox-row">
            <label>Checked</label>
            <input type="checkbox" v-model="props.selectedWidget.props.checked" @change="updateWidget" />
          </div>
        </div>
        
        <!-- Dropdown Properties -->
        <div v-if="props.selectedWidget && props.selectedWidget.type === 'dropdown'" class="properties-group">
          <h4>Items</h4>
          <div v-for="(item, index) in props.selectedWidget.props.items" :key="index" class="property-row">
            <input type="text" v-model="props.selectedWidget.props.items[index]" @change="updateWidget" />
            <button class="btn-icon" @click="removeDropdownItem(index)">🗑️</button>
          </div>
          <button class="btn btn-sm" @click="addDropdownItem">Add Item</button>
        </div>
        
        <!-- Box Properties -->
        <div v-if="props.selectedWidget && props.selectedWidget.type === 'box'" class="properties-group">
          <h4>Container</h4>
          <div class="property-row">
            <label>Orientation</label>
            <select v-model="props.selectedWidget.props.orientation" @change="updateWidget">
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </div>
          <div class="property-row">
            <label>Spacing</label>
            <input type="number" v-model.number="props.selectedWidget.props.spacing" @change="updateWidget" />
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
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  hasSelection: {
    type: Boolean,
    default: false
  },
  selectedWidget: {
    type: Object,
    default: null
  },
  isScreenSelected: {
    type: Boolean,
    default: false
  },
  selectedScreen: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update-widget', 'update-screen', 'delete-widget']);

// Computed properties
const widgetTypeName = computed(() => {
  if (!props.selectedWidget) return '';
  
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
  
  return typeMap[props.selectedWidget.type] || props.selectedWidget.type;
});

// Button style property (would be linked to actual CSS classes)
const buttonStyle = ref('default');

// Methods
const updateWidget = () => {
  emit('update-widget', props.selectedWidget);
};

const updateScreen = () => {
  emit('update-screen', props.selectedScreen);
};

const updateButtonStyle = () => {
  // Update button style class
  console.log('Button style updated to:', buttonStyle.value);
  updateWidget();
};

const deleteWidget = () => {
  emit('delete-widget');
};

const addDropdownItem = () => {
  if (props.selectedWidget?.props?.items) {
    props.selectedWidget.props.items.push(`Item ${props.selectedWidget.props.items.length + 1}`);
    updateWidget();
  }
};

const removeDropdownItem = (index) => {
  if (props.selectedWidget?.props?.items && props.selectedWidget.props.items.length > 1) {
    props.selectedWidget.props.items.splice(index, 1);
    updateWidget();
  }
};

// Set button style based on selected widget
if (props.selectedWidget?.type === 'button' && props.selectedWidget.props.buttonStyle) {
  buttonStyle.value = props.selectedWidget.props.buttonStyle;
} else {
  buttonStyle.value = 'default';
}
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
  padding: 20px;
}

.properties-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 15px;
}

.properties-header {
  padding-bottom: 10px;
}

.properties-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-7);
}

.properties-separator {
  height: 1px;
  background-color: var(--gray-3);
  margin: 10px 0;
}

.properties-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 15px;
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
  border: none;
  font-size: 0.85rem;
  background-color: var(--gray-1);
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