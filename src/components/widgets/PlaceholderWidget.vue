<template>
  <div class="placeholder-widget">
    {{ props.type || 'Widget' }}
  </div>
</template>

<script setup>
const props = defineProps({
  type: String
});
</script>

<style scoped>
.placeholder-widget {
  padding: 8px;
  background-color: #f8f9fa;
  border: 1px dashed #adb5bd;
  border-radius: 4px;
  font-size: 13px;
  color: #495057;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 24px;
}
</style> 