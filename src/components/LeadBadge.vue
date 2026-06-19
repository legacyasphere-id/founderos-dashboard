<script setup>
defineProps({ status: String })

const map = {
  hot: 'bg-red-500/20 text-red-400',
  warm: 'bg-orange-500/20 text-orange-400',
  cold: 'bg-blue-500/20 text-blue-400',
  disqualified: 'bg-gray-500/20 text-gray-400',
}
</script>

<template>
  <span class="badge" :class="map[status] ?? 'bg-gray-500/20 text-gray-400'">
    {{ status }}
  </span>
</template>
