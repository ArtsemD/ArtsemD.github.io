<script setup lang="ts">
import PreLoader from './components/PreLoader.vue'
import SiteNav from './components/SiteNav.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <PreLoader />
  <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-card">Skip to content</a>
  <SiteNav />
  <main id="main">
    <RouterView v-slot="{ Component, route }">
      <component :is="Component" :key="route.path" />
    </RouterView>
  </main>
  <SiteFooter />
</template>
