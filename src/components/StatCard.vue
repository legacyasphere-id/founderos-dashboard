<script setup>
defineProps({
  label: String,
  value: [String, Number],
  sub: String,
  color: { type: String, default: 'accent' },
})
</script>

<template>
  <div class="card flex flex-col gap-1">
    <span class="text-xs text-muted uppercase tracking-widest">{{ label }}</span>
    <span class="text-3xl font-semibold">{{ value }}</span>
    <span v-if="sub" class="text-xs text-muted">{{ sub }}</span>
  </div>
</template>
