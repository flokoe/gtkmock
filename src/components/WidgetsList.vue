<template>
  <div class="widgets-list">
    <div class="search-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search widgets..."
        class="search-input"
        @keyup.esc="clearSearch"
      />
      <button v-if="searchQuery" class="clear-search" @click="clearSearch">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <div
      v-if="filteredWidgetsByCategory('basic').length > 0 || !searchQuery"
      class="widgets-category"
    >
      <div class="category-header" @click="toggleCategory('basic')">
        <h3>Basic Widgets</h3>
        <div class="toggle-icon" :class="{ collapsed: !categoryState.basic }">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
      <div class="category-content" :class="{ collapsed: !categoryState.basic }">
        <div
          v-for="widget in filteredWidgetsByCategory('basic')"
          :key="widget.displayName"
          class="widget-item draggable"
          draggable="true"
          @dragstart="onDragStart($event, widget)"
        >
          <div class="widget-icon">{{ widget.icon }}</div>
          <div class="widget-name">{{ widget.displayName }}</div>
        </div>
      </div>
    </div>

    <div
      v-if="filteredWidgetsByCategory('container').length > 0 || !searchQuery"
      class="widgets-category"
    >
      <div class="category-header" @click="toggleCategory('container')">
        <h3>Containers</h3>
        <div class="toggle-icon" :class="{ collapsed: !categoryState.container }">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
      <div class="category-content" :class="{ collapsed: !categoryState.container }">
        <div
          v-for="widget in filteredWidgetsByCategory('container')"
          :key="widget.displayName"
          class="widget-item draggable"
          draggable="true"
          @dragstart="onDragStart($event, widget)"
        >
          <div class="widget-icon">{{ widget.icon }}</div>
          <div class="widget-name">{{ widget.displayName }}</div>
        </div>
      </div>
    </div>

    <div
      v-if="filteredWidgetsByCategory('input').length > 0 || !searchQuery"
      class="widgets-category"
    >
      <div class="category-header" @click="toggleCategory('input')">
        <h3>Input Controls</h3>
        <div class="toggle-icon" :class="{ collapsed: !categoryState.input }">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
      <div class="category-content" :class="{ collapsed: !categoryState.input }">
        <div
          v-for="widget in filteredWidgetsByCategory('input')"
          :key="widget.displayName"
          class="widget-item draggable"
          draggable="true"
          @dragstart="onDragStart($event, widget)"
        >
          <div class="widget-icon">{{ widget.icon }}</div>
          <div class="widget-name">{{ widget.displayName }}</div>
        </div>
      </div>
    </div>

    <div v-if="noResults" class="no-results">
      <p>No widgets match your search</p>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import { getAllWidgets, getWidgetsByCategory } from '@/components/WidgetRegistry';

  const searchQuery = ref('');

  // Track the open/closed state of each category
  const categoryState = ref({
    basic: true,
    container: true,
    input: true,
  });

  // Original category state before search (to restore when search is cleared)
  const originalCategoryState = ref({});

  // Filter widgets based on search query for a specific category
  const filteredWidgetsByCategory = category => {
    const widgets = getWidgetsByCategory(category);
    if (!searchQuery.value) return widgets;

    return widgets.filter(widget =>
      widget.displayName.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  };

  // Check if there are no results for the search
  const noResults = computed(() => {
    if (!searchQuery.value) return false;

    const allFilteredWidgets = getAllWidgets().filter(widget =>
      widget.displayName.toLowerCase().includes(searchQuery.value.toLowerCase())
    );

    return allFilteredWidgets.length === 0;
  });

  // Watch for changes in search query and expand categories with results
  watch(searchQuery, newQuery => {
    // If starting a new search
    if (newQuery && !Object.keys(originalCategoryState.value).length) {
      // Store the original state before search
      originalCategoryState.value = { ...categoryState.value };

      // Initially close all categories when starting a search
      Object.keys(categoryState.value).forEach(category => {
        categoryState.value[category] = false;
      });
    }

    if (newQuery) {
      // Only expand categories with matches
      categoryState.value.basic = filteredWidgetsByCategory('basic').length > 0;
      categoryState.value.container = filteredWidgetsByCategory('container').length > 0;
      categoryState.value.input = filteredWidgetsByCategory('input').length > 0;
    }
  });

  // Clear search
  const clearSearch = () => {
    // Remember which categories had matches before clearing
    const categoriesWithMatches = {
      basic: filteredWidgetsByCategory('basic').length > 0,
      container: filteredWidgetsByCategory('container').length > 0,
      input: filteredWidgetsByCategory('input').length > 0,
    };

    searchQuery.value = '';

    // Restore original category state when search is cleared
    if (Object.keys(originalCategoryState.value).length) {
      // Restore category states, but keep categories with matches expanded
      Object.keys(originalCategoryState.value).forEach(category => {
        // If this category had matches, keep it expanded, otherwise restore original state
        categoryState.value[category] = categoriesWithMatches[category]
          ? true
          : originalCategoryState.value[category];
      });

      // Clear the original state after restoring
      originalCategoryState.value = {};
    }
  };

  // Toggle a category's expanded/collapsed state
  const toggleCategory = category => {
    categoryState.value[category] = !categoryState.value[category];
  };

  const onDragStart = (event, widget) => {
    // For widget dragging, we need to use the type (key in the registry)
    // The key is derived from the displayName converted to lowercase
    const widgetType = widget.displayName.toLowerCase();

    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        type: widgetType,
        defaultProps: widget.properties || {}, // Use widget properties if available
        dimensions: widget.dimensions,
      })
    );
  };
</script>

<style scoped>
  .widgets-list {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--gray-2);
    border-radius: 6px;
    overflow: hidden;
    background-color: white;
  }

  .search-container {
    position: relative;
    padding: 10px;
    border-bottom: 1px solid var(--gray-2);
    background-color: var(--gray-1);
  }

  .search-input {
    width: 100%;
    padding: 6px 28px 6px 8px;
    border-radius: 4px;
    border: 1px solid var(--gray-3);
    font-size: 0.9rem;
    background-color: white;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--blue-3);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  .clear-search {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--gray-5);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
  }

  .clear-search:hover {
    color: var(--gray-7);
  }

  .widgets-category {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid var(--gray-2);
  }

  .widgets-category:last-child {
    border-bottom: none;
  }

  .category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    background-color: var(--gray-1);
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s;
  }

  .category-header:hover {
    background-color: var(--gray-2);
  }

  .widgets-category h3 {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--gray-6);
    margin: 0;
  }

  .toggle-icon {
    color: var(--gray-5);
    transition: transform 0.2s ease;
  }

  .toggle-icon.collapsed {
    transform: rotate(-90deg);
  }

  .category-content {
    display: flex;
    flex-direction: column;
    padding: 8px;
    gap: 6px;
    background-color: white;
    max-height: 500px;
    overflow: hidden;
    transition:
      max-height 0.3s ease-in-out,
      padding 0.2s ease;
  }

  .category-content.collapsed {
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
  }

  .widget-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 10px;
    border-radius: 4px;
    background-color: white;
    transition: all 0.2s;
  }

  .widget-item:hover {
    background-color: var(--blue-0);
  }

  .widget-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    background-color: var(--gray-1);
    font-size: 1rem;
  }

  .widget-name {
    font-size: 0.9rem;
  }

  .no-results {
    padding: 16px;
    text-align: center;
    color: var(--gray-5);
  }
</style>
