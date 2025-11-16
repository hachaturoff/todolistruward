<template>
  <div class="max-w-xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Список задач</h1>
    <TaskInput @add-task="addTask"/>

    <div class="mb-4 space-x-2">
      <button
        v-for="f in filters"
        class="p-2"
        :key="f.value"
        @click="currentFilter = f.value"
        :class="{
          'font-bold underline': currentFilter === f.value,
          'text-gray-600': currentFilter !== f.value
        }"
      >
        {{ f.label }}
      </button>
    </div>

    <ul>
      <TaskItem
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @toggle-completed="toggleCompleted(task.id)"
        @delete-task="deleteTask(task.id)"
      />
    </ul>

    <button
      @click="deleteCompleted"
      class="mt-4 bg-red-600 px-3 py-1 rounded text-white"
      :disabled="completedCount === 0"
    >
      Удалить все завершенные
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import TaskItem from './components/TaskItem.vue'
import TaskInput from './components/TaskInput.vue'

const STORAGE_KEY = 'vue-todo-list'

const tasks = ref(
  JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').map(t => ({
    ...t,
    date: new Date(t.date)
  }))
)

const filters = [
  { label: 'Все', value: 'all' },
  { label: 'Активные', value: 'active' },
  { label: 'Завершенные', value: 'completed' },
  { label: 'Сегодня', value: 'today' },
  { label: 'Предстоящие', value: 'future' },
  { label: 'Просроченные', value: 'late' }
]

const currentFilter = ref('all')

function addTask(task) {
  
  if (!task.text.trim()) return;

  tasks.value.push({
    id: Date.now(),
    text: task.text.trim(),
    completed: false,
    date: task.date
  })
}

function toggleCompleted(id) {
  const task = tasks.value.find(t => t.id === id)
  if (task) task.completed = !task.completed
}

function deleteTask(id) {
  tasks.value = tasks.value.filter(t => t.id !== id)
}

function deleteCompleted() {
  tasks.value = tasks.value.filter(t => !t.completed)
}

const filteredTasks = computed(() => {
  const now = new Date()
  switch (currentFilter.value) {
    case 'active':
      return tasks.value.filter(t => !t.completed)
    case 'completed':
      return tasks.value.filter(t => t.completed)
    case 'today':
      return tasks.value.filter(t =>
        t.date.toDateString() === now.toDateString()
      )
    case 'future':
      return tasks.value.filter(t => t.date > now && !t.completed)
    case 'late':
      return tasks.value.filter(t => t.date < now && !t.completed)
    default:
      return tasks.value
  }
})

const completedCount = computed(() =>
  tasks.value.filter(t => t.completed).length
)

watch(
  tasks,
  (tasks) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tasks.map(t => ({...t, date: t.date.toISOString()})))
    )
  },
  { deep: true }
)
</script>

<style scoped>
.completed {
  text-decoration: line-through;
  opacity: 0.6;
}
</style>
