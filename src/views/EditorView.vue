<template>
  <div class="editor-view">
    <router-view />
  </div>
</template>

<script setup>
  // No script logic needed
</script>

<style scoped>
  .editor-view {
    height: 100%;
    background-color: var(--gray-1);
    display: flex;
    flex-direction: column;
  }
</style>
