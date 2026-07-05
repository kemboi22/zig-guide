<script setup lang="ts">
const appConfig = useAppConfig();
const currentYear = new Date().getFullYear();
const siteName = computed(() => appConfig.site?.name ?? "zig.guide");
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-donate">
        <span class="donate-icon">⚡</span>
        <p class="donate-text">
          If you enjoy Zig and want to help speed up the development, consider
          supporting the project.
        </p>
        <a
          href="https://ziglang.org/zsf/"
          target="_blank"
          rel="noopener"
          class="donate-btn"
        >
          Donate to the Zig Software Foundation
        </a>
      </div>

      <div class="footer-bottom">
        <div class="footer-brand">
          <span class="brand-name">{{ siteName }}</span>
          <span class="brand-copy">
            © {{ currentYear }} · Built with Nuxt, Zig, and a lot of coffee.
          </span>
        </div>

        <div class="footer-links">
          <a href="https://ziglang.org/" target="_blank" rel="noopener">Zig</a>
          <a href="https://ziglang.org/zsf/" target="_blank" rel="noopener">ZSF</a>
          <a href="https://github.com/sobeston/zig.guide" target="_blank" rel="noopener">GitHub</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--border);
  padding: 3rem 1.5rem 2rem;
  background: var(--surface);
  margin-top: auto;
}

.footer-inner {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.footer-donate {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  max-width: 640px;
  margin: 0 auto;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg-elevated);
}

.donate-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.donate-text {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.6;
}

.donate-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--accent);
  color: var(--accent-ink);
  padding: 0.55rem 1.1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.donate-btn:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.brand-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--text);
}

.brand-copy {
  font-size: 0.82rem;
  color: var(--text-faint);
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.footer-links a {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.15s ease;
}

.footer-links a:hover {
  color: var(--accent);
}

@media (max-width: 640px) {
  .footer-bottom {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer-brand {
    align-items: center;
  }
}
</style>
