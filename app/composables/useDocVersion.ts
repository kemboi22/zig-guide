export interface DocsVersion {
  slug: string
  label: string
}

export const useDocVersion = () => {
  const appConfig = useAppConfig()
  const route = useRoute()

  const versions = computed<DocsVersion[]>(() => {
    return appConfig.site.versions ?? [{ slug: '0.13', label: '0.13.0' }]
  })

  const defaultVersion = computed<DocsVersion>(() => versions.value[0])

  const version = computed<DocsVersion>(() => {
    const first = route.path.split('/').filter(Boolean)[0] ?? ''
    return versions.value.find(v => v.slug === first) ?? defaultVersion.value
  })

  return { versions, defaultVersion, version }
}
