<template>
  <li class="flex items-center justify-between m-2 border rounded p-2 transition">

    <template v-if="!isEditing">
      <label :class="{ completed: task.completed }" class="flex items-center gap-2 flex-1 cursor-pointer">
        <input type="checkbox" :checked="task.completed" @change="$emit('toggle-completed')" />
        <div>
          <div>{{ task.text }}</div>
          <small class="text-gray-500">{{ formattedDate }}</small>
        </div>
      </label>

      <button @click="startEdit" class="text-orange-500 font-bold ml-4">
        Редактировать
      </button>
      <button @click="$emit('delete-task')" class="text-red-600 font-bold ml-4">
        ×
      </button>
    </template>

    <template v-else>
      <div class="flex-1 flex gap-2">
        <input
          v-model="draft.text"
          type="text"
          class="border px-2 py-1 rounded flex-1"
        />
        <input
          v-model="draft.date"
          type="date"
          class="border px-2 py-1 rounded"
        />
      </div>

      <button @click="save" class="text-green-600 font-bold ml-4">Сохранить</button>
      <button @click="cancel" class="text-gray-600 font-bold ml-4">Отмена</button>
    </template>
  </li>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ task: Object })
const emit  = defineEmits([
  'toggle-completed',
  'delete-task',
  'edit-task'
])

const isEditing = ref(false)
const draft     = ref({})

function startEdit() {
  draft.value = {
    text: props.task.text,
    date: props.task.date.toISOString().substr(0,10)  
  }
  isEditing.value = true
}

function save() {
  emit('edit-task', {
    id: props.task.id,
    text: draft.value.text.trim(),
    date: new Date(draft.value.date)
  })
  isEditing.value = false
}

function cancel() {
  isEditing.value = false
}

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

