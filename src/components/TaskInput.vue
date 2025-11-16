<template>
  <div class="mb-4 flex gap-2">
    <input
      v-model="text"
      type="text"
      placeholder="Текст задачи"
      class="border px-2 py-1 flex-1"
      @keyup.enter="submit"
    />
    <datepicker v-model="date" :clearable="true" />
    <button
      @click="submit"
      class="bg-blue-600 px-4 text-white rounded"
    >
      Добавить
    </button>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import Datepicker from 'vue3-datepicker'

const text = ref('')
const date  = ref(new Date())

const emit = defineEmits(['add-task'])

function submit() {
  if (!text.value.trim()) return
  emit('add-task', { text: text.value.trim(), date: date.value })
  text.value = ''
  date.value  = new Date()
}
</script>