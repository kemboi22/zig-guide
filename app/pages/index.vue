<script setup lang="ts">
const appConfig = useAppConfig()
const defaultSlug = appConfig.site.versions?.[0]?.slug ?? '0.13'

await navigateTo(`/${defaultSlug}/getting-started/welcome`, { replace: true })
</script>

<template>
  <div />
</template>
