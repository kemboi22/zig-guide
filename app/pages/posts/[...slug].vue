<script setup lang="ts">
const route = useRoute()
const path = `/posts/${(route.params.slug as string[]).join('/')}`

const { data: post } = await useAsyncData(`post-${path}`, () => {
  return queryCollection('posts').path(path).first()
})

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

useSeoMeta({
  title: () => post.value?.title,
  description: () => post.value?.description
})
</script>

<template>
  <div class="post-shell">
    <article class="post-article">
      <p class="post-meta">
        <span v-if="post?.date">{{ post.date }}</span>
        <span v-if="post?.author"> · {{ post.author }}</span>
      </p>
      <ContentRenderer v-if="post" :value="post" class="prose" />
    </article>
  </div>
</template>

<style scoped>
.post-shell {
  display: flex;
  justify-content: center;
  max-width: 1440px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

.post-article {
  width: 100%;
  max-width: var(--content-max);
}

.post-meta {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--text-faint);
  margin: 0 0 1.5rem;
}
</style>
