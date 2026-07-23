
<script setup lang="ts">
definePageMeta({ layout: false });

const appConfig = useAppConfig();
const siteName = computed(() => appConfig.site?.name ?? "zig.guide");

const defaultCode = `const std = @import("std");

pub fn main() void {
    std.debug.print("Hello from the ${siteName.value} playground!\\n", .{});
}`;

const code = ref(defaultCode);
const output = ref("");
const running = ref(false);
const status = ref("Ready");
const editorRef = ref<{ focus: () => void } | null>(null);

const isEmpty = computed(() => !code.value.trim());

async function run() {
  if (running.value || isEmpty.value) return;
  running.value = true;
  status.value = "Running...";
  output.value = "";
  try {
    const result = await $fetch("/api/run-zig", {
      method: "POST",
      body: { code: code.value },
    });
    output.value = [result.stdout, result.stderr]
      .filter(Boolean)
      .join("\n")
      .trim();
    status.value = result.exitCode === 0 ? "Finished" : "Error";
  } catch (e: any) {
    output.value = e?.data?.message || e.message || "Failed to run code";
    status.value = "Error";
  } finally {
    running.value = false;
  }
}

function reset() {
  code.value = defaultCode;
  output.value = "";
  status.value = "Ready";
  editorRef.value?.focus();
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(code.value);
  } catch (e) {
    console.error("Copy failed:", e);
  }
}

function clearOutput() {
  output.value = "";
  status.value = "Ready";
}

function onKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    run();
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <div class="playground-page">
    <SiteHeader />

    <main class="playground-main">
      <div class="playground-header">
        <div class="header-title">
          <h1>{{ siteName }} Playground</h1>
          <p>Write Zig code, run it, and share it.</p>
        </div>
        <div class="header-actions">
          <button class="action-btn" title="Copy code" @click="copyCode">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span>Copy</span>
          </button>
          <button class="action-btn" title="Reset code" @click="reset">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            <span>Reset</span>
          </button>
          <button class="run-btn" :disabled="running || isEmpty" @click="run">
            <svg v-if="!running" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
            <svg v-else class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            <span>{{ running ? "Running" : "Run" }}</span>
            <span class="shortcut">Ctrl+Enter</span>
          </button>
        </div>
      </div>

      <div class="playground-workspace">
        <div class="editor-pane">
          <div class="pane-header">
            <span class="pane-title">main.zig</span>
            <span class="pane-header-end">
              <span class="pane-vim-mode">NORMAL</span>
              <span class="pane-status">{{ status }}</span>
            </span>
          </div>
          <div class="editor-body">
            <ClientOnly>
              <CodeEditor
                ref="editorRef"
                v-model="code"
                :disabled="running"
                placeholder="Type your Zig code here..."
              />
              <template #fallback>
                <div class="editor-fallback">Loading editor...</div>
              </template>
            </ClientOnly>
            <div class="editor-statusbar">
              <span>Ln 1, Col 0</span>
              <span>Zig</span>
              <span>UTF-8</span>
              <span>Vim</span>
            </div>
          </div>
        </div>

        <div class="output-pane">
          <div class="pane-header output-header">
            <span class="pane-title">Terminal</span>
            <button class="clear-btn" @click="clearOutput">Clear</button>
          </div>
          <div class="output-body">
            <pre v-if="output">{{ output }}</pre>
            <div v-else class="output-empty">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17l6-6-6-6"/><path d="M12 19h8"/></svg>
              <p>Press <kbd>Ctrl</kbd>+<kbd>Enter</kbd> to run your code.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.playground-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}

.playground-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2rem 2rem;
  gap: 1.25rem;
}

.playground-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.header-title h1 {
  font-family: var(--font-display);
  font-size: 1.75rem;
  margin: 0 0 0.25rem;
}

.header-title p {
  color: var(--text-muted);
  margin: 0;
  font-size: 0.95rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-btn:hover {
  background: var(--surface-hover);
  color: var(--text);
  border-color: var(--border-strong);
}

.run-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1rem;
  border-radius: 8px;
  border: none;
  background: var(--accent);
  color: var(--accent-ink);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.15s ease;
  box-shadow: 0 4px 14px rgba(247, 164, 29, 0.25);
}

.run-btn:hover:not(:disabled) {
  opacity: 0.92;
  transform: translateY(-1px);
}

.run-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.run-btn .shortcut {
  margin-left: 0.35rem;
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.15);
  font-size: 0.7rem;
  font-weight: 500;
  opacity: 0.85;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.playground-workspace {
  flex: 1;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 1.25rem;
  min-height: 0;
}

.editor-pane,
.output-pane {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--code-bg);
  min-height: 0;
}

.pane-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.55rem 0.85rem;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}

.pane-title {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-faint);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pane-title::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
}

.pane-header-end {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.pane-vim-mode {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  background: var(--accent);
  color: var(--accent-ink);
  letter-spacing: 0.05em;
}

.pane-status {
  font-size: 0.75rem;
  color: var(--text-faint);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.output-header .pane-title::before {
  background: #4fd190;
}

.clear-btn {
  background: transparent;
  border: none;
  color: var(--text-faint);
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  transition: color 0.15s ease;
}

.clear-btn:hover {
  color: var(--text);
}

.editor-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.editor-statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.3rem 0.85rem;
  border-top: 1px solid var(--border);
  background: var(--code-bg);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-faint);
  user-select: none;
}

.editor-statusbar span {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.output-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: auto;
}

.output-body pre {
  flex: 1;
  margin: 0;
  padding: 1rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--text);
  white-space: pre-wrap;
  word-break: break-word;
  overflow: auto;
}

.output-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: var(--text-faint);
  text-align: center;
  padding: 2rem;
}

.output-empty svg {
  opacity: 0.5;
}

.output-empty p {
  margin: 0;
  font-size: 0.9rem;
}

.output-empty kbd {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-muted);
}

.editor-fallback {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-faint);
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .playground-main {
    padding: 1rem;
  }

  .playground-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .playground-workspace {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
}
</style>
