export interface DocNavLink {
  title: string;
  path: string;
}

export interface DocNavSection {
  /** Stable key from the folder slug (e.g. "language/basic-types"). */
  key: string;
  title: string;
  links: DocNavLink[];
  /** Nested folder groups when content is organized in subdirectories. */
  children: DocNavSection[];
}

/**
 * Hard-coded top-level section order + labels, mirroring the zig.guide sidebar groups.
 * Folder names under content/<version>/ map to these keys.
 */
const SECTION_META: Record<string, { label: string; order: number }> = {
  "getting-started": { label: "Getting Started", order: 0 },
  language: { label: "Language", order: 1 },
  "language-basics": { label: "Language", order: 1 },
  "standard-library": { label: "Standard Library", order: 2 },
  "build-system": { label: "Build System", order: 3 },
  "working-with-c": { label: "Working with C", order: 4 },
};

/** Known nested folder labels (optional overrides for Title Case conversion). */
const FOLDER_LABELS: Record<string, string> = {
  "basic-types": "Basic Types",
  "control-flow": "Control Flow",
  "standard-library": "Standard Library",
  "build-system": "Build System",
  "working-with-c": "Working with C",
  "getting-started": "Getting Started",
  "language-basics": "Language Basics",
};

function folderLabel(slug: string): string {
  if (SECTION_META[slug]?.label) return SECTION_META[slug].label;
  if (FOLDER_LABELS[slug]) return FOLDER_LABELS[slug];
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

interface MutableSection {
  key: string;
  slug: string;
  title: string;
  links: { title: string; path: string; order: number }[];
  children: Map<string, MutableSection>;
  /** Min page order under this node — used to sort sibling folders. */
  minOrder: number;
}

function ensureChild(parent: MutableSection, slug: string): MutableSection {
  let child = parent.children.get(slug);
  if (!child) {
    child = {
      key: parent.key ? `${parent.key}/${slug}` : slug,
      slug,
      title: folderLabel(slug),
      links: [],
      children: new Map(),
      minOrder: Number.POSITIVE_INFINITY,
    };
    parent.children.set(slug, child);
  }
  return child;
}

function finalize(section: MutableSection): DocNavSection {
  const children = [...section.children.values()]
    .sort((a, b) => {
      if (a.minOrder !== b.minOrder) return a.minOrder - b.minOrder;
      return a.slug.localeCompare(b.slug);
    })
    .map(finalize);

  const links = section.links
    .sort((a, b) => a.order - b.order)
    .map(({ title, path }) => ({ title, path }));

  return {
    key: section.key,
    title: section.title,
    links,
    children,
  };
}

export const useDocsNav = async (versionRef: MaybeRef<string>) => {
  const version = toRef(versionRef);

  const { data: pages } = await useAsyncData(
    () => `docs-nav-${version.value}`,
    () => queryCollection("docs").all(),
  );

  const sections = computed<DocNavSection[]>(() => {
    const root = new Map<string, MutableSection>();

    for (const page of pages.value ?? []) {
      const segments = page.path.split("/").filter(Boolean);
      if (segments[0] !== version.value) continue;

      // segments: [version, topFolder, ...nestedFolders, pageSlug]
      const afterVersion = segments.slice(1);
      if (afterVersion.length === 0) continue;

      const topSlug = afterVersion[0]!;
      const nestedFolders = afterVersion.slice(1, -1); // empty when page is directly under top folder
      const order = (page as { order?: number }).order ?? 0;

      let node = root.get(topSlug);
      if (!node) {
        node = {
          key: topSlug,
          slug: topSlug,
          title: folderLabel(topSlug),
          links: [],
          children: new Map(),
          minOrder: Number.POSITIVE_INFINITY,
        };
        root.set(topSlug, node);
      }

      // Walk nested folders and keep minOrder on every ancestor so siblings sort
      // by the first page that appears under them.
      const chain: MutableSection[] = [node];
      for (const folder of nestedFolders) {
        node = ensureChild(node, folder);
        chain.push(node);
      }

      node.links.push({
        title: page.title,
        path: page.path,
        order,
      });
      for (const ancestor of chain) {
        ancestor.minOrder = Math.min(ancestor.minOrder, order);
      }
    }

    return [...root.values()]
      .sort((a, b) => {
        const ao = SECTION_META[a.slug]?.order ?? 99;
        const bo = SECTION_META[b.slug]?.order ?? 99;
        if (ao !== bo) return ao - bo;
        if (a.minOrder !== b.minOrder) return a.minOrder - b.minOrder;
        return a.slug.localeCompare(b.slug);
      })
      .map(finalize);
  });

  return { sections };
};
