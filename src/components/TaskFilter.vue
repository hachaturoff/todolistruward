<template>
  <div class="mb-4 space-x-2">
    <button
      v-for="f in FILTERS"
      :key="f.value"
      @click="$emit('update:modelValue', f.value)"
      class="p-2"
      :class="{
        'font-bold underline': modelValue === f.value,
        'text-gray-600': modelValue !== f.value
      }"
    >
      {{ f.label }}
    </button>
  </div>
</template>
<script setup>

import { FILTERS } from '../composables/consts'

defineProps({
  modelValue: { type: String, required: true },
  filters:    { type: Array, required: true }
})
defineEmits(['update:modelValue'])
</script>