<script setup lang="ts">
import type { DocNavSection } from '~/composables/useDocsNav'

const props = defineProps<{ sections: DocNavSection[] }>()
const route = useRoute()
const mobileNavOpen = useState('mobileNavOpen', () => false)

const openSections = ref<Record<string, boolean>>({})

watchEffect(() => {
  for (const section of props.sections) {
    if (openSections.value[section.title] === undefined) {
      openSections.value[section.title] = section.links.some(l => l.path === route.path)
        || section.title === props.sections[0]?.title
    }
  }
})

function toggle(title: string) {
  openSections.value[title] = !openSections.value[title]
}

function isActive(path: string) {
  return route.path === path
}
</script>

<template>
  <aside class="sidebar styled-scroll" :class="{ open: mobileNavOpen }">
    <nav class="sidebar-nav">
      <div v-for="section in sections" :key="section.title" class="nav-group">
        <button class="group-label" @click="toggle(section.title)">
          <span>{{ section.title }}</span>
          <svg
            width="10" height="10" viewBox="0 0 10 10" fill="none"
            class="chevron" :class="{ collapsed: !openSections[section.title] }"
          >
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <ul v-show="openSections[section.title]" class="group-links">
          <li v-for="link in section.links" :key="link.path">
            <NuxtLink
              :to="link.path"
              class="nav-link"
              :class="{ active: isActive(link.path) }"
              @click="mobileNavOpen = false"
            >
              {{ link.title }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
  <Teleport to="body">
    <div v-if="mobileNavOpen" class="sidebar-backdrop" @click="mobileNavOpen = false" />
  </Teleport>
</template>

<style scoped>
.sidebar {
  position: sticky;
  top: var(--header-h);
  height: calc(100vh - var(--header-h));
  width: var(--sidebar-w);
  flex-shrink: 0;
  overflow-y: auto;
  padding: 1.75rem 1rem 2rem 1.5rem;
  border-right: 1px solid var(--border);
}

.nav-group {
  margin-bottom: 0.25rem;
}

.group-label {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 0.5rem 0.5rem 0;
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.chevron {
  color: var(--text-faint);
  transition: transform 0.15s ease;
}
.chevron.collapsed {
  transform: rotate(-90deg);
}

.group-links {
  list-style: none;
  margin: 0.1rem 0 0.75rem;
  padding: 0;
  border-left: 1px solid var(--border);
  margin-left: 0.05rem;
}

.nav-link {
  position: relative;
  display: block;
  padding: 0.42rem 0.9rem;
  margin-left: -1px;
  border-left: 2px solid transparent;
  font-size: 0.88rem;
  color: var(--text-muted);
  transition: color 0.15s ease, border-color 0.15s ease;
}
.nav-link:hover {
  color: var(--text);
}
.nav-link.active {
  color: var(--accent);
  border-left-color: var(--accent);
  font-weight: 500;
}

.sidebar-backdrop {
  position: fixed;
  inset: var(--header-h) 0 0 0;
  z-index: 30;
  background: rgb(0 0 0 / 0.5);
}

@media (max-width: 900px) {
  .sidebar {
    position: fixed;
    top: var(--header-h);
    left: 0;
    z-index: 35;
    background: var(--bg);
    transform: translateX(-100%);
    transition: transform 0.2s ease;
    box-shadow: var(--shadow);
  }
  .sidebar.open {
    transform: translateX(0);
  }
}

@media (min-width: 901px) {
  .sidebar-backdrop {
    display: none;
  }
}
</style>
