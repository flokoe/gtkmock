/// <reference types="vite/client" />

// This file contains environment declarations and important type information

declare module '*.vue' {
  import type { ComponentOptions } from 'vue';
  const component: ComponentOptions;
  export default component;
}
