<script setup>
defineProps({ level: String })

const map = {
  critical: 'bg-red-500/20 text-red-400',
  high: 'bg-orange-500/20 text-orange-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  low: 'bg-green-500/20 text-green-400',
}
</script>

<template>
  <span class="badge" :class="map[level] ?? 'bg-gray-500/20 text-gray-400'">
    {{ level }}
  </span>
</template>
