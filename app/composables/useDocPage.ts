export const useDocPage = async () => {
  const route = useRoute()
  const { defaultVersion } = useDocVersion()

  const defaultPath = computed(() => `/${defaultVersion.value.slug}/getting-started/welcome`)

  const path = computed(() => {
    const slug = route.params.slug
    if (!slug || (Array.isArray(slug) && slug.length === 0)) {
      return defaultPath.value
    }
    const joined = Array.isArray(slug) ? slug.join('/') : slug
    return `/${joined}`
  })

  const { data: page } = await useAsyncData(() => `doc-page-${path.value}`, () => {
    return queryCollection('docs').path(path.value).first()
  }, { watch: [path] })

  if (!page.value) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }

  return { page, path }
}
