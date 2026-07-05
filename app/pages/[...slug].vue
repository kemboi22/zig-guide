<script setup lang="ts">
definePageMeta({ layout: "docs" });

const { version } = useDocVersion();
const { page, path } = await useDocPage();

const { data: surround } = await useAsyncData(
  () => `docs-surround-${path.value}`,
  () => {
    return queryCollectionItemSurroundings("docs", path.value, {
      fields: ["title"],
    });
  },
  { watch: [path] },
);

const prev = computed(() =>
  surround.value?.[0] ? { title: surround.value[0].title, path: surround.value[0].path } : null,
);
const next = computed(() =>
  surround.value?.[1] ? { title: surround.value[1].title, path: surround.value[1].path } : null,
);

useSeoMeta({
  title: () => page.value?.title,
  description: () => page.value?.description,
});
</script>

<template>
  <div>
    <div class="version-pill">Version: Zig {{ version.label }}</div>

    <ContentRenderer v-if="page" :value="page" class="prose" />

    <p v-if="page?.updatedAt" class="updated-line">
      Last updated on <strong>{{ page.updatedAt }}</strong>
    </p>

    <DocsPager :prev="prev" :next="next" />
  </div>
</template>

<style scoped>
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
</style>
