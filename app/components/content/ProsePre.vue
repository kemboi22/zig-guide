<script setup lang="ts">
interface Props {
  class?: string;
  code?: string;
  language?: string;
  filename?: string;
}

const props = defineProps<Props>();
const preRef = ref<HTMLPreElement>();
const copied = ref(false);
const running = ref(false);
const output = ref("");
const showOutput = ref(false);

const lang = computed(() => {
  return props.language || props.class?.match(/language-(\w+)/)?.[1] || "";
});

const code = computed(() => {
  return props.code || preRef.value?.textContent?.trim() || "";
});

const isRunnable = computed(() => lang.value === "zig");

async function copy() {
  if (!code.value) return;
  try {
    await navigator.clipboard.writeText(code.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch (e) {
    console.error("Copy failed:", e);
  }
}

async function run() {
  if (!code.value) return;
  running.value = true;
  showOutput.value = true;
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
  } catch (e: any) {
    output.value = e?.data?.message || e.message || "Failed to run code";
  } finally {
    running.value = false;
  }
}
</script>

<template>
  <div class="code-block">
    <div class="code-toolbar">
      <span class="code-lang">{{ lang }}</span>
      <div class="code-actions">
        <button class="code-btn" @click="copy">
          {{ copied ? "Copied!" : "Copy" }}
        </button>
        <button
          v-if="isRunnable"
          class="code-btn run"
          :disabled="running"
          @click="run"
        >
          {{ running ? "Running..." : "Run" }}
        </button>
      </div>
    </div>
    <pre ref="preRef" :class="props.class"><slot /></pre>
    <div v-if="showOutput" class="code-output">
      <div class="code-output-label">Output</div>
      <div class="code-output-content">{{ output || (running ? "Running..." : "No output") }}</div>
    </div>
  </div>
</template>

<style scoped>
.code-block {
  margin: 1.25rem 0;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--code-bg);
}

.code-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}

.code-lang {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-faint);
  text-transform: uppercase;
}

.code-actions {
  display: flex;
  gap: 0.5rem;
}

.code-btn {
  background: var(--surface-hover);
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 0.25rem 0.6rem;
  border-radius: 5px;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.code-btn:hover {
  color: var(--text);
  border-color: var(--border-strong);
}

.code-btn.run {
  background: var(--accent-soft);
  border-color: var(--accent-soft);
  color: var(--accent);
}

.code-btn.run:hover {
  background: var(--accent);
  color: var(--accent-ink);
}

.code-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.code-block pre {
  margin: 0;
  border: none;
  border-radius: 0;
}

.code-output {
  border-top: 1px solid var(--border);
  padding: 0.75rem;
  background: var(--bg-elevated);
}

.code-output-label {
  font-size: 0.75rem;
  color: var(--text-faint);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.code-output-content {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-muted);
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
