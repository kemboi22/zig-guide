<script setup lang="ts">
interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

const props = defineProps<{ links: TocLink[] }>()
const activeId = ref('')

function flatten(links: TocLink[]): TocLink[] {
  return links.flatMap(l => [l, ...(l.children ? flatten(l.children) : [])])
}

const flatLinks = computed(() => flatten(props.links))

let observer: IntersectionObserver | null = null

function connectObserver() {
  activeId.value = ''
  observer?.disconnect()
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter(e => e.isIntersecting)
      if (visible.length) {
        activeId.value = visible[0].target.id
      }
    },
    { rootMargin: '-100px 0px -70% 0px' }
  )
  nextTick(() => {
    for (const link of flatLinks.value) {
      const el = document.getElementById(link.id)
      if (el) observer?.observe(el)
    }
  })
}

onMounted(connectObserver)
watch(flatLinks, connectObserver)
onUnmounted(() => observer?.disconnect())
</script>

<template>
  <aside v-if="flatLinks.length" class="toc styled-scroll">
    <p class="toc-title">On this page</p>
    <ul class="toc-list">
      <li
        v-for="link in flatLinks"
        :key="link.id"
        :class="`depth-${link.depth}`"
      >
        <a
          :href="`#${link.id}`"
          :class="{ active: activeId === link.id }"
        >{{ link.text }}</a>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.toc {
  position: sticky;
  top: calc(var(--header-h) + 1.75rem);
  width: var(--toc-w);
  flex-shrink: 0;
  align-self: flex-start;
  max-height: calc(100vh - var(--header-h) - 3rem);
  overflow-y: auto;
  padding-left: 1.5rem;
  border-left: 1px solid var(--border);
}

.toc-title {
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin: 0 0 0.75rem;
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc-list li {
  margin: 0.3rem 0;
}

.toc-list a {
  display: block;
  font-size: 0.84rem;
  color: var(--text-muted);
  line-height: 1.4;
  transition: color 0.15s ease;
}
.toc-list a:hover {
  color: var(--text);
}
.toc-list a.active {
  color: var(--accent);
}

.depth-3 {
  padding-left: 0.9rem;
}

@media (max-width: 1200px) {
  .toc {
    display: none;
  }
}
</style>
