<template>
  <li class="flex items-center justify-between m-2 border rounded p-2 transition">
    <label :class="{ completed: task.completed }" class="flex items-center gap-2 flex-1 cursor-pointer">
      <input type="checkbox" :checked="task.completed" @change="$emit('toggle-completed')" />
      <div>
        <div>{{ task.text }}</div>
        <small class="text-gray-500">{{ formattedDate }}</small>
      </div>
    </label>
    <button @click="$emit('delete-task')" class="text-red-600 font-bold ml-4">
      ×
    </button>
  </li>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  task: Object
})

const formattedDate = computed(() => {
  return props.task.date.toLocaleDateString()
})
</script>

<style scoped>
.completed {
  text-decoration: line-through;
  opacity: 0.5;
}
.task {
  transition: all 0.5s ;
}
</style>
