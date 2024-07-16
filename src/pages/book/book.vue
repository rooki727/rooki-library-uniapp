<template>
  <div class="book">book {{ query.book_id }}</div>
</template>

<script setup>
const query = defineProps({
  book_id: Number,
})
</script>

<style lang="scss"></style>
