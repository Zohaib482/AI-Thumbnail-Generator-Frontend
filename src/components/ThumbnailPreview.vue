<script setup lang="ts">
defineProps<{
  thumbnailUrl: string
}>()
</script>

<template>
  <section class="card">
    <h2>2. Original thumbnail</h2>
    <div class="frame">
      <img :src="thumbnailUrl" alt="Original thumbnail" crossorigin="anonymous" />
    </div>
  </section>
</template>

<style scoped>
.card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
}

h2 {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.frame {
  max-width: 640px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: #000;
}

img {
  display: block;
  width: 100%;
  height: auto;
  vertical-align: middle;
}
</style>
