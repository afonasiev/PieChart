<template>
  <div :class="$style.container">
    <slot />
  </div>
</template>

<style module lang="scss">
.container {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  h2 {
    width: 100%;
  }
  h1 {
    width: 100%;
    border-bottom: 1px solid #dbdfe9;
    font-size: 32px;
    line-height: 100%;
    padding-bottom: 30px;
    padding-left: 10px;
    padding-right: 10px;
    font-weight: 600;
  }
}
</style>
