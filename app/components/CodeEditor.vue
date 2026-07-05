<script setup lang="ts">
import { EditorView, placeholder } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { type PropType, ref, onMounted, onUnmounted, watch } from "vue";
import { zigLanguage, zigAutocomplete } from "~/utils/codemirror-zig";

const props = defineProps({
  modelValue: {
    type: String as PropType<string>,
    default: "",
  },
  placeholder: {
    type: String as PropType<string>,
    default: "",
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const editorContainer = ref<HTMLDivElement>();
let editor: EditorView | null = null;
const editableCompartment = new Compartment();

const chromeTheme = EditorView.theme({
  "&.cm-editor": {
    fontSize: "0.875rem",
    fontFamily: "var(--font-mono)",
  },
  ".cm-scroller": {
    fontFamily: "var(--font-mono)",
    lineHeight: "1.6",
  },
  ".cm-content": {
    padding: "1rem 0",
  },
  ".cm-gutters": {
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
  },
});

function createEditor() {
  if (!editorContainer.value) return;

  editor = new EditorView({
    parent: editorContainer.value,
    state: EditorState.create({
      doc: props.modelValue,
      extensions: [
        basicSetup,
        oneDark,
        chromeTheme,
        zigLanguage,
        zigAutocomplete,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            emit("update:modelValue", update.state.doc.toString());
          }
        }),
        editableCompartment.of(EditorView.editable.of(!props.disabled)),
        placeholder(props.placeholder),
      ],
    }),
  });
}

onMounted(() => {
  createEditor();
});

onUnmounted(() => {
  editor?.destroy();
  editor = null;
});

watch(
  () => props.modelValue,
  (value) => {
    if (editor && value !== editor.state.doc.toString()) {
      editor.dispatch({
        changes: {
          from: 0,
          to: editor.state.doc.length,
          insert: value,
        },
      });
    }
  },
);

watch(
  () => props.disabled,
  (disabled) => {
    editor?.dispatch({
      effects: editableCompartment.reconfigure(
        EditorView.editable.of(!disabled),
      ),
    });
  },
);

function focus() {
  editor?.focus();
}

defineExpose({ focus });
</script>

<template>
  <div ref="editorContainer" class="code-editor" />
</template>

<style scoped>
.code-editor {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.code-editor :deep(.cm-editor) {
  flex: 1;
  border-radius: 0 0 12px 12px;
}

.code-editor :deep(.cm-scroller) {
  overflow: auto;
}

.code-editor :deep(.cm-matchingBracket) {
  background-color: rgba(247, 164, 29, 0.25);
  color: #f7a41d !important;
}

.code-editor :deep(.cm-nonmatchingBracket) {
  color: #f76060 !important;
}
</style>
