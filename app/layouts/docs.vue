<script setup lang="ts">
const { version } = useDocVersion()
const { sections } = await useDocsNav(computed(() => version.value.slug))
const { page } = await useDocPage()
</script>

<template>
  <div class="app-shell">
    <SiteHeader />
    <div class="docs-shell">
      <DocsSidebar :sections="sections" />

      <main class="docs-main">
        <div class="docs-content">
          <slot />
        </div>
      </main>

      <DocsToc v-if="page?.body?.toc?.links" :links="page.body.toc.links" />
    </div>
  </div>
</template>

<style>
.app-shell {
  min-height: 100vh;
}

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

@media (max-width: 1024px) {
  .docs-main {
    padding: 2rem 1.5rem 3rem;
  }
}
</style>
