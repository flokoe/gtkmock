<template>
  <input 
    type="text" 
    class="gtk-entry" 
    :value="props.text"
    :placeholder="props.placeholder"
    :type="props.password ? 'password' : 'text'"
  />
</template>

<script>
// Widget metadata for the registry
export const widgetMeta = {
  id: 'entry',
  name: 'Entry',
  icon: '⌨️',
  category: 'input',
  defaultProps: { text: '', placeholder: 'Enter text...' },
  dimensions: { width: 150, height: 30 }
};
</script>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Enter text...'
  },
  password: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.gtk-entry {
  padding: 6px 8px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  width: 100%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.03) inset;
}

.gtk-entry:focus {
  border-color: #3584e4;
  outline: none;
}

.gtk-entry::placeholder {
  color: #aaa;
}
</style> 