<script setup lang="ts">
const colorMode = useColorMode()
const mobileNavOpen = useState('mobileNavOpen', () => false)
const route = useRoute()
const { site } = useAppConfig()
const { versions, version: currentVersion } = useDocVersion()

const versionMenuOpen = ref(false)

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

async function switchVersion(v: { slug: string; label: string }) {
  versionMenuOpen.value = false

  const slug = route.params.slug
  const isDocsPath = Array.isArray(slug)
    ? slug.length > 0 && versions.value.some(ver => ver.slug === slug[0])
    : false

  if (!isDocsPath) {
    await navigateTo(`/${v.slug}/getting-started/welcome`)
    return
  }

  const rest = (slug as string[]).slice(1).join('/')
  await navigateTo(rest ? `/${v.slug}/${rest}` : `/${v.slug}/getting-started/welcome`)
}
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <button class="nav-burger" aria-label="Toggle navigation" @click="mobileNavOpen = !mobileNavOpen">
        <span /><span /><span />
      </button>

      <NuxtLink to="/" class="brand">
        <svg viewBox="0 0 32 32" class="brand-mark" aria-hidden="true">
          <path d="M6 9h13l-1.6 3.2H9.8L7 9z" fill="currentColor"/>
          <path d="M19 9l-9.5 14H6l9.5-14z" fill="currentColor"/>
          <path d="M9.5 23l1.7-3.2h9.6L26 23H9.5z" fill="currentColor"/>
        </svg>
        <span class="brand-name">zig<span class="brand-dot">.</span>guide</span>
      </NuxtLink>

      <nav class="primary-nav">
        <NuxtLink to="/" class="primary-link" active-class="is-active">Guide</NuxtLink>
        <NuxtLink to="/examples" class="primary-link" active-class="is-active">Examples</NuxtLink>
        <NuxtLink to="/playground" class="primary-link" active-class="is-active">Playground</NuxtLink>
        <NuxtLink to="/community" class="primary-link" active-class="is-active">Community</NuxtLink>
        <NuxtLink to="/posts" class="primary-link" active-class="is-active">Posts</NuxtLink>
      </nav>

      <div class="header-spacer" />

      <div class="version-select">
        <button class="version-btn" @click="versionMenuOpen = !versionMenuOpen">
          <span class="version-tag">[{{ currentVersion.label }}]</span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </button>
        <ul v-if="versionMenuOpen" class="version-menu">
          <li v-for="v in versions" :key="v.slug">
            <a
              href="#"
              :class="{ active: v.slug === currentVersion.slug }"
              @click.prevent="switchVersion(v)"
            >
              {{ v.label }}
            </a>
          </li>
        </ul>
      </div>

      <button class="icon-btn" :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'" @click="toggleColorMode">
        <svg v-if="colorMode.value === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.6"/><path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 14.5A8.5 8.5 0 119.5 4 7 7 0 0020 14.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
      </button>

      <a :href="site.githubRepo" target="_blank" rel="noopener" class="icon-btn" aria-label="GitHub repository">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.13-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.7 1.25 3.36.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 015.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.7 5.39-5.26 5.67.41.36.78 1.07.78 2.16 0 1.56-.01 2.81-.01 3.19 0 .3.21.66.79.55A11.51 11.51 0 0023.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>
      </a>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 40;
  height: var(--header-h);
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0 1.25rem;
  max-width: 1440px;
  margin: 0 auto;
}

.nav-burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.nav-burger span {
  display: block;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}
.brand-mark {
  width: 26px;
  height: 26px;
  color: var(--accent);
}
.brand-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: -0.01em;
}
.brand-dot {
  color: var(--accent);
}

.primary-nav {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}
.primary-link {
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--text-muted);
  padding: 0.4rem 0;
  border-bottom: 2px solid transparent;
  transition: color 0.15s ease;
}
.primary-link:hover {
  color: var(--text);
}
.primary-link.is-active {
  color: var(--text);
  border-bottom-color: var(--accent);
}

.header-spacer {
  flex: 1;
}

.version-select {
  position: relative;
}
.version-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
}
.version-btn:hover {
  border-color: var(--border-strong);
  color: var(--text);
}
.version-tag {
  color: var(--accent);
}
.version-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  list-style: none;
  margin: 0;
  padding: 0.3rem;
  min-width: 110px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow);
}
.version-menu a {
  display: block;
  padding: 0.4rem 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  border-radius: 5px;
  color: var(--text-muted);
}
.version-menu a:hover {
  background: var(--surface-hover);
  color: var(--text);
}
.version-menu a.active {
  color: var(--accent);
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 7px;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}
.icon-btn:hover {
  color: var(--text);
  background: var(--surface);
  border-color: var(--border);
}

@media (max-width: 900px) {
  .nav-burger { display: flex; }
  .primary-nav { display: none; }
}
@media (max-width: 560px) {
  .brand-name { display: none; }
  .header-inner { gap: 0.75rem; }
}
</style>
