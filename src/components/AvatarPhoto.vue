<script setup lang="ts">
import { ref } from 'vue'
import { profile } from '../data/profile'

const props = defineProps<{ size?: string }>()
const failed = ref(false)
// the small round avatar loads a 160px copy, framed on the face
const small = !props.size
</script>

<template>
  <span class="relative inline-grid shrink-0 place-items-center overflow-hidden bg-bg-2" :class="size ?? 'size-10 rounded-full'">
    <img v-if="!failed" :src="small ? profile.photoSmall : profile.photo" :alt="profile.name" class="size-full object-cover" :class="small ? 'scale-[1.7] object-[50%_42%]' : 'object-[48%_50%]'" @error="failed = true" />
    <span v-else class="serif text-[clamp(1rem,6vw,5rem)] text-dim">AD</span>
  </span>
</template>
