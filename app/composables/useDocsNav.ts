export interface DocNavLink {
  title: string;
  path: string;
}

export interface DocNavSection {
  title: string;
  links: DocNavLink[];
}

/**
 * Hard-coded section order + labels, mirroring the zig.guide sidebar groups.
 * Folder names under content/<version>/ map to these keys.
 */
const SECTION_META: Record<string, { label: string; order: number }> = {
  "getting-started": { label: "Getting Started", order: 0 },
  "language-basics": { label: "Language", order: 1 },
  "standard-library": { label: "Standard Library", order: 2 },
  "build-system": { label: "Build System", order: 3 },
  "working-with-c": { label: "Working with C", order: 4 },
};

export const useDocsNav = async (versionRef: MaybeRef<string>) => {
  const version = toRef(versionRef);

  const { data: pages } = await useAsyncData(
    () => `docs-nav-${version.value}`,
    () => queryCollection("docs").all(),
  );

  const sections = computed<DocNavSection[]>(() => {
    const grouped: Record<
      string,
      { title: string; path: string; order: number }[]
    > = {};

    for (const page of pages.value ?? []) {
      const segments = page.path.split("/").filter(Boolean);
      if (segments[0] !== version.value) continue;

      const folder = segments[1] ?? "getting-started";
      if (!grouped[folder]) grouped[folder] = [];

      grouped[folder].push({
        title: page.title,
        path: page.path,
        order: (page as any).order ?? 0,
      });
    }

    return Object.entries(grouped)
      .sort(
        (a, b) =>
          (SECTION_META[a[0]]?.order ?? 99) -
          (SECTION_META[b[0]]?.order ?? 99),
      )
      .map(([key, items]) => ({
        title: SECTION_META[key]?.label ?? key,
        links: items
          .sort((a, b) => a.order - b.order)
          .map(({ title, path }) => ({ title, path })),
      }));
  });

  return { sections };
};
