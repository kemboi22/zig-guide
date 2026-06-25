<script setup lang="ts">
const route = useRoute()
const { site } = useAppConfig()

const path = computed(() => {
  const slug = route.params.slug
  if (!slug || (Array.isArray(slug) && slug.length === 0)) {
    return '/0.13/getting-started/welcome'
  }
  const joined = Array.isArray(slug) ? slug.join('/') : slug
  return `/0.13/${joined}`
})

const { data: page } = await useAsyncData(() => `docs-page-${path.value}`, () => {
  return queryCollection('docs').path(path.value).first()
}, { watch: [path] })

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const { data: surround } = await useAsyncData(() => `docs-surround-${path.value}`, () => {
  return queryCollectionItemSurroundings('docs', path.value, {
    fields: ['title']
  })
}, { watch: [path] })

const { sections } = await useDocsNav()

const prev = computed(() => surround.value?.[0] ? { title: surround.value[0].title, path: surround.value[0].path } : null)
const next = computed(() => surround.value?.[1] ? { title: surround.value[1].title, path: surround.value[1].path } : null)

useSeoMeta({
  title: () => page.value?.title,
  description: () => page.value?.description
})
</script>

<template>
  <div class="docs-shell">
    <DocsSidebar :sections="sections" />

    <main class="docs-main">
      <div class="docs-content">
        <div class="version-pill">Version: Zig {{ site.currentVersion }}</div>

        <ContentRenderer v-if="page" :value="page" class="prose" />

        <p v-if="page?.updatedAt" class="updated-line">
          Last updated on <strong>{{ page.updatedAt }}</strong>
        </p>

        <DocsPager :prev="prev" :next="next" />
      </div>
    </main>

    <DocsToc v-if="page?.body?.toc?.links" :links="page.body.toc.links" />
  </div>
</template>

<style scoped>
.docs-shell {
  display: flex;
  max-width: 1440px;
  margin: 0 auto;
}

.docs-main {
  flex: 1;
  min-width: 0;
  padding: 2.5rem 2.5rem 4rem;
  display: flex;
  justify-content: center;
}

.docs-content {
  width: 100%;
  max-width: var(--content-max);
}

.version-pill {
  display: inline-block;
  margin-bottom: 1.25rem;
  padding: 0.25rem 0.65rem;
  border-radius: 5px;
  background: var(--surface);
  border: 1px solid var(--border);
  font-family: var(--font-mono);
  font-size: 0.74rem;
  color: var(--text-faint);
}

.updated-line {
  margin-top: 2rem;
  font-size: 0.82rem;
  color: var(--text-faint);
}
.updated-line strong {
  color: var(--text-muted);
}

@media (max-width: 1024px) {
  .docs-main {
    padding: 2rem 1.5rem 3rem;
  }
}
</style>
