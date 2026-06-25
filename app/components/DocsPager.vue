<script setup lang="ts">
defineProps<{
  prev?: { title: string; path: string } | null
  next?: { title: string; path: string } | null
}>()
</script>

<template>
  <nav class="pager">
    <NuxtLink v-if="prev" :to="prev.path" class="pager-link prev">
      <span class="pager-label">← Previous</span>
      <span class="pager-title">{{ prev.title }}</span>
    </NuxtLink>
    <div v-else />
    <NuxtLink v-if="next" :to="next.path" class="pager-link next">
      <span class="pager-label">Next →</span>
      <span class="pager-title">{{ next.title }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.pager {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 1.75rem;
  border-top: 1px solid var(--border);
}

.pager-link {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.9rem 1.1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}
.pager-link:hover {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.next {
  text-align: right;
  grid-column: 2;
}

.pager-label {
  font-family: var(--font-mono);
  font-size: 0.74rem;
  color: var(--text-faint);
}

.pager-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text);
}

@media (max-width: 600px) {
  .pager {
    grid-template-columns: 1fr;
  }
  .next {
    grid-column: 1;
    text-align: left;
  }
}
</style>
