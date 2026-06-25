<script setup lang="ts">
const props = defineProps<{
  type?: 'tip' | 'warning' | 'danger' | 'info'
}>()

const icons: Record<string, string> = {
  tip: '✓',
  warning: '!',
  danger: '×',
  info: 'i'
}

const labels: Record<string, string> = {
  tip: 'Tip',
  warning: 'Warning',
  danger: 'Danger',
  info: 'Note'
}

const type = props.type ?? 'info'
</script>

<template>
  <div class="callout" :class="`callout-${type}`">
    <span class="callout-icon">{{ icons[type] }}</span>
    <div class="callout-body">
      <p class="callout-label">{{ labels[type] }}</p>
      <div class="callout-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.callout-body {
  flex: 1;
}
.callout-label {
  margin: 0 0 0.2rem;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.82rem;
}
.callout-content {
  color: var(--text-muted);
}
.callout-content :deep(p) {
  margin: 0;
}
</style>
