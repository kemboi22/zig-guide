<script setup lang="ts">
import type { DocNavSection } from '~/composables/useDocsNav'

const props = defineProps<{ sections: DocNavSection[] }>()
const route = useRoute()
const mobileNavOpen = useState('mobileNavOpen', () => false)

const openSections = ref<Record<string, boolean>>({})

function sectionContainsPath(section: DocNavSection, path: string): boolean {
  if (section.links.some(l => l.path === path)) return true
  return section.children.some(child => sectionContainsPath(child, path))
}

function ensureOpenState(section: DocNavSection, isTopLevel: boolean) {
  if (openSections.value[section.key] === undefined) {
    const onPath = sectionContainsPath(section, route.path)
    // Top-level: open first section or the one matching the current route.
    // Nested: open when the current page lives under this folder.
    openSections.value[section.key] = onPath
      || (isTopLevel && section.key === props.sections[0]?.key)
  }
  for (const child of section.children) {
    ensureOpenState(child, false)
  }
}

watchEffect(() => {
  for (const section of props.sections) {
    ensureOpenState(section, true)
  }
})

// Keep the active branch expanded when the route changes.
watch(
  () => route.path,
  (path) => {
    function openBranch(section: DocNavSection) {
      if (sectionContainsPath(section, path)) {
        openSections.value[section.key] = true
      }
      for (const child of section.children) openBranch(child)
    }
    for (const section of props.sections) openBranch(section)
  },
)

function toggle(key: string) {
  openSections.value[key] = !openSections.value[key]
}

function isActive(path: string) {
  return route.path === path
}
</script>

<template>
  <aside class="sidebar styled-scroll" :class="{ open: mobileNavOpen }">
    <nav class="sidebar-nav">
      <div v-for="section in sections" :key="section.key" class="nav-group">
        <button class="group-label" type="button" @click="toggle(section.key)">
          <span>{{ section.title }}</span>
          <svg
            width="10" height="10" viewBox="0 0 10 10" fill="none"
            class="chevron" :class="{ collapsed: !openSections[section.key] }"
          >
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <div v-show="openSections[section.key]" class="group-body">
          <!-- Pages directly under this top-level folder -->
          <ul v-if="section.links.length" class="group-links">
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

          <!-- Nested folders (e.g. Language → Basic Types, Control Flow) -->
          <div
            v-for="child in section.children"
            :key="child.key"
            class="nav-subgroup"
          >
            <button class="subgroup-label" type="button" @click="toggle(child.key)">
              <span>{{ child.title }}</span>
              <svg
                width="10" height="10" viewBox="0 0 10 10" fill="none"
                class="chevron" :class="{ collapsed: !openSections[child.key] }"
              >
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <ul v-show="openSections[child.key]" class="group-links subgroup-links">
              <li v-for="link in child.links" :key="link.path">
                <NuxtLink
                  :to="link.path"
                  class="nav-link"
                  :class="{ active: isActive(link.path) }"
                  @click="mobileNavOpen = false"
                >
                  {{ link.title }}
                </NuxtLink>
              </li>

              <!-- Deeper nesting if content adds more folder levels later -->
              <li
                v-for="grand in child.children"
                :key="grand.key"
                class="nav-nested"
              >
                <button class="subgroup-label nested" type="button" @click="toggle(grand.key)">
                  <span>{{ grand.title }}</span>
                  <svg
                    width="10" height="10" viewBox="0 0 10 10" fill="none"
                    class="chevron" :class="{ collapsed: !openSections[grand.key] }"
                  >
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <ul v-show="openSections[grand.key]" class="group-links subgroup-links">
                  <li v-for="link in grand.links" :key="link.path">
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
              </li>
            </ul>
          </div>
        </div>
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

.subgroup-label {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.45rem 0.5rem 0.35rem 0;
  font-family: var(--font-body);
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text-muted);
}

.subgroup-label.nested {
  padding-left: 0.5rem;
  color: var(--text-muted);
}

.chevron {
  color: var(--text-faint);
  transition: transform 0.15s ease;
  flex-shrink: 0;
}
.chevron.collapsed {
  transform: rotate(-90deg);
}

.group-body {
  margin-bottom: 0.5rem;
}

.group-links {
  list-style: none;
  margin: 0.1rem 0 0.35rem;
  padding: 0;
  border-left: 1px solid var(--border);
  margin-left: 0.05rem;
}

.subgroup-links {
  margin-left: 0.85rem;
  margin-bottom: 0.55rem;
}

.nav-subgroup {
  margin-top: 0.15rem;
}

.nav-nested {
  list-style: none;
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
