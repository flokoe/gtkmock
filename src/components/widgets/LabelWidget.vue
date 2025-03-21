<template>
  <span class="gtk-label">{{ props.text || 'Label' }}</span>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: 'Label'
  }
});
</script>

<style scoped>
.gtk-label {
  font-size: 14px;
  color: #2e3436;
  padding: 4px;
  display: inline-block;
}
</style> 