export interface DocNavLink {
  title: string
  path: string
}

export interface DocNavSection {
  title: string
  links: DocNavLink[]
}

/**
 * Hard-coded section order + labels, mirroring the zig.guide sidebar groups.
 * Folder names under content/<version>/ map to these keys.
 */
const SECTION_META: Record<string, { label: string; order: number }> = {
  'getting-started': { label: 'Getting Started', order: 0 },
  'language-basics': { label: 'Language', order: 1 },
  'standard-library': { label: 'Standard Library', order: 2 },
  'build-system': { label: 'Build System', order: 3 },
  'working-with-c': { label: 'Working with C', order: 4 }
}

export const useDocsNav = async (versionRef: MaybeRef<string>) => {
  const version = toRef(versionRef)

  const { data: nav } = await useAsyncData('docs-nav', () => {
    return queryCollectionNavigation('docs')
  })

  const sections = computed<DocNavSection[]>(() => {
    const root = nav.value ?? []
    const grouped: Record<string, DocNavLink[]> = {}

    const walk = (items: any[]) => {
      for (const item of items) {
        if (item.children?.length) {
          walk(item.children)
          continue
        }
        const path = item.path as string
        const segments = path.split('/').filter(Boolean)
        if (segments[0] !== version.value) continue

        const folder = segments[1] ?? 'getting-started'
        if (!grouped[folder]) grouped[folder] = []
        grouped[folder].push({ title: item.title, path })
      }
    }

    walk(root as any[])

    return Object.entries(grouped)
      .sort((a, b) => (SECTION_META[a[0]]?.order ?? 99) - (SECTION_META[b[0]]?.order ?? 99))
      .map(([key, links]) => ({
        title: SECTION_META[key]?.label ?? key,
        links
      }))
  })

  return { sections }
}
