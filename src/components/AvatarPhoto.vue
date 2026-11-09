<script setup lang="ts">
import { ref } from 'vue'
import { profile } from '../data/profile'

defineProps<{ size?: string }>()
const failed = ref(false)
</script>

<template>
  <span class="relative inline-grid shrink-0 place-items-center overflow-hidden bg-bg-2" :class="size ?? 'size-10 rounded-full'">
    <img v-if="!failed" :src="profile.photo" :alt="profile.name" class="size-full object-cover" @error="failed = true" />
    <span v-else class="serif text-[clamp(1rem,6vw,5rem)] text-dim">AD</span>
  </span>
</template>
