<template>
  <view class="search">search:{{ searchInput }}</view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  searchInput: String,
})

const searchInput = computed(() => props.searchInput)
</script>

<style lang="scss"></style>
