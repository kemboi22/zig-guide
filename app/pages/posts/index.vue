<script setup lang="ts">
const { data: posts } = await useAsyncData('posts-list', () => {
  return queryCollection('posts').order('date', 'DESC').all()
})

useSeoMeta({
  title: 'Posts',
  description: 'News and articles about Zig and zig.guide.'
})
</script>

<template>
  <div class="posts-shell">
    <div class="posts-content">
      <h1>Posts</h1>
      <p class="posts-intro">News, release notes, and longer-form articles about Zig.</p>

      <ul class="post-list">
        <li v-for="post in posts" :key="post.path">
          <NuxtLink :to="post.path" class="post-card">
            <span class="post-date">{{ post.date }}</span>
            <span class="post-title">{{ post.title }}</span>
            <span class="post-desc">{{ post.description }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.posts-shell {
  display: flex;
  justify-content: center;
  max-width: 1440px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

.posts-content {
  width: 100%;
  max-width: 680px;
}

h1 {
  font-size: 2rem;
  margin: 0 0 0.5rem;
}

.posts-intro {
  color: var(--text-muted);
  margin: 0 0 2.5rem;
}

.post-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.post-card {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--border);
  transition: padding-left 0.15s ease;
}
.post-card:hover {
  padding-left: 0.4rem;
}

.post-date {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--accent);
}

.post-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.15rem;
}

.post-desc {
  color: var(--text-muted);
  font-size: 0.9rem;
}
</style>
