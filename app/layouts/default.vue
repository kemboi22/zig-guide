<script setup lang="ts"></script>

<template>
  <div class="app-shell">
    <SiteHeader />
    <slot />
    <SiteFooter />
  </div>
</template>

<style>
.app-shell {
  min-height: 100vh;
}
</style>
