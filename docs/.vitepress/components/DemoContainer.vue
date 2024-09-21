<template>
  <section class="demo">
    <slot />
  </section>
</template>

<style lang="scss">
.demo {
  padding: var(--docsearch-spacing);
  border: 2px solid var(--vp-c-default-1);
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>
