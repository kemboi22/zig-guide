<script setup lang="ts">
const props = defineProps<{
  error: { statusCode: number; statusMessage?: string }
}>()

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="error-shell">
    <SiteHeader />
    <main class="error-main">
      <p class="error-code">{{ error.statusCode }}</p>
      <h1>{{ error.statusCode === 404 ? 'Page not found' : 'Something went wrong' }}</h1>
      <p class="error-desc">
        {{ error.statusCode === 404
          ? "The page you're looking for doesn't exist or may have moved."
          : (error.statusMessage || 'An unexpected error occurred.') }}
      </p>
      <button class="error-home-btn" @click="handleError">Back to the guide</button>
    </main>
  </div>
</template>

<style scoped>
.error-shell {
  min-height: 100vh;
}

.error-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6rem 1.5rem;
  min-height: calc(100vh - var(--header-h));
}

.error-code {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  color: var(--accent);
  margin: 0 0 0.75rem;
}

h1 {
  font-size: 2rem;
  margin: 0 0 0.75rem;
}

.error-desc {
  color: var(--text-muted);
  max-width: 420px;
  margin: 0 0 2rem;
}

.error-home-btn {
  background: var(--accent);
  color: var(--accent-ink);
  border: none;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.92rem;
  padding: 0.65rem 1.4rem;
  border-radius: 7px;
  cursor: pointer;
  transition: opacity 0.15s ease;
}
.error-home-btn:hover {
  opacity: 0.88;
}
</style>
